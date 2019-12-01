module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    "jest/globals": true
  },
  extends: ["airbnb-base", 'plugin:jest/all'],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    semi: ["warn", "never"],
    "no-console": 0,
    indent: ["warn", 4],
    'no-plusplus': 0,
    'curly': 0,
    'nonblock-statement-body-position': 0,
    'no-unused-vars': 0,
    'class-methods-use-this': 0,
    'prefer-promise-reject-errors': 0,
    'no-param-reassign': 0,
    'no-async-promise-executor': 0
  },
  "plugins": ["jest"]
};
