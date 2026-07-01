#!/usr/bin/env bash
set -e
ROOT="$(dirname "$0")/.."
echo "1/2 预处理数据..."
uv run python "$ROOT/scripts/process-data.py"
echo "2/2 构建 Next.js..."
cd "$ROOT/aps-demo" && pnpm build
echo "完成！out/ 即为静态产物"
