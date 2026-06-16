# WreckMatch PI/MVA Attorney Email Campaign Automation

This automation turns WreckMatch lead demand and Audience Labs market data into
attorney outreach payloads for GoHighLevel (LeadConnector) workflows.

The script is dry-run first. It does **not** send email directly. Sending posts
one approved payload per attorney to a GHL inbound webhook that should own the
actual email template, unsubscribe footer, throttling, and delivery reporting.

## Files

Create real data files next to the templates:

```text
data/attorney-campaign/attorneys.csv
data/attorney-campaign/leads.csv
data/attorney-campaign/audience-labs.csv
```

Templates:

- `data/attorney-campaign/attorneys.template.csv`
- `data/attorney-campaign/leads.template.csv`
- `data/attorney-campaign/audience-labs.template.csv`

CSV, JSON arrays, and JSONL are supported. Header names are normalized, so
`firm name`, `firm_name`, and `Firm Name` are treated the same.

## Required columns

### Attorneys

| Column | Purpose |
| --- | --- |
| `firm_name` | Law firm name |
| `contact_name` | Recipient/contact name |
| `contact_email` | Recipient email |
| `city` | Target office/market city |
| `state` | Target office/market state |
| `practice_areas` | Semicolon-separated list, e.g. `Personal injury; Motor vehicle accidents` |
| `status` | Optional. `unsubscribed`, `do-not-contact`, `bounced`, and `inactive` are skipped |

### Leads

Lead rows may come from GHL exports, site form logs, or cleaned CRM exports.
The campaign only uses aggregate counts and trends; do not put raw lead notes in
email templates.

Useful columns:

- `created_at`
- `city`
- `state`
- `accident_type`
- `injury_status`
- `lead_source`
- `has_attorney`

### Audience Labs

Useful columns:

- `city`
- `state`
- `audience_segment`
- `demand_score`
- `audience_size`
- `cpc`
- `notes`

## Dry run

```bash
npm run marketing:attorneys:plan
```

This writes:

```text
content/marketing/attorney-email-campaign-preview.json
```

Review the preview before sending. It includes recipient emails and the exact
payloads that will be posted to GHL, but it does not include lead names, phone
numbers, emails, or case descriptions.

To test with templates:

```bash
node scripts/attorney-email-campaign.mjs \
  --attorneys data/attorney-campaign/attorneys.template.csv \
  --leads data/attorney-campaign/leads.template.csv \
  --audience-labs data/attorney-campaign/audience-labs.template.csv \
  --output /tmp/wreckmatch-attorney-campaign-preview.json
```

## Send after approval

Set the GHL inbound webhook URL in Vercel or your local shell:

```bash
ATTORNEY_CAMPAIGN_WEBHOOK_URL="https://services.leadconnectorhq.com/hooks/..."
```

Then run:

```bash
npm run marketing:attorneys:send
```

The send command expands to:

```bash
node scripts/attorney-email-campaign.mjs --send --confirm=SEND_ATTORNEY_CAMPAIGN
```

Both flags are required. This is intentional so a planning run cannot trigger a
batch email workflow.

## GHL workflow setup

Create a GHL workflow with an inbound webhook trigger and branch on:

```text
automation_trigger = pi_mva_attorney_email_campaign
```

Payload fields include:

- `campaign_id`
- `firm_name`
- `contact_name`
- `contact_email`
- `attorney_city`
- `attorney_state`
- `market`
- `lead_count_recent`
- `lead_lookback_days`
- `top_accident_types`
- `top_injury_signals`
- `top_lead_sources`
- `audience_segment`
- `audience_demand_score`
- `audience_size`
- `audience_cpc`
- `recommended_subject`
- `preview_text`
- `body_angle`

Recommended GHL workflow:

1. Inbound webhook receives payload.
2. Validate `contact_email` is present.
3. Upsert/create attorney prospect contact.
4. Add tags:
   - `wreckmatch-attorney-campaign`
   - `pi-mva-attorney`
   - `audience-labs`
   - `state-{{attorney_state}}`
5. Send email using GHL template variables.
6. Add wait/branch steps for opens, clicks, replies, and unsubscribes.
7. Notify internal team when an attorney clicks or replies.

## Compliance and safety

- Confirm recipient list, subject, and email content before triggering sends.
- Use only de-identified aggregate lead demand in attorney marketing emails.
- Do not include lead names, emails, phone numbers, or case notes in outbound
  attorney marketing.
- Ensure the GHL email template includes the required physical address and
  unsubscribe link.
- Keep suppression lists in GHL authoritative. The script also skips rows with
  `unsubscribed`, `do-not-contact`, `bounced`, or `inactive` status.
- The local audit log redacts recipient local-parts and stores only email
  domains:
  `content/agents/attorney-campaign-log.jsonl`.

