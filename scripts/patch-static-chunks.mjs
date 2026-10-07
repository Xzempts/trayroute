import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const chunks = join("out", "_next", "static", "chunks")
const files = readdirSync(chunks).filter((name) => name.startsWith("turbopack-") && name.endsWith(".js"))
if (files.length === 0) throw new Error("No Turbopack runtime chunk in out/")

const from = 'I("string"==typeof e?E(e):e.src).resolve()'
const to = 'I("string"==typeof e?E(e):e.src).resolve(),"string"!=typeof e&&I(String(e.src).split(/[?#]/)[0]).resolve()'

for (const name of files) {
  const path = join(chunks, name)
  const source = readFileSync(path, "utf8")
  const count = source.split(from).length - 1
  if (count !== 1) throw new Error(`${name} has ${count} chunk-register sites, expected 1`)
  writeFileSync(path, source.replace(from, to))
}
