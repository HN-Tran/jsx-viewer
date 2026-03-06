import * as Babel from "@babel/standalone";

/**
 * Custom Babel plugin that rewrites:
 *   import X from "y"        → const X = __require("y").default
 *   import { A, B } from "y" → const { A, B } = __require("y")
 *   import * as X from "y"   → const X = __require("y")
 *   export default X          → __exports.default = X
 *   export { A, B }           → Object.assign(__exports, { A, B })
 *   export const X = ...      → const X = ...; __exports.X = X
 */
function importRewritePlugin() {
  return {
    visitor: {
      ImportDeclaration(path: any) {
        const source = path.node.source.value;
        const specifiers = path.node.specifiers;

        if (specifiers.length === 0) {
          // Side-effect import: import "foo" → __require("foo")
          path.replaceWith({
            type: "ExpressionStatement",
            expression: {
              type: "CallExpression",
              callee: { type: "Identifier", name: "__require" },
              arguments: [{ type: "StringLiteral", value: source }],
            },
          });
          return;
        }

        const declarations: any[] = [];

        const defaultSpec = specifiers.find((s: any) => s.type === "ImportDefaultSpecifier");
        const namespaceSpec = specifiers.find((s: any) => s.type === "ImportNamespaceSpecifier");
        const namedSpecs = specifiers.filter((s: any) => s.type === "ImportSpecifier");

        if (namespaceSpec) {
          // import * as X from "y" → const X = __require("y")
          declarations.push({
            type: "VariableDeclaration",
            kind: "const",
            declarations: [
              {
                type: "VariableDeclarator",
                id: { type: "Identifier", name: namespaceSpec.local.name },
                init: {
                  type: "CallExpression",
                  callee: { type: "Identifier", name: "__require" },
                  arguments: [{ type: "StringLiteral", value: source }],
                },
              },
            ],
          });
        }

        if (defaultSpec) {
          // import X from "y" → const X = __require("y").default || __require("y")
          declarations.push({
            type: "VariableDeclaration",
            kind: "const",
            declarations: [
              {
                type: "VariableDeclarator",
                id: { type: "Identifier", name: defaultSpec.local.name },
                init: {
                  type: "LogicalExpression",
                  operator: "||",
                  left: {
                    type: "MemberExpression",
                    object: {
                      type: "CallExpression",
                      callee: { type: "Identifier", name: "__require" },
                      arguments: [{ type: "StringLiteral", value: source }],
                    },
                    property: { type: "Identifier", name: "default" },
                    computed: false,
                  },
                  right: {
                    type: "CallExpression",
                    callee: { type: "Identifier", name: "__require" },
                    arguments: [{ type: "StringLiteral", value: source }],
                  },
                },
              },
            ],
          });
        }

        if (namedSpecs.length > 0) {
          // import { A, B as C } from "y" → const { A, B: C } = __require("y")
          declarations.push({
            type: "VariableDeclaration",
            kind: "const",
            declarations: [
              {
                type: "VariableDeclarator",
                id: {
                  type: "ObjectPattern",
                  properties: namedSpecs.map((s: any) => ({
                    type: "ObjectProperty",
                    key: { type: "Identifier", name: s.imported.name },
                    value: { type: "Identifier", name: s.local.name },
                    shorthand: s.imported.name === s.local.name,
                    computed: false,
                  })),
                },
                init: {
                  type: "CallExpression",
                  callee: { type: "Identifier", name: "__require" },
                  arguments: [{ type: "StringLiteral", value: source }],
                },
              },
            ],
          });
        }

        if (declarations.length > 0) {
          path.replaceWithMultiple(declarations);
        } else {
          path.remove();
        }
      },

      ExportDefaultDeclaration(path: any) {
        const decl = path.node.declaration;
        if (decl.type === "FunctionDeclaration" || decl.type === "ClassDeclaration") {
          const name = decl.id?.name || "__default";
          // Keep the declaration, assign to __exports.default
          path.replaceWithMultiple([
            { ...decl, type: decl.type },
            {
              type: "ExpressionStatement",
              expression: {
                type: "AssignmentExpression",
                operator: "=",
                left: {
                  type: "MemberExpression",
                  object: { type: "Identifier", name: "__exports" },
                  property: { type: "Identifier", name: "default" },
                  computed: false,
                },
                right: { type: "Identifier", name: name },
              },
            },
          ]);
        } else {
          path.replaceWith({
            type: "ExpressionStatement",
            expression: {
              type: "AssignmentExpression",
              operator: "=",
              left: {
                type: "MemberExpression",
                object: { type: "Identifier", name: "__exports" },
                property: { type: "Identifier", name: "default" },
                computed: false,
              },
              right: decl,
            },
          });
        }
      },

      ExportNamedDeclaration(path: any) {
        const decl = path.node.declaration;
        const specifiers = path.node.specifiers;

        if (decl) {
          // export const X = ... or export function X() {}
          const statements: any[] = [decl];

          if (decl.type === "VariableDeclaration") {
            for (const d of decl.declarations) {
              statements.push({
                type: "ExpressionStatement",
                expression: {
                  type: "AssignmentExpression",
                  operator: "=",
                  left: {
                    type: "MemberExpression",
                    object: { type: "Identifier", name: "__exports" },
                    property: { type: "Identifier", name: d.id.name },
                    computed: false,
                  },
                  right: { type: "Identifier", name: d.id.name },
                },
              });
            }
          } else if (decl.id) {
            statements.push({
              type: "ExpressionStatement",
              expression: {
                type: "AssignmentExpression",
                operator: "=",
                left: {
                  type: "MemberExpression",
                  object: { type: "Identifier", name: "__exports" },
                  property: { type: "Identifier", name: decl.id.name },
                  computed: false,
                },
                right: { type: "Identifier", name: decl.id.name },
              },
            });
          }
          path.replaceWithMultiple(statements);
        } else if (specifiers.length > 0) {
          // export { A, B }
          const assignments = specifiers.map((s: any) => ({
            type: "ExpressionStatement",
            expression: {
              type: "AssignmentExpression",
              operator: "=",
              left: {
                type: "MemberExpression",
                object: { type: "Identifier", name: "__exports" },
                property: { type: "Identifier", name: s.exported.name },
                computed: false,
              },
              right: { type: "Identifier", name: s.local.name },
            },
          }));
          path.replaceWithMultiple(assignments);
        } else {
          path.remove();
        }
      },
    },
  };
}

export interface TranspileResult {
  code: string;
  error: null;
}

export interface TranspileError {
  code: null;
  error: string;
}

export function transpile(source: string, filename: string): TranspileResult | TranspileError {
  try {
    const result = Babel.transform(source, {
      filename,
      presets: [
        ["react", { runtime: "classic" }],
        ["typescript", { isTSX: true, allExtensions: true }],
      ],
      plugins: [importRewritePlugin],
      sourceType: "module",
    });

    if (!result?.code) {
      return { code: null, error: "Babel returned no output" };
    }

    return { code: result.code, error: null };
  } catch (e: any) {
    return { code: null, error: e.message || String(e) };
  }
}
