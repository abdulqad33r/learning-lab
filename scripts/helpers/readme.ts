import type { Database, Domain, Runtime } from "../utils"

export const buildReadme = (
  topic: string,
  domain: Domain,
  runtime: Runtime,
  entry: string,
  framework?: string,
  db?: Database
): string =>
  `# ${topic}

tags: ${domain}${framework ? `, ${framework}` : ""}${db ? `, ${db}` : ""}

runtime: ${runtime}

${
  domain === "backend"
    ? `framework: ${framework ?? "-"}

database: ${db ?? "-"}

`
    : ""
}date: ${new Date().toISOString().slice(0, 10)}

## What

## Snippet

See ${entry}

## When to use
`
