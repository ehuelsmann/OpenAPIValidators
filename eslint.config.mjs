import { FlatCompat } from '@eslint/eslintrc';
import eslintJs from '@eslint/js';
import { fileURLToPath } from 'url';
import path from 'path';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import mochaPlugin from 'eslint-plugin-mocha';
import chaiFriendlyPlugin from 'eslint-plugin-chai-friendly';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: eslintJs.configs.recommended,
  allConfig: eslintJs.configs.all,
});

export default tseslint.config(
  { ignores: ['**/dist/**'] },

  {
    files: ['**/*.ts'],
    ignores: [
      'packages/chai-openapi-response-validator/test/**/*.ts',
      'packages/chai-openapi-response-validator/tsup.config.ts',
    ],
    extends: [
      eslintJs.configs.recommended,
      ...compat.extends('airbnb-base'),
      ...tseslint.configs.recommended,
      prettierConfig,
    ],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      globals: {
        ...globals.es2018,
        ...globals.node,
      },
      parserOptions: {
        project: ['./packages/*/tsconfig.eslint.json'],
        tsconfigRootDir: __dirname,
        ecmaVersion: 2018,
        sourceType: 'module',
      },
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts'],
      },
      'import/resolver': {
        node: {
          extensions: ['.mjs', '.js', '.json', '.ts', '.d.ts'],
        },
      },
      'import/extensions': ['.js', '.mjs', '.jsx', '.ts', '.tsx', '.d.ts'],
      'import/external-module-folders': ['node_modules', 'node_modules/@types'],
    },
    rules: {
      // TypeScript compiler already handles these correctness checks
      'constructor-super': 'off',
      'getter-return': 'off',
      'no-const-assign': 'off',
      'no-dupe-args': 'off',
      'no-dupe-class-members': 'off',
      'no-dupe-keys': 'off',
      'no-func-assign': 'off',
      'no-import-assign': 'off',
      'no-new-symbol': 'off',
      'no-obj-calls': 'off',
      'no-redeclare': 'off',
      'no-setter-return': 'off',
      'no-this-before-super': 'off',
      'no-undef': 'off',
      'no-unreachable': 'off',
      'no-unsafe-negation': 'off',
      'valid-typeof': 'off',

      // Import plugin: TypeScript resolver handles these
      'import/named': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-unresolved': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        { js: 'never', mjs: 'never', jsx: 'never', ts: 'never', tsx: 'never' },
      ],

      // Replace JS rules with @typescript-eslint equivalents
      camelcase: 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
        { selector: 'typeLike', format: ['PascalCase'] },
      ],
      'default-param-last': 'off',
      '@typescript-eslint/default-param-last': 'error',
      'dot-notation': 'off',
      '@typescript-eslint/dot-notation': ['error', { allowKeywords: true }],
      'no-array-constructor': 'off',
      '@typescript-eslint/no-array-constructor': 'error',
      'no-empty-function': 'off',
      '@typescript-eslint/no-empty-function': [
        'error',
        { allow: ['arrowFunctions', 'functions', 'methods'] },
      ],
      'no-implied-eval': 'off',
      'no-new-func': 'off',
      '@typescript-eslint/no-implied-eval': 'error',
      'no-loop-func': 'off',
      '@typescript-eslint/no-loop-func': 'error',
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      'no-throw-literal': 'off',
      '@typescript-eslint/only-throw-error': 'error',
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { vars: 'all', args: 'after-used', ignoreRestSiblings: true },
      ],
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-useless-constructor': 'error',
      'no-return-await': 'off',
      '@typescript-eslint/return-await': ['error', 'in-try-catch'],

      // Rules from original .eslintrc.yml
      'prefer-arrow-callback': 'error',
      'func-names': 'off',
      'require-await': 'error',
    },
  },

  // Allow devDependencies in config files
  {
    files: ['**/*.config.ts'],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
    },
    rules: {
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
  },

  // Jest test files
  {
    files: ['packages/jest-openapi/__test__/**/*.ts'],
    extends: [jestPlugin.configs['flat/all']],
    plugins: {
      import: importPlugin,
    },
    rules: {
      'jest/prefer-expect-assertions': 'off',
      'jest/no-disabled-tests': 'warn',
      'jest/prefer-lowercase-title': ['error', { ignore: ['describe'] }],
      'jest/no-hooks': 'off',
      'jest/require-hook': 'off',
      // Rules added in jest-plugin v28/v29 not present when the project used v27
      'jest/prefer-importing-jest-globals': 'off',
      'jest/padding-around-all': 'off',
      'jest/padding-around-describe-blocks': 'off',
      'jest/padding-around-test-blocks': 'off',
      'jest/padding-around-before-all-blocks': 'off',
      'jest/padding-around-expect-groups': 'off',
      // Test files use devDependencies
      'import/no-extraneous-dependencies': [
        'error',
        { devDependencies: ['**/__test__/**'] },
      ],
    },
  },

  // Mocha test files
  {
    files: ['packages/chai-openapi-response-validator/test/**/*.ts'],
    extends: [mochaPlugin.configs.recommended],
    plugins: {
      'chai-friendly': chaiFriendlyPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
    },
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
      'chai-friendly/no-unused-expressions': 'error',
      'mocha/no-setup-in-describe': 'off',
      'mocha/no-mocha-arrows': 'off',
      // Rule added in eslint-plugin-mocha v10/v11 not present when the project used v8
      'mocha/consistent-spacing-between-blocks': 'off',
    },
  },
);
