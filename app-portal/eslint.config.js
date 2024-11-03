// @ts-check
const path = require('path');
const eslint = require('@eslint/js');
const { includeIgnoreFile } = require('@eslint/compat');
const tsEslint = require('typescript-eslint');
const angularEslint = require('angular-eslint');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const eslintConfigPrettier = require('eslint-config-prettier');
const eslintPluginSimpleImportSort = require('eslint-plugin-simple-import-sort');

const gitignorePath = path.resolve(__dirname, '.gitignore');

const config = tsEslint.config(
  includeIgnoreFile(gitignorePath),
  {
    ignores: [
      'build/**',
      'dist/**',
      'coverage/**',
      'node_modules/**',
      'e2e/**',
      'npm-debug.log',
      'yarn-error.log',
      'yarn.lock',
      'package.json',
      'package-lock.json',
      'karma.conf.js',
      'commitlint.config.js',
      '*.js',
    ],
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tsEslint.configs.recommended,
      ...tsEslint.configs.stylistic,
      ...angularEslint.configs.tsRecommended,
      eslintPluginPrettierRecommended,
      eslintConfigPrettier,
    ],
    plugins: {
      'simple-import-sort': eslintPluginSimpleImportSort,
    },
    processor: angularEslint.processInlineTemplates,
    rules: {
      '@angular-eslint/no-input-rename': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-unused-vars': 'off',
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // Framework packages
            ['^@angular.*'],
            // 3rd party npm packages
            ['^'],
            // Internal packages
            ['^@.*'],
            // Parent imports. Put `..` last
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Other relative imports. Put same-folder imports and `.` last.
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Style imports
            ['^.+\\.?(css|scss|sass|less)$'],
          ],
        },
      ],
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowFunctionsWithoutTypeParameters: true,
        },
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: {
            accessors: 'off',
            constructors: 'explicit',
            methods: 'explicit',
            properties: 'explicit',
            parameterProperties: 'explicit',
          },
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^[_]*$',
          varsIgnorePattern: '^[_]*$',
          caughtErrorsIgnorePattern: '^[_]*$',
        },
      ],
      '@typescript-eslint/no-explicit-any': [
        'warn',
        {
          fixToUnknown: true,
          ignoreRestArgs: true,
        },
      ],
      '@angular-eslint/directive-selector': [
        'warn',
        {
          type: 'attribute',
          prefix: ['app', 'ui'],
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: ['app', 'ui'],
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angularEslint.configs.templateRecommended,
      ...angularEslint.configs.templateAccessibility,
      eslintPluginPrettierRecommended,
    ],
    rules: {
      '@angular-eslint/template/no-negated-async': 'warn',
      'prettier/prettier': [
        'error',
        {
          parser: 'angular',
        },
      ],
    },
  },
);

module.exports = config;
