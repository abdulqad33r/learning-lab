import antfu from "@antfu/eslint-config"

export default antfu(
  {
    formatters: true,
    ignores: [
      ".zed/**",
      "node_modules",
      "dist",
      "**/*.md",
      ".env",
      ".wakatime-project",
      ".gitignore",
      "src/db/migrations",
    ],
    react: true,
    stylistic: {
      indent: 2,
      quotes: "double",
      semi: false,
    },
    type: "app",
    typescript: true,
  },
  {
    rules: {
      "antfu/if-newline": "off",
      "antfu/no-top-level-await": "off",
      "antfu/top-level-function": "off",

      "jsonc/comma-dangle": "off",
      "jsonc/sort-keys": "warn",

      "no-console": "off",

      "node/no-process-env": "error",
      "node/prefer-global/process": "off",

      "one-var": "off",

      "perfectionist/sort-imports": [
        "warn",
        { tsconfig: { rootDir: "." } },
      ],
      // "perfectionist/sort-objects": ["warn"],

      // "sort-keys": "warn",
      "style/arrow-parens": ["warn", "as-needed"],
      "style/brace-style": "off",
      "style/comma-dangle": "off",
      "style/indent": "off",
      "style/max-len": [
        "warn",
        {
          code: 70,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      "style/member-delimiter-style": [
        "error",
        { multiline: { delimiter: "none" } },
      ],
      "style/object-curly-newline": "off",
      "style/operator-linebreak": "off",
      // "style/semi": "warn",

      "ts/consistent-type-definitions": "off",
    },
  },
  {
    files: ["env.ts"],
    rules: { "node/no-process-env": "off" },
  },
  {
    files: ["package.json"],
    rules: { "jsonc/sort-keys": "off" },
  },
  {
    files: ["eslint.config.*"],
    rules: {
      "perfectionist/sort-objects": ["warn"],
      "sort-keys": "warn",
    },
  }
)
