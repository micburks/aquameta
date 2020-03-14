export default {
  plugins: [
    '@babel/plugin-syntax-flow',
    '@babel/plugin-transform-flow-strip-types',
    ['babel-plugin-transform-cup-globals', {target: 'browser'}],
    [
      'babel-plugin-transform-prune-unused-imports',
      {
        truthyExpressions: ['__BROWSER__'],
        falsyExpressions: ['__NODE__'],
      },
    ],
  ],
};
