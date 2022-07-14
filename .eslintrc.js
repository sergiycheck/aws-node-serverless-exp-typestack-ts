module.exports = {
  env: {
    node: true,
  },
  extends: ['standard'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  ignorePatterns: ['.eslintrc.js'],
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/semi': 'always',
    '@typescript-eslint/no-unused-vars': 'off',
  },
};
