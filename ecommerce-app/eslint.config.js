import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']), // Ignore le dossier de build
  
  {
    files: ['**/*.{js,jsx}'], // Analyse tous les fichiers JS/JSX
    
    extends: [                 // Règles préconfigurées
      js.configs.recommended,  // Règles ESLint de base
      reactHooks.configs.flat.recommended, // Règles pour React Hooks
      reactRefresh.configs.vite, // Règles pour React Refresh avec Vite
    ],
    
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser, // Variables globales du navigateur (window, document...)
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true }, // Support de JSX
        sourceType: 'module', // Utilise les modules ES
      },
    },
    
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }], // Ignore les variables commençant par majuscule ou _
    },
  },
])