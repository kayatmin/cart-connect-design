#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "$0")" && pwd)"
source "$SCRIPT_DIR/load-stitch-env.sh"
exec npx @_davideast/stitch-mcp tool
