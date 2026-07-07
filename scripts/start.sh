#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/../aps-demo"
rm -rf .next
pnpm dev --port 4002
