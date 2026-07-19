export const frontend = ["react", "vanilla"] as const
export const backend = ["node", "bun"] as const

export const validRuntimes = { frontend, backend } as const

export type Domain = keyof typeof validRuntimes
export const domains = Object.keys(validRuntimes) as Domain[]

export const isDomain = (value: string): value is Domain =>
  value in validRuntimes

export type Runtime = (typeof validRuntimes)[Domain][number]

export const isRuntime = <D extends Domain>(
  domain: D,
  value: string
): value is (typeof validRuntimes)[D][number] =>
  (validRuntimes[domain] as readonly string[]).includes(value)

export const databases = ["postgres", "mongodb"] as const
export type Database = (typeof databases)[number]

export const isDatabase = (value: string): value is Database =>
  (databases as readonly string[]).includes(value)
