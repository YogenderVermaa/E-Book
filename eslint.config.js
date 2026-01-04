import js from '@eslint/js';
import react from 'eslint-plugin-react';
import hooks from 'eslint-plugin-react-hooks';

export default [
  // Base JS rules
  js.configs.recommended,

  // ✅ FRONTEND (React + JSX)
  {
    files: ['frontend/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // 🔥 THIS WAS MISSING
        },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        console: 'readonly',
      },
    },
    plugins: {
      react,
      'react-hooks': hooks,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime']?.rules,
      'no-undef': 'error',
      'no-unused-vars': 'warn',
      'react/react-in-jsx-scope': 'off', // React 17+
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      ...hooks.configs.recommended.rules,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // ✅ BACKEND (Node.js)
  {
    files: ['backend/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
      },
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': 'warn',
    },
  },
];
