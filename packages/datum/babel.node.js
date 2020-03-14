export default {
  plugins: [
    '@babel/plugin-syntax-flow',
    '@babel/plugin-transform-flow-strip-types',
    ['babel-plugin-transform-cup-globals', {target: 'node'}],
    [
      'babel-plugin-transform-prune-unused-imports',
      {
        truthyExpressions: ['__NODE__'],
        falsyExpressions: ['__BROWSER__'],
      },
    ],
  ],
};
