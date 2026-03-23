import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { includeIgnoreFile } from '@eslint/compat';
import type { ESLint } from 'eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');

export default [
  includeIgnoreFile(gitignorePath),
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      'sort-imports': ['off'],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'prettier/prettier': 'error',
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
      radix: 'off',
      'no-underscore-dangle': 'off',
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'off',
      'no-param-reassign': 'off',
      'react/require-default-props': 'off',
      'react/jsx-props-no-spreading': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react/no-array-index-key': 'off',
      'import/no-anonymous-default-export': 'off',
      curly: ['error', 'all'],
    },
    settings: {
      react: {
        version: '19',
      },
    },
  },
] as ESLint.ConfigData[];
