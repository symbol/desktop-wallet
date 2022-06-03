#!/bin/bash

set -ex

TEST_MODE=$([ "$1" = "code-coverage" ] && echo "test:jenkins" || echo "test")
npm run "${TEST_MODE}"

cd ./client && npm run "${TEST_MODE}"
