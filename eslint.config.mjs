import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Server scripts (plain JS, not TS)
    "server/**",
  ]),
  {
    // TanStack Table v8 and Virtual are not yet React Compiler compatible.
    // This will be resolved in TanStack Table v9.
    rules: {
      "react-hooks/incompatible-library": "off",
    },
  },
]);

export default eslintConfig;