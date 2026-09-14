/**
 * Require every utility class in a JSX `className` to own its own line, with
 * the block wrapped in a leading and trailing newline.
 *
 *   className="
 *     flex
 *     items-center
 *   "
 *
 * Covered:
 *   - `className="..."` — no exemptions, a single class still gets its own line
 *   - `className={`...`}` and the static quasis of `className={`...${x}...`}`
 *   - string literals nested inside those `${}` expressions, but only when they
 *     hold two or more classes: a lone class cannot be split while staying
 *     inline, and forcing it outward is noise
 *
 * Not covered (deliberately): `className={variable}` / `className={fn(...)}`,
 * `className={"..."}` (a JS string cannot hold a real newline), and object
 * properties named `className`.
 *
 * Prettier owns the surrounding layout; this rule owns the inside of the
 * string, which Prettier never touches.
 */

const MESSAGE_ID = "onePerLine"

/** Split one line into class tokens. [ \t] rather than \s so that a
 *  full-width space inside a class name stays part of the token. */
function tokensOf(line) {
  return line
    .trim()
    .split(/[ \t]+/)
    .filter(Boolean)
}

function isNormalised(content) {
  if (!content.startsWith("\n")) return false
  if (!/\n[ \t]*$/.test(content)) return false
  return content
    .split("\n")
    .slice(1, -1)
    .every(line => tokensOf(line).length <= 1)
}

function normalise(content, contentIndent, closingIndent) {
  const lines = []

  for (const line of content.replace(/\r\n?/g, "\n").split("\n")) {
    const tokens = tokensOf(line)
    if (tokens.length === 0) lines.push("")
    else lines.push(...tokens)
  }

  while (lines.length > 0 && lines[0] === "") lines.shift()
  while (lines.length > 0 && lines[lines.length - 1] === "") lines.pop()

  const rendered = lines
    .map(line => (line === "" ? "" : contentIndent + line))
    .join("\n")

  return `\n${rendered}\n${closingIndent}`
}

function classCount(content) {
  return tokensOf(content.replace(/\n/g, " ")).length
}

export default {
  meta: {
    type: "layout",
    fixable: "code",
    schema: [],
    messages: {
      [MESSAGE_ID]: "Each class in className must be on its own line.",
    },
  },

  create(context) {
    const sourceCode = context.sourceCode
    const visitorKeys = sourceCode.visitorKeys

    const locOf = range => ({
      start: sourceCode.getLocFromIndex(range[0]),
      end: sourceCode.getLocFromIndex(range[1]),
    })

    /**
     * Indent the attribute itself sits at: the owning element's indent plus two.
     * `node.parent` is the JSXAttributes container, whose start is the *first*
     * attribute — two deeper than the element — so walk up to the element.
     */
    function attrIndentOf(node) {
      let element = node.parent
      while (
        element &&
        element.type !== "JSXOpeningElement" &&
        element.type !== "JSXSelfClosingElement"
      ) {
        element = element.parent
      }
      if (!element) return "  "

      const start = element.range[0]
      const lineStart = sourceCode.text.lastIndexOf("\n", start - 1) + 1
      return /^[ \t]*/.exec(sourceCode.text.slice(lineStart, start))[0] + "  "
    }

    function report(range, content, contentIndent, closingIndent) {
      context.report({
        loc: locOf(range),
        messageId: MESSAGE_ID,
        fix: fixer =>
          fixer.replaceTextRange(
            range,
            normalise(content, contentIndent, closingIndent),
          ),
      })
    }

    /** Check a template literal's static quasis, then recurse into `${}`. */
    function checkTemplate(node, contentIndent, closingIndent) {
      for (const quasi of node.quasis) {
        const raw = quasi.value.raw
        if (raw.trim() === "") continue
        if (isNormalised(raw)) continue
        // The quasi's range spans its delimiters, so offset past the opening
        // backtick or `}` by one to address the raw text itself.
        report(
          [quasi.range[0] + 1, quasi.range[0] + 1 + raw.length],
          raw,
          contentIndent,
          contentIndent,
        )
      }

      for (const expression of node.expressions) {
        walkLiterals(expression, contentIndent + "  ", closingIndent)
      }
    }

    /** Recurse through an expression, checking string literals and templates. */
    function walkLiterals(node, contentIndent, closingIndent) {
      if (!node || typeof node.type !== "string") return

      if (node.type === "TemplateLiteral") {
        checkTemplate(node, contentIndent, closingIndent)
        return
      }

      if (node.type === "Literal" && typeof node.value === "string") {
        const value = node.value
        // A JS string cannot carry a real newline, so splitting one means
        // rewriting it as a template literal. Only worth doing for two or more
        // classes; a lone class is already unambiguous inline.
        if (classCount(value) < 2) return
        context.report({
          loc: locOf(node.range),
          messageId: MESSAGE_ID,
          fix: fixer =>
            fixer.replaceTextRange(
              node.range,
              "`" + normalise(value, contentIndent, closingIndent) + "`",
            ),
        })
        return
      }

      for (const key of visitorKeys[node.type] || []) {
        const child = node[key]
        if (Array.isArray(child)) {
          for (const item of child)
            walkLiterals(item, contentIndent, closingIndent)
        } else if (child) {
          walkLiterals(child, contentIndent, closingIndent)
        }
      }
    }

    return {
      JSXAttribute(node) {
        if (node.name.type !== "JSXIdentifier") return
        if (node.name.name !== "className") return
        if (!node.value) return

        const attrIndent = attrIndentOf(node)
        const contentIndent = attrIndent + "  "

        // className="a b" — a JSX string literal, which may hold real newlines.
        if (node.value.type === "Literal") {
          const range = node.value.range
          const raw = sourceCode.text.slice(range[0], range[1])
          const content = raw.slice(1, -1)
          if (content.trim() === "") return
          if (isNormalised(content)) return
          report(
            [range[0] + 1, range[1] - 1],
            content,
            contentIndent,
            attrIndent,
          )
          return
        }

        if (node.value.type !== "JSXExpressionContainer") return
        const expression = node.value.expression
        if (!expression) return

        if (expression.type === "TemplateLiteral") {
          checkTemplate(expression, contentIndent, attrIndent)
          return
        }

        if (
          expression.type === "Literal" &&
          typeof expression.value === "string"
        ) {
          // className={"a b"} — report but do not fix: rewriting a JS string into
          // a template literal is a shape change this rule should not guess at.
          if (classCount(expression.value) < 2) return
          context.report({
            loc: locOf(expression.range),
            messageId: MESSAGE_ID,
          })
        }
      },
    }
  },
}
