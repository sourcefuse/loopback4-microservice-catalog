module.exports = {
  extends: '@loopback/eslint-config',
  rules: {
    'no-extra-boolean-cast': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    'no-prototype-builtins': 'off',
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],
  },
};
