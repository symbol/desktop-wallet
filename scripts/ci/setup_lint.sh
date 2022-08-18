#!/bin/bash

set -ex

npm install
# generate version.txt to be used in publishing
echo $(npm run version --silent) > version.txt
