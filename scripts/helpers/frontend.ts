import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

import * as p from "@clack/prompts"

import type { Domain, Runtime } from "../utils"
import { buildReadme } from "./readme"

// Maps our selectable variants to the template names expected by create-vite.
const VITE_TEMPLATE = {
  react: "react-ts",
  "react-compiler": "react-compiler-ts",
  vanilla: "vanilla-ts",
} as const

type ViteVariant = keyof typeof VITE_TEMPLATE

// Packages available for both frontend runtimes.
const COMMON_PACKAGES = [
  { value: "axios", label: "Axios" },
  { value: "tailwindcss @tailwindcss/vite", label: "Tailwind CSS" },
]

// Packages offered only when creating a React project.
const REACT_PACKAGES = [
  { value: "@tanstack/react-query", label: "TanStack Query" },
  { value: "@tanstack/react-router", label: "TanStack Router" },
  { value: "react-router", label: "React Router" },
  { value: "react-hook-form", label: "React Hook Form" },
  { value: "framer-motion", label: "Framer Motion" },
]

// The minimal CSS written into new frontend projects.
const RESET_CSS = `* {
  box-sizing: border-box;
}

html {
  color-scheme: light dark;
}

body {
  margin: 0;
}
`

type FrontendRuntime = Extract<Runtime, "react" | "vanilla">

type FrontendOptions = {
  domain: Extract<Domain, "frontend">
  runtime: FrontendRuntime
  variant: ViteVariant
  topic: string
  addHooks: boolean
  packages: string[]
  installNow: boolean
}

// Removes linter configuration files, scripts, and dependencies.
// This keeps the generated project free of ESLint and Oxlint.
const stripLinters = (dir: string) => {
  for (const file of fs.readdirSync(dir)) {
    const isLinterConfig =
      /^(eslint\.config\.|\.eslintrc|\.oxlintrc|oxlint\.config\.)/.test(file)

    if (isLinterConfig) {
      fs.rmSync(path.join(dir, file), { force: true })
    }
  }

  const packagePath = path.join(dir, "package.json")
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf-8"))

  // Remove package scripts that run ESLint or Oxlint.
  for (const [name, script] of Object.entries(packageJson.scripts ?? {})) {
    if (/eslint|oxlint/.test(String(script))) {
      delete packageJson.scripts[name]
    }
  }

  // Remove linter dependencies and the associated globals package.
  for (const section of ["dependencies", "devDependencies"]) {
    const dependencies = packageJson[section]

    if (!dependencies) continue

    for (const name of Object.keys(dependencies)) {
      if (/eslint|oxlint/i.test(name) || name === "globals") {
        delete dependencies[name]
      }
    }
  }

  // Write the modified package.json back to disk.
  fs.writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`)
}

// Removes the default Vite boilerplate and writes minimal starter files.
const cleanBoilerplate = (dir: string, runtime: FrontendRuntime) => {
  const src = path.join(dir, "src")

  // Remove assets that came with the template.
  fs.rmSync(path.join(dir, "public"), { recursive: true, force: true })
  fs.rmSync(path.join(src, "assets"), { recursive: true, force: true })
  fs.rmSync(path.join(dir, ".gitignore"), { force: true })

  // Remove the favicon reference because the public assets were deleted.
  const htmlPath = path.join(dir, "index.html")
  const html = fs.readFileSync(htmlPath, "utf-8")

  fs.writeFileSync(
    htmlPath,
    html.replace(/[ \t]*<link rel="icon"[^>]*>\r?\n?/, "")
  )

  if (runtime === "react") {
    // Replace the default React app with a minimal component.
    fs.writeFileSync(
      path.join(src, "App.tsx"),
      `import "./App.css"

function App() {
  return <div></div>
}

export default App
`
    )

    fs.writeFileSync(path.join(src, "App.css"), "")
    fs.writeFileSync(path.join(src, "index.css"), RESET_CSS)

    return
  }

  // Replace the default Vanilla template's entry point and styles.
  fs.rmSync(path.join(src, "counter.ts"), { force: true })
  fs.writeFileSync(path.join(src, "main.ts"), `import "./style.css"\n`)
  fs.writeFileSync(path.join(src, "style.css"), RESET_CSS)
}

// Creates the Vite project, cleans it up, and installs the selected packages.
const scaffoldFrontend = ({
  domain,
  runtime,
  variant,
  topic,
  addHooks,
  packages,
  installNow,
}: FrontendOptions) => {
  const runtimeDir = path.join(domain, runtime)

  fs.mkdirSync(runtimeDir, { recursive: true })

  p.log.step("Scaffolding Vite project")

  // Run create-vite from the runtime directory so projects are grouped by runtime.
  execSync(
    `bunx create-vite@latest ${topic} --template ${VITE_TEMPLATE[variant]} --no-interactive --no-immediate`,
    { cwd: runtimeDir, stdio: "inherit" }
  )

  const dir = path.join(runtimeDir, topic)
  const src = path.join(dir, "src")

  p.log.step("Cleaning up boilerplate")

  cleanBoilerplate(dir, runtime)
  stripLinters(dir)

  // Use App.tsx as the React snippet entry, or main.ts for Vanilla.
  const entry = runtime === "react" ? "App.tsx" : "main.ts"

  fs.writeFileSync(
    path.join(dir, "README.md"),
    buildReadme(topic, domain, runtime, entry)
  )

  // Create the hooks directory only when requested.
  if (addHooks) {
    fs.mkdirSync(path.join(src, "hooks"), { recursive: true })
  }

  // Do not run any installation command unless the user confirms.
  if (installNow) {
    if (packages.length > 0) {
      // Install the selected packages and the project's other dependencies.
      p.log.step("Installing selected packages")

      execSync(`bun add ${packages.join(" ")}`, {
        cwd: dir,
        stdio: "inherit",
      })
    } else {
      // No additional packages were selected, so install the template dependencies.
      p.log.step("Installing dependencies")

      execSync("bun install", {
        cwd: dir,
        stdio: "inherit",
      })
    }
  } else {
    // Leave installation for the user to run later.
    p.log.info("Skipped dependency installation")
  }

  p.log.step("Formatting")
  execSync(`bun check:fix "${dir}"`, { stdio: "inherit" })

  p.outro(`Created ${dir}`)
}

// Asks the frontend-specific questions, then passes the answers to the scaffolder.
export const createFrontendTopic = async (
  runtime: FrontendRuntime,
  topic: string
) => {
  // Start with the standard Vite variant for the selected runtime.
  let variant: ViteVariant = runtime
  let addHooks = false

  if (runtime === "react") {
    const useCompiler = await p.confirm({
      message: "Use React Compiler?",
      initialValue: true,
    })

    if (p.isCancel(useCompiler)) return p.cancel("Cancelled")

    if (useCompiler) {
      variant = "react-compiler"
    }

    const hooks = await p.confirm({
      message: "Add an empty src/hooks folder?",
    })

    if (p.isCancel(hooks)) return p.cancel("Cancelled")

    addHooks = hooks
  }

  // React projects get additional package choices.
  const packages = await p.multiselect({
    message: "Packages to add? (space to select, enter to confirm)",
    options:
      runtime === "react"
        ? [...REACT_PACKAGES, ...COMMON_PACKAGES]
        : COMMON_PACKAGES,
    required: false,
  })

  if (p.isCancel(packages)) return p.cancel("Cancelled")

  // Always ask before installing anything, even if packages were selected.
  const install = await p.confirm({
    message: "Install dependencies now?",
    initialValue: true,
  })

  if (p.isCancel(install)) return p.cancel("Cancelled")

  const installNow = install

  scaffoldFrontend({
    domain: "frontend",
    runtime,
    variant,
    topic,
    addHooks,
    packages,
    installNow,
  })
}
