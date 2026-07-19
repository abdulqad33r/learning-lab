import fs from "node:fs"
import path from "node:path"

import type { Database, Domain, Runtime } from "./utils"

import { domains } from "./utils"

const query = process.argv[2]
if (!query) {
  console.error("Usage: bun search <tag|runtime|keyword>")
  process.exit(1)
}

const matches: {
  name: string
  domain: Domain
  runtime: Runtime
  tags: string
  framework: string
  database: Database | "-"
}[] = []

for (const domain of domains) {
  if (!fs.existsSync(domain)) continue
  for (const runtime of fs.readdirSync(domain) as Runtime[]) {
    const runtimeDir = path.join(domain, runtime)
    if (!fs.statSync(runtimeDir).isDirectory()) continue
    for (const name of fs.readdirSync(runtimeDir)) {
      const readmePath = path.join(runtimeDir, name, "README.md")
      if (!fs.existsSync(readmePath)) continue
      const content = fs.readFileSync(readmePath, "utf-8")
      const tags = content.match(/tags:\s*(.*)/)?.[1] ?? ""
      const framework = content.match(/framework:\s*(.*)/)?.[1] ?? "-"
      const database = (content.match(/database:\s*(.*)/)?.[1] ??
        "-") as Database | "-"
      const haystack =
        `${name} ${runtime} ${tags} ${framework} ${database}`.toLowerCase()

      if (haystack.includes(query.toLowerCase())) {
        matches.push({
          name,
          domain,
          runtime,
          tags,
          framework,
          database,
        })
      }
    }
  }
}

if (matches.length === 0) {
  console.log(`No matches for "${query}"`)
} else {
  console.log(`Matches for "${query}":\n`)
  for (const m of matches) {
    const meta = [m.framework, m.database]
      .filter(v => v && v !== "-")
      .join(", ")
    console.log(
      `  ${m.domain}/${m.runtime}/${m.name}  —  ${m.tags}${meta ? ` (${meta})` : ""}`
    )
  }
}
