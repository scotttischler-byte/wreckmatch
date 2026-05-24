#!/usr/bin/env bash
# Local 24/7 SEO agent loop — run on a machine that stays on.
# Usage with Cursor: /loop 30m bash scripts/run-seo-agent-loop.sh
# Or: nohup bash scripts/run-seo-agent-loop.sh &
#
# Interval seconds (default 30 min)
INTERVAL="${SEO_AGENT_INTERVAL_SEC:-1800}"

cd "$(dirname "$0")/.." || exit 1

echo "SEO Agent local loop — every ${INTERVAL}s"
echo "Log: content/agents/seo-agent-log.jsonl"
echo "Stop: kill this process"

while true; do
  echo "--- $(date -u +%Y-%m-%dT%H:%M:%SZ) ---"
  node scripts/seo-agent.mjs rotate || true
  sleep "$INTERVAL"
done
