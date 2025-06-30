import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  // Add this 'resolvePlugins' option to correctly find plugins like '@typescript-eslint'
  // when using FlatCompat in an ESM context.
  resolvePluginsRelativeTo: __dirname,
});

const eslintConfig = [
  // Extend recommended configurations
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Also include the base TypeScript ESLint recommended rules
  // This helps apply default TypeScript-specific linting.
  ...compat.extends("plugin:@typescript-eslint/recommended"),

  // Add rules overrides and ignore patterns
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"], // Apply these rules to all relevant files
    rules: {
      // 1. Disable `no-unused-expressions` as you've requested.
      //    This is often useful for React components where expressions might have side-effects
      //    but don't explicitly return a value for assignment.
      "@typescript-eslint/no-unused-expressions": "off",

      // 2. Adjust `no-unused-vars` to allow underscore-prefixed variables (common for ignored parameters)
      //    This helps with the `'e' is defined but never used` errors.
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "unused-imports/no-unused-imports": "error", // Use a plugin to auto-remove unused imports
      "unused-imports/no-unused-vars": [
        "warn",
        {
          "vars": "all",
          "varsIgnorePattern": "^_",
          "args": "after-used",
          "argsIgnorePattern": "^_"
        }
      ],

      // 3. Relax `no-empty-object-type` to `warn` or `off` if Prisma generates these.
      //    `object` is generally preferred over `{}` for "any object".
      "@typescript-eslint/no-empty-object-type": "warn",

      // 4. Warn against `any` instead of erroring, especially for third-party types.
      //    You should still strive to avoid `any` in your own code.
      "@typescript-eslint/no-explicit-any": "warn",

      // 5. Disable `no-require-imports` for generated files if they use it.
      //    It's better to manage this by ignoring files, but if it shows up in your own,
      //    you need to convert `require` to `import`. For Prisma, it's usually in generated JS files.
      "@typescript-eslint/no-require-imports": "off", // Keep off if you use any legacy JS modules

      // 6. Disable `no-this-alias` if it's strictly from generated files.
      "@typescript-eslint/no-this-alias": "off",
    },
  },

  // 7. Crucially, add ignore patterns for generated files
  //    This prevents ESLint from linting files that you don't control and shouldn't modify.
  {
    ignores: [
      "lib/generated/prisma/**/*.ts",
      "lib/generated/prisma/**/*.js",
      "lib/generated/prisma/**/*.d.ts",
      "next-env.d.ts", // Common to ignore this generated file too
      "*.config.js", // If you have config files at root that you want to ignore certain rules for.
      "*.config.ts",
      "**/*.min.js", // Ignore minified files
      "**/dist/**",  // Ignore common build output directories
      "**/out/**",
      "**/node_modules/**",
    ],
  },
];

export default eslintConfig;
