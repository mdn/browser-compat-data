import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import _import from 'eslint-plugin-import';
// import jsdoc from 'eslint-plugin-jsdoc';
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import ts from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      '**/*.json',
      '!*.json',
      '!schemas/*.json',
      '**/LICENSE',
      '**/.*ignore',
      '**/.git*',
      '**/.editorconfig',
      'package-lock.json',
      'CODE_OF_CONDUCT.md',
      '**/build/',
      '**/coverage/',
      '**/types.d.ts',
    ],
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/strict',
      'plugin:@typescript-eslint/stylistic',
      'plugin:import/recommended',
      'plugin:import/typescript',
      'plugin:jsdoc/recommended-typescript',
    ),
  ),
  {
    plugins: {
      '@typescript-eslint': fixupPluginRules(ts.plugin),
      import: fixupPluginRules(_import),
      // jsdoc: fixupPluginRules(jsdoc), // Plugin already defined
      'prefer-arrow-functions': preferArrowFunctions,
      unicorn,
    },

    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },

      parser: ts.parser,
      ecmaVersion: 2020,
      sourceType: 'module',
    },

    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },

    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'error',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          caughtErrors: 'none',
        },
      ],

      'consistent-return': 'error',
      curly: 'error',
      'default-case': 'off',
      'default-case-last': 'error',

      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: ['builtin', 'external', 'parent', 'sibling', 'index', 'type'],
        },
      ],

      'import/no-named-as-default-member': 'off',
      'jsdoc/check-param-names': 'error',
      'jsdoc/require-description': 'warn',

      'jsdoc/require-jsdoc': [
        'warn',
        {
          require: {
            ArrowFunctionExpression: true,
            ClassDeclaration: true,
            ClassExpression: true,
            FunctionDeclaration: true,
            FunctionExpression: true,
            MethodDefinition: true,
          },
        },
      ],

      'jsdoc/require-returns': 'error',
      'jsdoc/require-yields': 'error',
      'linebreak-style': ['error', 'unix'],
      'no-console': 'off',
      'no-else-return': 'error',

      'no-empty': [
        'error',
        {
          allowEmptyCatch: true,
        },
      ],

      'no-eval': 'error',
      'no-labels': 'error',
      'no-lone-blocks': 'error',
      'no-return-assign': 'error',
      'no-self-compare': 'error',
      'no-unused-expressions': 'off',
      'no-useless-call': 'error',

      'prefer-arrow-functions/prefer-arrow-functions': [
        'error',
        {
          returnStyle: 'implicit',
        },
      ],

      'prefer-const': 'error',

      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
        },
      ],

      'unicorn/prefer-node-protocol': 'error',
    },
  },
];
