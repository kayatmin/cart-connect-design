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

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd)"

candidates=(
  "$REPO_ROOT/knowledge-base/secrets/api-keys"
  "$REPO_ROOT/knowledge-base/secrets/api-keys.md"
  "/knowledge-base/secrets/api-keys"
  "/knowledge-base/secrets/api-keys.md"
  "/home/rog/knowledge-base/secrets/api-keys"
  "/home/rog/knowledge-base/secrets/api-keys.md"
  "/mnt/d/knowledge-base/secrets/api-keys"
  "/mnt/d/knowledge-base/secrets/api-keys.md"
  "/mnt/d/knowledge-base/kai/secrets/api-keys"
  "/mnt/d/knowledge-base/kai/secrets/api-keys.md"
  "$REPO_ROOT/../knowledge-base/secrets/api-keys"
  "$REPO_ROOT/../knowledge-base/secrets/api-keys.md"
  "$REPO_ROOT/../../knowledge-base/secrets/api-keys"
  "$REPO_ROOT/../../knowledge-base/secrets/api-keys.md"
)

for candidate in "${candidates[@]}"; do
  if [[ -f "$candidate" ]]; then
    value="$(python3 - "$candidate" <<'PY'
import re, sys
path=sys.argv[1]
text=open(path, 'r', encoding='utf-8', errors='ignore').read().splitlines()
for line in text:
    line=line.strip()
    if not line or line.startswith('#'):
        continue
    m=re.match(r'STITCH_API_KEY\s*[:=]\s*(.+)$', line)
    if m:
        print(m.group(1).strip().strip('"\''))
        break
PY
)"
    if [[ -n "$value" ]]; then
      export STITCH_API_KEY="$value"
      export STITCH_API_KEY_SOURCE="$candidate"
      finish_success || true
      return 0 2>/dev/null || exit 0
    fi
  fi
done

echo "STITCH_API_KEY not found. Checked env and knowledge-base secret paths." >&2
finish_failure 1 || true
return 1 2>/dev/null || exit 1
