// @ts-check
import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules'],
  },

  // Base recommended ESLint rules
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettierConfig,

  {
    plugins: {
      prettier: prettierPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      // Prettier formatting
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],

      // TypeScript practical rules
      '@typescript-eslint/no-floating-promises': 'error', // catch forgotten async calls
      '@typescript-eslint/no-explicit-any': 'off', // allow "any" for NestJS internals
      '@typescript-eslint/explicit-module-boundary-types': 'off', // avoid verbose warnings

      // Relax "unsafe" rules for NestJS (decorators, interceptors, DTOs)
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',

      // General
      'no-console': 'off', // allow console.log for debugging
    },
  },
);
