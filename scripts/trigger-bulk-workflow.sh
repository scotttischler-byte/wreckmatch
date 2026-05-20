#!/usr/bin/env bash
# One-time: logs into GitHub CLI, then starts the bulk city guide generator.
set -euo pipefail
cd "$(dirname "$0")/.."

GH="${GH:-/opt/homebrew/bin/gh}"

if ! "$GH" auth status &>/dev/null; then
  echo "Opening GitHub login — complete the browser prompt, then this script continues."
  "$GH" auth login -h github.com -p https -w
fi

"$GH" workflow run autopilot-blog-bulk.yml \
  --repo scotttischler-byte/wreckmatch \
  -f batch_size=25 \
  -f retrigger=true \
  -f publish_json=true

echo ""
echo "Workflow started. Watch progress:"
echo "  https://github.com/scotttischler-byte/wreckmatch/actions/workflows/autopilot-blog-bulk.yml"
