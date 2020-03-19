module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017
  },
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
