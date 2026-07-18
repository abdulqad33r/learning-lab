import fs from "node:fs"
import path from "node:path"

import { isDomain, isRuntime, validRuntimes } from "./utils"

const [, , domain, runtime, name] = process.argv
// e.g. bun run new frontend react context-api
// e.g. bun run new backend bun rate-limiting

if (!domain || !runtime || !name || !isDomain(domain)) {
  console.error(
    "Usage: bun new <frontend|backend> <runtime> <topic-name>"
  )
  console.error("  frontend runtimes: react, vanilla")
  console.error("  backend runtimes: node, bun")
  process.exit(1)
}

if (!isRuntime(domain, runtime)) {
  console.error(
    `Invalid runtime "${runtime}" for ${domain}. Use: ${validRuntimes[domain].join(", ")}`
  )
  process.exit(1)
}

const dir = path.join(domain, runtime, name)
fs.mkdirSync(dir, { recursive: true })

const ext = runtime === "react" ? "tsx" : "ts"
const demoExt = domain === "backend" ? "ts" : ext

fs.writeFileSync(
  path.join(dir, "README.md"),
  `# ${name}

tags: ${domain}

runtime: ${runtime}

date: ${new Date().toISOString().slice(0, 10)}

## What

## Snippet

See demo.${demoExt}

## When to use
`
)

// fs.writeFileSync(path.join(dir, `demo.${demoExt}`), "")

console.log(`Created ${dir}`)
