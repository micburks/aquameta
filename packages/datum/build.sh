#!/bin/bash

set -e

rm -rf dist-*

babel --config-file ./babel.browser.js src -d dist-browser
babel --config-file ./babel.node.js src -d dist-node

echo "// @flow

export * from '../src/index.js';
" > dist-browser/index.js.flow

echo "// @flow

export * from '../src/index.js';
" > dist-node/index.js.flow
