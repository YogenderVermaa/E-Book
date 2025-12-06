import js from '@eslint/js';

export default [
  js.config.recommended,
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
    },
  },
];
