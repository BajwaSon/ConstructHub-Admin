import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ["projects/**/*"],
  },
  ...compat
    .extends("eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:@angular-eslint/recommended", "plugin:@angular-eslint/template/process-inline-templates")
    .map(config => ({
      ...config,
      files: ["**/*.ts"],
    })),
  {
    files: ["**/*.ts"],

    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],

      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],

      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@angular/router",
              importNames: ["Router"],
              message: "Use NavigationService instead of @Get from @jot143/core-angular.",
            },
          ],
        },
      ],
    },
  },
  ...compat.extends("plugin:@angular-eslint/template/recommended", "plugin:@angular-eslint/template/accessibility").map(config => ({
    ...config,
    files: ["**/*.html"],
  })),
  {
    files: ["**/*.html"],

    rules: {
      "@angular-eslint/template/no-empty-button": "off",
      "@angular-eslint/template/elements-content": "off",
      "@angular-eslint/template/click-events-have-key-events": "off",
      "@angular-eslint/template/interactive-supports-focus": "off",
    },
  },
];
