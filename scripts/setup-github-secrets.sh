#!/usr/bin/env bash
# Set GitHub Actions secrets from a local env file (never commit secrets).
# Usage: cp .env.secrets.example .env.secrets && fill in values && bash scripts/setup-github-secrets.sh
#
# Requires: gh auth login

set -euo pipefail
cd "$(dirname "$0")/.."

ENV_FILE="${1:-.env.secrets}"
REPO="${GITHUB_REPO:-scotttischler-byte/wreckmatch}"

if ! command -v gh >/dev/null; then
  echo "Install GitHub CLI: brew install gh && gh auth login"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Run: gh auth login"
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Create $ENV_FILE with:"
  echo "  OPENAI_API_KEY=sk-..."
  echo "  GOOGLE_CSE_API_KEY=..."
  echo "  GOOGLE_CSE_CX=..."
  echo "  INDEXNOW_KEY=wreckmatch-indexnow-key"
  exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE"

for key in OPENAI_API_KEY GOOGLE_CSE_API_KEY GOOGLE_CSE_CX INDEXNOW_KEY; do
  val="${!key:-}"
  if [[ -n "$val" ]]; then
    echo "$val" | gh secret set "$key" --repo "$REPO"
    echo "Set $key on $REPO"
  else
    echo "Skip $key (empty in $ENV_FILE)"
  fi
done

echo "Done. Verify: gh secret list --repo $REPO"
