#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "$0")" && pwd)"
source "$SCRIPT_DIR/load-stitch-env.sh"
printf 'Using STITCH_API_KEY from: %s\n' "${STITCH_API_KEY_SOURCE:-environment}"
npx @_davideast/stitch-mcp doctor
