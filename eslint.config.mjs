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

      "e18e/prefer-timer-args": "off",

      "format/prettier": "off",

      "jsonc/comma-dangle": "off",
      "jsonc/sort-keys": "warn",

      "no-console": "off",

      "node/no-process-env": "error",
      "node/prefer-global/process": "off",

      "one-var": "off",
      // "perfectionist/sort-objects": ["warn"],

      "perfectionist/sort-imports": [
        "warn",
        { tsconfig: { rootDir: "." } },
      ],

      // "sort-keys": "warn",
      "style/arrow-parens": ["warn", "as-needed"],
      "style/brace-style": "off",
      "style/comma-dangle": ["warn", "only-multiline"],
      "style/indent": ["warn", 2, { offsetTernaryExpressions: true }],
      "style/member-delimiter-style": [
        "error",
        { multiline: { delimiter: "none" } },
      ],
      "style/object-curly-newline": "off",
      "style/operator-linebreak": "off",

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
