import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import query from "@tanstack/eslint-plugin-query";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      query,
    },
    extends: [
      {
        processor: "next/core-web-vitals",
      },
      {
        processor: "plugin:@tanstack/eslint-plugin-query/recommended",
      },
    ],
  }
);
