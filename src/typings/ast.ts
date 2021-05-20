import { Node } from "acorn";

export type VariableDeclarationNode = Node & {
  type: "VariableDeclaration";
  declarations: CustomNode[];
  kind: string;
};

export type VariableDeclaratorNode = Node & {
  type: "VariableDeclarator";
  id: CustomNode;
  init: CustomNode;
};

export type IdentifierNode = Node & {
  type: "Identifier";
  name: string;
};

export type ObjectPatternNode = Node & {
  type: "ObjectPattern";
  properties: PropertyNode[];
};

export type ArrayPatternNode = Node & {
  type: "ArrayPattern";
  elements: CustomNode[];
};

export type PropertyNode = Node & {
  type: "Property";
  method: boolean;
  shorthand: boolean;
  computed: boolean;
  key: CustomNode;
  kind: "init";
  value: CustomNode;
};

export type FunctionDeclarationNode = Node & {
  type: "FunctionDeclaration";
  id: CustomNode;
  expression: false;
  generator: false;
  async: false;
  params: [];
  body: CustomNode[];
};

export type ExpressionStatementNode = Node & {
  type: "ExpressionStatement";
  expression: CustomNode;
};

export type AssignmentExpressionNode = Node & {
  type: "AssignmentExpression";
  operator: string;
  left: CustomNode;
  right: CustomNode;
};

export type CallExpressionNode = Node & {
  type: "CallExpression";
  callee: CustomNode;
  arguments: CustomNode[];
  optional: false;
};

export type ProgramNode = Node & {
  type: "Program";
  body: CustomNode[];
  sourceType: string;
};

export type ArrowFunctionExpressionNode = Node & {
  type: "ArrowFunctionExpression";
  id: CustomNode;
  expression: boolean;
  generator: boolean;
  async: boolean;
  params: string[];
  body: CustomNode[];
};

export type LiteralNode = Node & {
  type: "Literal";
  value: string;
  raw: string;
};

export type CustomNode =
  | VariableDeclarationNode
  | VariableDeclaratorNode
  | IdentifierNode
  | ObjectPatternNode
  | ArrayPatternNode
  | FunctionDeclarationNode
  | ExpressionStatementNode
  | AssignmentExpressionNode
  | CallExpressionNode
  | ProgramNode
  | ArrowFunctionExpressionNode
  | LiteralNode;
