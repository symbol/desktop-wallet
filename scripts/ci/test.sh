#!/bin/bash

set -ex

TEST_MODE=$([ "$1" = "code-coverage" ] && echo "test:jenkins" || echo "test")
npm run "${TEST_MODE}"

# copy jest coverage json report to .nyc_output so that ci coverage threshold check can work
cd $(git rev-parse --show-toplevel)
mkdir -p .nyc_output && cp ./coverage/coverage-final.json ./.nyc_output 2>/dev/null || :