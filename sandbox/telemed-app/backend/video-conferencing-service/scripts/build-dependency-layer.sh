#!/usr/bin/env bash
# This script packages node_modules into a Lambda layer. This is required to avoid the 50MB package size limit.
# Refer to https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html for more information.
set -x
set -e

ROOT_DIR="$(pwd)"
LAYER_DIR="$ROOT_DIR/layers/nodejs"

rm -rf $LAYER_DIR
mkdir -p "$LAYER_DIR"
cp "loopback4-authentication-9.0.1.tgz" "$LAYER_DIR"
cp "sourceloop-video-conferencing-service-5.0.3.tgz" "$LAYER_DIR"
cp "package.json" "$LAYER_DIR"
cd "$LAYER_DIR"
npm i --omit=dev
cd "$ROOT_DIR"
