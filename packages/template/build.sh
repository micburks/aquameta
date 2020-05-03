#!/bin/bash

set -e

rm -rf dist-*

babel --config-file ./babel.browser.js src -d dist-browser

echo "// @flow

export * from '../src/index.js';
" > dist-browser/index.js.flow
