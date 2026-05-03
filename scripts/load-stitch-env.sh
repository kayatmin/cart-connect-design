#!/usr/bin/env bash
set -euo pipefail

finish_success() {
  if [[ "${BASH_SOURCE[0]}" != "$0" ]]; then
    return 0
  else
    exit 0
  fi
}

finish_failure() {
  local code="${1:-1}"
  if [[ "${BASH_SOURCE[0]}" != "$0" ]]; then
    return "$code"
  else
    exit "$code"
  fi
}

if [[ -n "${STITCH_API_KEY:-}" ]]; then
  export STITCH_API_KEY
  finish_success || true
  return 0 2>/dev/null || exit 0
fi

if [[ -n "${STITCH_API_KEY_FILE:-}" ]]; then
  if [[ ! -f "$STITCH_API_KEY_FILE" ]]; then
    echo "STITCH_API_KEY_FILE does not exist: $STITCH_API_KEY_FILE" >&2
    finish_failure 1 || true
    return 1 2>/dev/null || exit 1
  fi

  value="$(python3 - "$STITCH_API_KEY_FILE" <<'PY'
import re, sys
path=sys.argv[1]
text=open(path, 'r', encoding='utf-8', errors='ignore').read().splitlines()
for line in text:
    line=line.strip()
    if not line or line.startswith('#'):
        continue
    m=re.match(r'^STITCH_API_KEY\s*[:=]\s*(.+)$', line)
    if m:
        print(m.group(1).strip().strip('"\''))
        break
PY
)"
  if [[ -n "$value" ]]; then
    export STITCH_API_KEY="$value"
    export STITCH_API_KEY_SOURCE="$STITCH_API_KEY_FILE"
    finish_success || true
    return 0 2>/dev/null || exit 0
  fi

  echo "STITCH_API_KEY_FILE did not contain STITCH_API_KEY: $STITCH_API_KEY_FILE" >&2
  finish_failure 1 || true
  return 1 2>/dev/null || exit 1
fi

echo "STITCH_API_KEY not found. Set STITCH_API_KEY or STITCH_API_KEY_FILE." >&2
finish_failure 1 || true
return 1 2>/dev/null || exit 1
