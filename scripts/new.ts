import fs from "node:fs"
import path from "node:path"

import * as p from "@clack/prompts"

import { createBackendTopic } from "./helpers/backend"
import { createFrontendTopic } from "./helpers/frontend"
import type { Runtime } from "./utils"
import { domains, validRuntimes } from "./utils"

// Runtime types supported specifically by the frontend scaffolder.
type FrontendRuntime = Extract<Runtime, "react" | "vanilla">

// Runtime types supported specifically by the backend topic creator.
type BackendRuntime = Extract<Runtime, "node" | "bun">

// Ask the questions shared by frontend and backend topics.
const promptCommonOptions = async () => {
  const domain = await p.select({
    message: "Domain?",
    options: domains.map(value => ({
      value,
      label: value,
    })),
  })

  if (p.isCancel(domain)) return p.cancel("Cancelled")

  const runtime = await p.select({
    message: "Runtime?",
    options: validRuntimes[domain].map(value => ({
      value,
      label: value,
    })),
  })

  if (p.isCancel(runtime)) return p.cancel("Cancelled")

  const topic = await p.text({
    message: "Topic name?",
    placeholder: "e.g. rate-limiting",
    validate: value => {
      if (!value) return "Topic name is required"

      // Check the topic path before collecting more options.
      const dir = path.join(domain, runtime, value)

      if (fs.existsSync(dir)) {
        return `Topic already exists ${domain}\\${runtime}\\${value}`
      }
    },
  })

  if (p.isCancel(topic)) return p.cancel("Cancelled")

  return { domain, runtime, topic }
}

// Main workflow: collect common options, then delegate by domain.
const main = async () => {
  p.intro("Create a new practice topic")

  const options = await promptCommonOptions()

  // Stop if the user cancels any of the common prompts.
  if (!options) return

  const { domain, runtime, topic } = options

  if (domain === "frontend") {
    await createFrontendTopic(runtime as FrontendRuntime, topic)
    return
  }

  await createBackendTopic({
    domain: "backend",
    runtime: runtime as BackendRuntime,
    topic,
  })
}

main()
