import fs from "node:fs"
import path from "node:path"

import * as p from "@clack/prompts"

import type { Database, Domain, Runtime } from "../utils"
import { databases } from "../utils"
import { buildReadme } from "./readme"

type BackendRuntime = Extract<Runtime, "node" | "bun">

type BackendOptions = {
  domain: Extract<Domain, "backend">
  runtime: BackendRuntime
  topic: string
}

// Collects the optional framework and database settings.
const promptBackendOptions = async () => {
  const frameworkInput = await p.text({
    message: "Framework? (optional, press Enter to skip)",
    placeholder: "e.g. express, hono",
  })

  if (p.isCancel(frameworkInput)) return p.cancel("Cancelled")

  const framework = frameworkInput || undefined

  let db: Database | undefined

  const useDb = await p.confirm({
    message: "Add a database?",
  })

  if (p.isCancel(useDb)) return p.cancel("Cancelled")

  if (useDb) {
    const selectedDb = await p.select({
      message: "Which database?",
      options: databases.map(database => ({
        value: database,
        label: database,
      })),
    })

    if (p.isCancel(selectedDb)) return p.cancel("Cancelled")

    db = selectedDb
  }

  return { framework, db }
}

// Creates a backend topic folder and its README.
export const createBackendTopic = async ({
  domain,
  runtime,
  topic,
}: BackendOptions) => {
  const options = await promptBackendOptions()

  // A cancelled prompt exits without creating anything.
  if (!options) return

  const { framework, db } = options

  // Include the framework and database in the folder name when provided.
  const folderName = [topic, framework, db].filter(Boolean).join("-")
  const dir = path.join(domain, runtime, folderName)

  // Prevent accidentally creating a topic in an existing directory.
  if (fs.existsSync(dir)) {
    p.cancel(`${dir} already exists`)
    process.exit(1)
  }

  fs.mkdirSync(dir, { recursive: true })

  fs.writeFileSync(
    path.join(dir, "README.md"),
    buildReadme(topic, domain, runtime, "App.ts", framework, db)
  )

  p.outro(`Created ${dir}`)
}
