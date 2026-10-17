import { render } from "pele";
import { visit } from "unist-util-visit";

/**
 * Renders ```mermaid code blocks to static SVG at build time with Pele, so the
 * docs ship no diagram runtime. Colors come from `--pele-*` CSS variables set in
 * `src/css/custom.css`, which keeps diagrams in sync with light/dark mode.
 *
 * A diagram that Pele cannot parse fails the build instead of shipping broken
 * markup, because every locale copy of a page renders the same diagram source.
 */
export default function remarkPele() {
  return (tree, file) => {
    let index = 0;
    visit(tree, "code", (node, position, parent) => {
      if (node.lang !== "mermaid" || !parent || position === undefined) return;

      let svg;
      try {
        // Docusaurus renders every page into one document per route, so ids must
        // stay unique across diagrams on the same page.
        ({ svg } = render(node.value, { idPrefix: `pele-${index}-` }));
      } catch (error) {
        file.fail(`Pele could not render this mermaid diagram: ${error.message}`, node);
      }
      index += 1;

      parent.children[position] = {
        type: "mdxJsxFlowElement",
        name: "div",
        attributes: [
          { type: "mdxJsxAttribute", name: "className", value: "pele-diagram" },
          {
            type: "mdxJsxAttribute",
            name: "dangerouslySetInnerHTML",
            value: {
              type: "mdxJsxAttributeValueExpression",
              value: "",
              data: { estree: htmlObjectExpression(svg) },
            },
          },
        ],
        children: [],
      };
    });
  };
}

function htmlObjectExpression(html) {
  return {
    type: "Program",
    sourceType: "module",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "ObjectExpression",
          properties: [
            {
              type: "Property",
              kind: "init",
              method: false,
              shorthand: false,
              computed: false,
              key: { type: "Identifier", name: "__html" },
              value: { type: "Literal", value: html },
            },
          ],
        },
      },
    ],
  };
}
