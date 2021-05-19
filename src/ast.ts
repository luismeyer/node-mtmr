import { parse } from "acorn";
import { simple } from "acorn-walk";
import {
  ArrowFunctionExpressionNode,
  CallExpressionNode,
  FunctionDeclarationNode,
  IdentifierNode,
  LiteralNode,
  VariableDeclarationNode,
  CustomNode,
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
  name: string;
  node: CustomNode;
};

export const definitions = (src: string): Set<ParsedDefinition> => {
  const rootNode = parse(src, { ecmaVersion });
  const variables = new Set<ParsedDefinition>();

  simple(rootNode, {
    VariableDeclaration: (node: VariableDeclarationNode): void => {
      node.declarations.forEach((declerationNode) => {
        if (declerationNode.type !== "VariableDeclarator") {
          return;
        }

        // Normal variable definitions
        if (declerationNode.id.type === "Identifier") {
          variables.add({
            name: declerationNode.id.name,
            node,
          });
        }

        // Destructured definitions
        if (declerationNode.id.type === "ObjectPattern") {
          declerationNode.id.properties.forEach((property) => {
            if (property.value.type === "Identifier") {
              variables.add({
                name: property.value.name,
                node,
              });
            }
          });
        }
      });
    },
    FunctionDeclaration: (node: FunctionDeclarationNode): void => {
      if (node.id.type === "Identifier") {
        variables.add({
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

export const prependNodes = (
  node: CustomNode,
  newNodes: CustomNode[]
): void => {
  if ("body" in node) {
    node.body = [...newNodes, ...node.body];
  }
};

export const callUnnamedLambdas = (node: CustomNode): void => {
  if (node.type === "Program") {
    node.body.forEach((bodyNode, index) => {
      if (
        bodyNode.type === "ExpressionStatement" &&
        bodyNode.expression.type === "ArrowFunctionExpression" &&
        !bodyNode.expression.id
      ) {
        const lambdaName = "var" + randomName();
        const lambda = createNamedLambda(bodyNode.expression, lambdaName);
        const lambdaCall: CustomNode = createLambdaCall(lambdaName);

        node.body[index] = lambda;
        node.body = [...node.body, lambdaCall];
      }
    });
  }
};
