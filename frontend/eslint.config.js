import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import prettierRecommended from "eslint-plugin-prettier/recommended"
import tseslint from "typescript-eslint"
import { defineConfig, globalIgnores } from "eslint/config"

import oneClassPerLine from "./eslint-rules/one-class-per-line.js"

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettierRecommended,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      pkmp: {
        rules: {
          "one-class-per-line": oneClassPerLine,
        },
      },
    },
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "pkmp/one-class-per-line": "error",
    },
  },
])
