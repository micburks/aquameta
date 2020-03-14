import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

const resolveOptions = {
  only: [
    'ramda',
    'aquameta-datum',
    '@micburks/pg',
    '@micburks/pg-pool',
    /pg-.+/,
    /postgres-.+/,
    'xtend',
    'node-fetch',
    'unfetch',
  ],
};

const config = {
  plugins: [
    babel(),
    commonjs({
      include: 'node_modules/**',
    }),
  ],
  output: {
    format: 'es',
  },
};

export default [
  {
    // browser
    ...config,
    input: './node_modules/aquameta-datum/dist-browser-esm/index.js',
    output: {
      ...config.output,
      file: 'dist/lib.browser.js',
    },
    plugins: [
      ...config.plugins,
      resolve({
        ...resolveOptions,
        browser: true,
      }),
    ],
  },
  {
    // node
    ...config,
    input: './node_modules/aquameta-datum/dist-node-esm/index.js',
    output: {
      ...config.output,
      file: 'dist/lib.node.js',
    },
    plugins: [
      ...config.plugins,
      resolve({
        ...resolveOptions,
      }),
    ],
  },
];
