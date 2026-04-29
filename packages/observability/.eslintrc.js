module.exports = {
  extends: '@loopback/eslint-config',
  rules: {
    'no-extra-boolean-cast': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    'no-prototype-builtins': 'off',
    // Explicitly enable the no-console rule as an error
    'no-console': 'error',
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        // Allows promises to be used in void return contexts (e.g., event handlers)
        // Set to true if you want stricter checks.
        checksVoidReturn: false,
      },
    ],
  },
  parserOptions: {
    // Point to your tsconfig.json for typed linting
    project: './tsconfig.json',
    // Define the root directory for the tsconfig.json path
    tsconfigRootDir: __dirname,
  },
  // Add '.eslintrc.js' to prevent ESLint from linting itself with typed rules
  ignorePatterns: ['dist', '.eslintrc.js', 'templates'],
};
