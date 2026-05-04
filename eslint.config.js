import { FlatCompat } from '@eslint/eslintrc'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tseslint from 'typescript-eslint'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const standardDirectory = path.join(__dirname, 'node_modules', 'standard', 'node_modules')
const browserGlobals = {
  document: 'readonly',
  console: 'readonly',
  localStorage: 'readonly',
  navigator: 'readonly',
  setTimeout: 'readonly',
  window: 'readonly'
}

const compat = new FlatCompat({
  baseDirectory: standardDirectory,
  resolvePluginsRelativeTo: standardDirectory
})

export default [
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**'
    ]
  },
  ...compat.extends('standard', 'standard-jsx').map((config) => ({
    ...config,
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ...config.languageOptions,
      parser: tseslint.parser,
      globals: {
        ...browserGlobals,
        ...config.languageOptions?.globals
      },
      parserOptions: {
        ...config.languageOptions?.parserOptions,
        ecmaVersion: 'latest',
        ecmaFeatures: {
          ...config.languageOptions?.parserOptions?.ecmaFeatures,
          jsx: true
        },
        sourceType: 'module'
      }
    },
    rules: {
      ...config.rules,
      'no-undef': 'off'
    }
  }))
]
