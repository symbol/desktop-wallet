#!/bin/bash
set -e

docker build --tag fboucquez/symbol-desktop-wallet .
docker push fboucquez/symbol-desktop-wallet
