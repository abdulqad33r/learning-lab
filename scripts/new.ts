import fs from "node:fs"
import path from "node:path"

import {
  databases,
  isDatabase,
  isDomain,
  isRuntime,
  validRuntimes,
} from "./utils"

const [, , domain, runtime, topic, framework, db] = process.argv
// e.g. bun run new backend bun rate-limiting hono postgres
// e.g. bun run new backend node rate-limiting express

if (!domain || !runtime || !topic || !isDomain(domain)) {
  console.error(
    "Usage: bun run new <frontend|backend> <runtime> <topic> [framework] [db]"
  )
  process.exit(1)
}

if (!isRuntime(domain, runtime)) {
  console.error(
    `Invalid runtime "${runtime}" for ${domain}. Use: ${validRuntimes[domain].join(", ")}`
  )
  process.exit(1)
}

if (db !== undefined && !isDatabase(db)) {
  console.error(
    `Invalid database "${db}". Use: ${databases.join(", ")}`
  )
  process.exit(1)
}

const nameParts = [topic, framework, db].filter(Boolean)
const folderName = nameParts.join("-") // rate-limiting-hono-postgres

const dir = path.join(domain, runtime, folderName)
fs.mkdirSync(dir, { recursive: true })

const ext =
  domain === "backend" ? "ts" : runtime === "react" ? "tsx" : "ts"

fs.writeFileSync(
  path.join(dir, "README.md"),
  `# ${topic}

tags: ${domain}${framework ? `, ${framework}` : ""}${db ? `, ${db}` : ""}

runtime: ${runtime}

framework: ${framework ?? "-"}

database: ${db ?? "-"}

date: ${new Date().toISOString().slice(0, 10)}

## What

## Snippet

See demo.${ext}

## When to use
`
)

// fs.writeFileSync(path.join(dir, `demo.${ext}`), "")

console.log(`Created ${dir}`)
