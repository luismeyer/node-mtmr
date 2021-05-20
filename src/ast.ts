import { parse } from "acorn";
import { simple } from "acorn-walk";
import { generate } from "astring";
import {
  ArrowFunctionExpressionNode,
  CallExpressionNode,
  CustomNode,
  FunctionDeclarationNode,
  IdentifierNode,
  LiteralNode,
  ProgramNode,
  VariableDeclarationNode,
  VariableDeclaratorNode,
} from "./typings/ast";
import { randomName } from "./utils";

const ecmaVersion = 2020;

type ParsedImport = {
  source: string;
  arg: string;
  node: CustomNode;
  isNodeModule: boolean;
};

export const imports = (src: string): ParsedImport[] => {
  const rootNode = parse(src, { ecmaVersion });
  let result: ParsedImport[] = [];

  simple(rootNode, {
    VariableDeclarator: (node: VariableDeclaratorNode) => {
      if (
        node.init.type === "CallExpression" &&
        node.init.callee.type === "Identifier" &&
        node.init.callee.name === "require"
      ) {
        const arg = node.init.arguments
          .filter((arg) => arg.type === "Literal")
          .map((literal: LiteralNode) => literal.value)
          .join("");

        result = [
          ...result,
          {
            arg,
            node,
            source: node.loc?.source ?? "",
            isNodeModule: arg.startsWith("."),
          },
        ];
      }
    },
  });

  return result;
};

export const identifiers = (src: string): Set<string> => {
  const rootNode = parse(src, { ecmaVersion });
  const result = new Set<string>();

  simple(rootNode, {
    Identifier: (node: IdentifierNode) => {
      result.add(node.name);
    },
  });

  return result;
};

export type ParsedDefinition = {
  name?: string;
  names?: string[];
  node: CustomNode;
};

export const definitions = (src: string): ParsedDefinition[] => {
  const rootNode = parse(src, { ecmaVersion });
  const variables: ParsedDefinition[] = [];

  simple(rootNode, {
    VariableDeclaration: (node: VariableDeclarationNode): void => {
      node.declarations.forEach((declerationNode) => {
        if (declerationNode.type !== "VariableDeclarator") {
          return;
        }

        // Normal variable definitions
        if (declerationNode.id.type === "Identifier") {
          variables.push({
            name: declerationNode.id.name,
            node,
          });
        }

        // Destructured definitions
        if (declerationNode.id.type === "ObjectPattern") {
          const names = declerationNode.id.properties
            .map((prop) => prop.value)
            .filter((value) => value.type === "Identifier")
            .map((value: IdentifierNode) => value.name);

          variables.push({
            names,
            node,
          });
        }

        // Destructured Array definitions
        if (declerationNode.id.type === "ArrayPattern") {
          const names = declerationNode.id.elements
            .filter((element) => element.type === "Identifier")
            .map((element: IdentifierNode) => element.name);

          variables.push({
            names,
            node,
          });
        }
      });
    },
    FunctionDeclaration: (node: FunctionDeclarationNode): void => {
      if (node.id.type === "Identifier") {
        variables.push({
          name: node.id.name,
          node,
        });
      }
    },
  });

  return variables;
};

export const createNamedLambda = (
  lambdaExpression: ArrowFunctionExpressionNode,
  lambdaName: string
): VariableDeclarationNode => ({
  type: "VariableDeclaration",
  start: 0,
  end: 0,
  declarations: [
    {
      type: "VariableDeclarator",
      start: 0,
      end: 0,
      id: {
        type: "Identifier",
        start: 0,
        end: 0,
        name: lambdaName,
      },
      init: lambdaExpression,
    },
  ],
  kind: "const",
});

export const createLambdaCall = (lambdaName: string): CallExpressionNode => ({
  type: "CallExpression",
  start: 0,
  end: 0,
  callee: {
    type: "Identifier",
    start: 0,
    end: 0,
    name: lambdaName,
  },
  arguments: [],
  optional: false,
});

export const createProgram = (nodes: CustomNode[]): ProgramNode => ({
  type: "Program",
  sourceType: "script",
  start: 0,
  end: 0,
  body: nodes,
});

export const prependNodes = (
  node: CustomNode,
  newNodes: CustomNode[]
): void => {
  if ("body" in node) {
    node.body = [...newNodes, ...node.body];
  }
};

export const callUnnamedLambda = (node: CustomNode): void => {
  if (node.type !== "Program") {
    return;
  }

  let calls: CallExpressionNode[] = [];

  node.body = node.body.map((bodyNode) => {
    if (
      bodyNode.type === "ExpressionStatement" &&
      bodyNode.expression.type === "ArrowFunctionExpression" &&
      !bodyNode.expression.id
    ) {
      const lambdaName = "var" + randomName();
      const lambda = createNamedLambda(bodyNode.expression, lambdaName);
      const lambdaCall: CustomNode = createLambdaCall(lambdaName);

      calls = [...calls, lambdaCall];
      return lambda;
    }

    return bodyNode;
  });

  node.body = [...node.body, ...calls];
};

const findMissingDependencyNodes = (
  fcSrc: string,
  fileSrc: string
): CustomNode[] => {
  // find all definitions that aren't in the fc scope
  const defs = definitions(fileSrc);

  // find all identifiers in the fc scope that might reference a definition outside scope
  const srcIds = identifiers(fcSrc);

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

export const fixMissingDependencyNodes = (
  outNodes: CustomNode[],
  fcSrc: string,
  fileSrc: string
): CustomNode[] => {
  const missingNodes = findMissingDependencyNodes(fcSrc, fileSrc);

  if (missingNodes.length === 0) {
    return outNodes;
  }

  return fixMissingDependencyNodes(
    [...missingNodes, ...outNodes],
    generate(createProgram(missingNodes)),
    fileSrc
  );
};
