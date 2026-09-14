/**
 * One-shot codemod: rewrite every JSX `className` literal so each utility
 * class owns its own line, wrapped in a leading and trailing newline.
 *
 * Idempotent — re-running on normalised output changes nothing. Blank lines
 * used as visual grouping are preserved.
 *
 * Template literals containing `${}` are skipped and reported: expanding them
 * needs a per-site judgement call, and there are only three.
 *
 *   node scripts/normalize-classnames.mjs
 */
import ts from "typescript"
import { readFileSync, readdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const SRC = fileURLToPath(new URL("../src", import.meta.url))

function collectTsx(dir, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) collectTsx(path, found)
    else if (entry.name.endsWith(".tsx")) found.push(path)
  }
  return found
}

/**
 * Indent the `className` attribute itself will sit at once Prettier has broken
 * the element's attributes one per line: the element's own indent plus two.
 */
function attrIndentOf(text, attr, sourceFile) {
  // attr.parent is the JsxAttributes container, not the element: once Prettier
  // has broken attributes one per line, that container starts at the *first*
  // attribute's indent, which is two deeper than the element's.
  let element = attr.parent
  while (
    element &&
    !ts.isJsxOpeningElement(element) &&
    !ts.isJsxSelfClosingElement(element)
  ) {
    element = element.parent
  }
  if (!element) return "  "

  const start = element.getStart(sourceFile)
  const lineStart = text.lastIndexOf("\n", start - 1) + 1
  const elementIndent = /^[ \t]*/.exec(text.slice(lineStart, start))[0]
  return elementIndent + "  "
}

/**
 * Split every line into individual class tokens, keep blank lines as grouping,
 * and re-emit the whole list indented one level inside the attribute.
 */
function normalise(body, attrIndent) {
  const contentIndent = attrIndent + "  "
  const lines = []

  for (const line of body.replace(/\r\n?/g, "\n").split("\n")) {
    // [ \t] rather than \s: a full-width space inside a class name is data, not
    // a separator, and splitting on \s would invent bogus tokens from it.
    const tokens = line
      .trim()
      .split(/[ \t]+/)
      .filter(Boolean)
    if (tokens.length === 0) lines.push("")
    else lines.push(...tokens)
  }

  while (lines.length > 0 && lines[0] === "") lines.shift()
  while (lines.length > 0 && lines[lines.length - 1] === "") lines.pop()

  const rendered = lines
    .map(line => (line === "" ? "" : contentIndent + line))
    .join("\n")

  return `\n${rendered}\n${attrIndent}`
}

const report = { files: 0, seen: 0, rewritten: 0, changes: [], skipped: [] }

for (const file of collectTsx(SRC)) {
  const text = readFileSync(file, "utf8")
  const sourceFile = ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )

  const edits = []

  const visit = node => {
    // Filter on the attribute name. Matching "any string literal containing a
    // space" instead would rewrite aria-label and style values.
    if (
      ts.isJsxAttribute(node) &&
      node.name.getText(sourceFile) === "className"
    ) {
      report.seen++
      const initializer = node.initializer

      if (initializer && ts.isStringLiteral(initializer)) {
        const start = initializer.getStart(sourceFile)
        const end = initializer.getEnd(sourceFile)
        const raw = text.slice(start, end)
        const quote = raw[0]
        edits.push({
          start,
          end,
          text:
            quote +
            normalise(raw.slice(1, -1), attrIndentOf(text, node, sourceFile)) +
            quote,
        })
      } else if (
        initializer &&
        ts.isJsxExpression(initializer) &&
        initializer.expression
      ) {
        const expression = initializer.expression
        if (ts.isNoSubstitutionTemplateLiteral(expression)) {
          const start = expression.getStart(sourceFile)
          const end = expression.getEnd(sourceFile)
          const raw = text.slice(start, end)
          edits.push({
            start,
            end,
            text:
              "`" +
              normalise(
                raw.slice(1, -1),
                attrIndentOf(text, node, sourceFile),
              ) +
              "`",
          })
        } else if (ts.isTemplateExpression(expression)) {
          const { line } = sourceFile.getLineAndCharacterOfPosition(
            expression.getStart(sourceFile),
          )
          report.skipped.push(`${file}:${line + 1}`)
        }
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)

  if (edits.length === 0) continue

  // Descending by start so earlier offsets stay valid while splicing.
  edits.sort((a, b) => b.start - a.start)

  let next = text
  let changed = 0
  for (const edit of edits) {
    if (next.slice(edit.start, edit.end) === edit.text) continue
    changed++
    const { line } = sourceFile.getLineAndCharacterOfPosition(edit.start)
    report.changes.push(`${file}:${line + 1}`)
    next = next.slice(0, edit.start) + edit.text + next.slice(edit.end)
  }

  if (changed > 0) {
    writeFileSync(file, next)
    report.files++
    report.rewritten += changed
  }
}

console.log(`className attributes seen: ${report.seen}`)
console.log(`rewritten: ${report.rewritten} across ${report.files} files`)
if (report.changes.length > 0) {
  console.log(`changed sites:`)
  for (const site of report.changes) console.log(`  ${site}`)
}
if (report.skipped.length > 0) {
  console.log(`skipped (contains \${} — edit by hand):`)
  for (const site of report.skipped) console.log(`  ${site}`)
}
