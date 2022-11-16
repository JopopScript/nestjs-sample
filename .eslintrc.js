module.exports = {
  env: {
    node: 1,
    commonjs: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    // quotes: [2, 'single', { avoidEscape: true }],
    'prettier/prettier': ['error', { singleQuote: true }],
    '@typescript-eslint/no-inferable-types': {
      ignoreParameters: true,
      ignoreProperties: true,
    },
  },
};
