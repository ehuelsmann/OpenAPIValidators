import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "url";
import path from "path";
import chaiPlugin from "eslint-plugin-chai-friendly";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

export default tseslint.config(
  {
    ignores: ["dist/**"],
  },

  // Airbnb + airbnb-typescript via FlatCompat (no native flat config available)
  ...compat.extends(
    "airbnb-base",
    "airbnb-typescript/base",
  ),

  // TypeScript-eslint v7/v8 recommended (replaces plugin:@typescript-eslint/recommended)
  ...tseslint.configs.recommended,


    {
        files: ["packages/chai-openapi-response-validator/test/**/*.ts"],
        plugins: {
            "chai-friendly": chaiPlugin
        },
        rules: {
            "@typescript-eslint/no-unused-expressions": "off",
            "chai-friendly/no-unused-expressions": "error"
        }
    },
  // Main config
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
        project: ["packages/*/tsconfig.eslint.json"], // finds the nearest tsconfig to each file automatically
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.es2017,
        ...globals.node,
      },
    },
    rules: {
      // Removed in @typescript-eslint v6+, injected by airbnb-typescript via FlatCompat
      "@typescript-eslint/lines-between-class-members": "off",
      "@typescript-eslint/no-duplicate-imports": "off",
      "@typescript-eslint/no-throw-literal": "off",

      // Prior rules
      "prefer-arrow-callback": "error",
      "func-names": "off",
      "no-use-before-define": "off",
      "require-await": "error",
      "@typescript-eslint/no-use-before-define": "off",
    },
  },

  // prettier last — turns off rules that conflict with prettier,
  // covers @typescript-eslint rules too (replaces prettier/@typescript-eslint)
  prettier,

  // Override for config files
  {
    files: ["**/*.config.ts"],
    rules: {
      "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    },
  },
);
