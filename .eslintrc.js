module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017
  },
  extends: [
    'eslint-config-cup',
    'eslint-config-cup-recommended',
  ],
  plugins: [
    'eslint-plugin-prettier',
    'eslint-plugin-flowtype'
  ],
  rules: {
    'no-console': 'off',
    'prettier/prettier': [
      'error',
      {
        bracketSpacing: false,
        parser: 'babel',
        singleQuote: true,
        trailingComma: "all",
      },
    ]
  }
}
