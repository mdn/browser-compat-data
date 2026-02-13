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
      'eslint.config.js',
      '**/*.json',
      '!*.json',
      '!schemas/*.json',
      '**/LICENSE',
      '**/.*ignore',
      '**/.git*',
      '**/.editorconfig',
      'package-lock.json',
      'CODE_OF_CONDUCT.md',
      'build/',
      '**/coverage/',
      '**/browsers.d.ts',
      '**/compat-data.d.ts',
      '**/types.d.ts',
    ],
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/strict',
      'plugin:@typescript-eslint/stylistic',
      'plugin:import/recommended',
      'plugin:jsdoc/recommended-typescript-flavor',
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
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    settings: {
      'import/resolver': {
        node: true,
      },
    },

    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/no-unused-vars': 'off',

      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
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
      'import/no-unresolved': [
        'error',
        {
          ignore: [
            // https://github.com/import-js/eslint-plugin-import/issues/1810
            '^yargs/helpers$',
          ],
        },
      ],
      'jsdoc/check-param-names': 'error',
      'jsdoc/prefer-import-tag': 'error',
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

      'jsdoc/no-restricted-syntax': [
        'error',
        {
          contexts: [
            {
              comment:
                'JsdocBlock:has(JsdocTag[tag="typedef"]:has(JsdocTypeImport))',
              context: 'any',
              message: 'Use @import JSDoc instead of @typedef.',
            },
            {
              comment: 'JsdocBlock:has(JsdocTypeName[value="unknown"])',
              context: 'any',
              message: 'Avoid using unknown type in JSDoc.',
            },
          ],
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
      'no-unused-expressions': 'error',
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
