#!/usr/bin/env bash

set -euo pipefail

pushd themes/plain
npm install 
NODE_PATH="." npx webpack
popd
make publish
