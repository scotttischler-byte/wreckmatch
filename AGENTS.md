<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## SEO 24/7 agents

Cloud automation (no laptop required) runs via GitHub Actions:

| Workflow | Schedule | Command equivalent |
|----------|----------|-------------------|
| `seo-agent-hourly.yml` | Every hour | `npm run seo:agent` |
| `seo-agent-6h.yml` | Every 6 hours | `node scripts/seo-agent.mjs full` + autopilot |
| `publish-seo.yml` | Daily 14:00 UTC | `npm run seo:daily` + blog publish |
| `autopilot-blog-bulk.yml` | 3× daily | 279-city queue (needs `OPENAI_API_KEY`) |

Local loop (machine must stay on): `npm run seo:agent:loop` or Cursor `/loop 30m bash scripts/run-seo-agent-loop.sh`

Status: `npm run seo:agent:status` — log at `content/agents/seo-agent-log.jsonl`

Do not bulk-publish thin content.
