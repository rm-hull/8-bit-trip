/// <reference types="vitest" />
import { execSync } from "child_process";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig(() => {
  process.env.VITE_GIT_COMMIT_DATE = execSync("git log -1 --format=%cI").toString().trimEnd();
  process.env.VITE_GIT_COMMIT_HASH = execSync("git describe --always --dirty").toString().trimEnd();

  return {
    plugins: [
      tanstackRouter({ target: "react", autoCodeSplitting: true }),
      react({ babel: { plugins: ["babel-plugin-react-compiler"] } }),
      tsconfigPaths(),
    ],
    base: "/8-bit-trip",
    build: {
      sourcemap: true,
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html", "lcov"],
        include: ["src/**/*.{ts,tsx}"],
        exclude: ["src/**/*.spec.{ts,tsx}", "src/test/**", "**/*.d.ts"],
      },
    },
  };
});
