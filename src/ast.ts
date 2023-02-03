import { parse, traverse } from "@babel/core";
import * as t from "@babel/types";
import generate from "@babel/generator";
import { randomName } from "./utils";
import { existsSync, readFileSync, statSync } from "fs";
import { dirname, extname, join, resolve } from "path";

type ParsedImport = {
  source: string;
  arg: string;
  node: t.VariableDeclarator;
  isJsFile: boolean;
  isNodeModule: boolean;
};

export const imports = (src: string): ParsedImport[] => {
  const rootNode = parse(src);
  let result: ParsedImport[] = [];

  traverse(rootNode, {
    VariableDeclarator: function (path) {
      if (
        t.isCallExpression(path.node.init) &&
        t.isIdentifier(path.node.init.callee) &&
        path.node.init.callee.name === "require"
      ) {
        const arg = path.node.init.arguments
          .filter((arg): arg is t.StringLiteral => t.isStringLiteral(arg))
          .map((literal) => literal.value)
          .join("");

        const argExtName = extname(arg);

        result = [
          ...result,
          {
            arg,
            node: path.node,
            source: src.slice(path.parent.start ?? 0, path.parent.end ?? 0),
            isNodeModule: !arg.startsWith("."),
            isJsFile: argExtName ? argExtName === ".js" : false,
          },
        ];
      }
    },
  });

  return result;
};

export const identifierNames = (src: string): Set<string> => {
  const rootNode = parse(src);
  const result = new Set<string>();

  traverse(rootNode, {
    Identifier: ({ node }) => {
      result.add(node.name);
    },
  });

  return result;
};

export type ParsedDefinition = {
  name?: string;
  names?: string[];
  node: t.Statement;
};

export const definitions = (src: string): ParsedDefinition[] => {
  const rootNode = parse(src);
  const variables: ParsedDefinition[] = [];

  traverse(rootNode, {
    VariableDeclaration: ({ node }): void => {
      node.declarations.forEach((declerationNode) => {
        if (!t.isVariableDeclarator(declerationNode)) {
          return;
        }

        // Normal variable definitions
        if (t.isIdentifier(declerationNode.id)) {
          variables.push({
            name: declerationNode.id.name,
            node,
          });
        }

        // Destructured definitions
        if (t.isObjectPattern(declerationNode.id)) {
          const names = declerationNode.id.properties
            .filter((prop) => t.isObjectProperty(prop))
            .map((prop: t.ObjectProperty) => prop.value)
            .filter((value) => value.type === "Identifier")
            .map((value: t.Identifier) => value.name);

          variables.push({
            names,
            node,
          });
        }

        // Destructured Array definitions
        if (t.isArrayPattern(declerationNode.id)) {
          const names = declerationNode.id.elements
            .filter((element) => element && element.type === "Identifier")
            .map((element: t.Identifier) => element.name);

          variables.push({
            names,
            node,
          });
        }
      });
    },
    FunctionDeclaration: ({ node }): void => {
      if (node.id?.type === "Identifier") {
        variables.push({
          name: node.id.name,
          node,
        });
      }
    },
  });

  return variables;
};

const createNamedLambda = (
  lambdaExpression: t.ArrowFunctionExpression,
  lambdaName: string
): t.VariableDeclaration =>
  t.variableDeclaration("const", [
    t.variableDeclarator(t.identifier(lambdaName), lambdaExpression),
  ]);

const createLambdaCall = (lambdaName: string): t.ExpressionStatement =>
  t.expressionStatement(t.callExpression(t.identifier(lambdaName), []));

export const prependNodes = (node: t.File, newNodes: t.Statement[]): void => {
  node.program.body = [...newNodes, ...node.program.body];
};

export const callUnnamedLambda = (node: t.File): void => {
  let calls: t.ExpressionStatement[] = [];

  node.program.body = node.program.body.map((bodyNode) => {
    if (
      bodyNode.type !== "ExpressionStatement" ||
      bodyNode.expression.type !== "ArrowFunctionExpression"
    ) {
      return bodyNode;
    }

    const lambdaName = "var" + randomName();
    const lambda = createNamedLambda(bodyNode.expression, lambdaName);
    const lambdaCall = createLambdaCall(lambdaName);

    calls = [...calls, lambdaCall];
    return lambda;
  });

  node.program.body = [...node.program.body, ...calls];
};

const findMissingStatements = (
  fcSrc: string,
  fileSrc: string
): t.Statement[] => {
  // find all definitions that aren't in the fc scope
  const defs = definitions(fileSrc);

  // find all identifiers in the fc scope that might reference a definition outside scope
  const srcIds = identifierNames(fcSrc);

  // find all definitions in the fc scope so the nodes wont get declared twice
  const srcDefs = definitions(fcSrc);

  const inSrcDefs = (defName: string) =>
    srcDefs.map((srcDef) => srcDef.name).includes(defName) ||
    srcDefs
      .map(({ names }) => names)
      .some((srcNames) => srcNames?.includes(defName));

  // select all nodes that are referenced by the fc
  return defs
    .filter((def) => {
      const fcIncludesName = def.name && srcIds.has(def.name);
      const fcIncludesNames = def.names && def.names.some((n) => srcIds.has(n));
      const fcIncludes = Boolean(fcIncludesName || fcIncludesNames);

      const fcDoesntDefineName = def.name ? !inSrcDefs(def.name) : true;
      const fcDoesntDefineNames = def.names ? !def.names.some(inSrcDefs) : true;
      const fcDoesntDefine = Boolean(fcDoesntDefineName && fcDoesntDefineNames);

      return fcIncludes && fcDoesntDefine;
    })
    .map((def) => def.node);
};

export const missingStatements = (
  fcSrc: string,
  fileSrc: string,
  outNodes: t.Statement[] = []
): t.Statement[] => {
  const missingNodes = findMissingStatements(fcSrc, fileSrc);

  if (missingNodes.length === 0) {
    return outNodes;
  }

  const newFcSrc = generate(t.program(missingNodes)).code;

  return missingStatements(newFcSrc, fileSrc, [...missingNodes, ...outNodes]);
};

const relativeToFullPath = (relatativeToPath: string, relativePath: string) => {
  const rawPath = resolve(dirname(relatativeToPath), relativePath);
  let inputPath = relativePath;

  // fix imports from index files
  if (existsSync(rawPath) && statSync(rawPath).isDirectory()) {
    inputPath = join(inputPath, "index");
  }

  // add missing '.js' extension
  if (!extname(inputPath)) {
    inputPath = inputPath + extname(relatativeToPath);
  }

  return resolve(dirname(relatativeToPath), inputPath);
};

export const findAllImportPaths = (inPath: string): string[] => {
  const src = readFileSync(inPath).toString();
  const parsedImports = imports(src);

  const jsImports = parsedImports
    .filter(({ isNodeModule, isJsFile }) => !isNodeModule && isJsFile)
    .map(({ arg }) => relativeToFullPath(inPath, arg));

  const otherImports = parsedImports
    .filter(({ isNodeModule, isJsFile }) => !isNodeModule && !isJsFile)
    .map(({ arg }) => relativeToFullPath(inPath, arg));

  if (jsImports.length === 0) {
    return otherImports;
  }

  return [
    ...otherImports,
    ...jsImports,
    ...jsImports.reduce((acc, cur) => [...acc, ...findAllImportPaths(cur)], []),
  ];
};
