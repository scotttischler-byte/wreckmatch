#!/usr/bin/env bash
# Generate all remaining city guides locally. Requires OPENAI_API_KEY in .env.local.
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  if [[ -f .env.local ]]; then
    set -a
    # shellcheck disable=SC1091
    source .env.local
    set +a
  fi
fi

if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  echo "ERROR: Set OPENAI_API_KEY in .env.local or export it before running."
  exit 1
fi

VENV=".venv-autopilot"
if [[ ! -x "$VENV/bin/python" ]]; then
  python3 -m venv "$VENV"
  "$VENV/bin/pip" install -q -r scripts/autopilot_requirements.txt
fi
PY="$VENV/bin/python"
export BLOG_AUTO_PUBLISH=true

"$PY" scripts/accident_survival_guide_autopilot.py --sync-queue
"$PY" scripts/accident_survival_guide_autopilot.py \
  --all \
  --publish-json \
  --continue-on-error \
  --delay 8

echo "Done. Commit content/ and push to deploy new posts."
