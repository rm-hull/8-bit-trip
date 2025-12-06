// ESLint Flat Config for TypeScript + React
// Ensure you have installed:
//   - eslint-import-resolver-typescript
//   - prettier
//   - all listed plugins
// This config uses Flat Config and covers recommended rules for JS, TS, React, and Prettier integration.
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import pluginPromise from "eslint-plugin-promise";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactPerf from "eslint-plugin-react-perf";
import unusedImports from "eslint-plugin-unused-imports";
import reactCompiler from "eslint-plugin-react-compiler";

export default tseslint.config(
  {
    ignores: ["dist", "coverage", ".yarn", ".pnp*", "node_modules", "build", "out"],
  },
  {
    extends: [
      js.configs.recommended,
      importPlugin.flatConfigs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      {
        languageOptions: {
          ecmaVersion: "latest",
          sourceType: "module",
          globals: globals.browser,
          parser: tseslint.parser,
          parserOptions: {
            projectService: true,
            tsconfigRootDir: import.meta.dirname,
          },
        },
      },
      pluginPromise.configs["flat/recommended"],
      eslintConfigPrettier,
    ],
    files: ["**/*.{ts,tsx}"],
    plugins: {
      react: react,
      "react-compiler": reactCompiler,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "react-perf": reactPerf,
      "unused-imports": unusedImports,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "react-compiler/react-compiler": "error",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "never",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "react-perf/jsx-no-new-function-as-prop": "warn",
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
      ],
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        // TypeScript resolver: ensure eslint-import-resolver-typescript is installed
        typescript: {
          alwaysTryTypes: true,
          project: ["./tsconfig.json"],
        },
        node: true,
      },
    },
  }
);
