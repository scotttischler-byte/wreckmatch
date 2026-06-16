# WreckMatch PI/MVA Attorney Email Campaign Automation

This automation turns WreckMatch lead demand and Audience Labs market data into
attorney outreach for Resend or GoHighLevel (LeadConnector) workflows.

The script is dry-run first. Sending requires an explicit approval token, a
suppression check, daily warmup cap, and sender-health guardrails. Resend is the
default live provider; GHL is still available as a fallback provider.

## Recommended sending streams

Do not send attorney campaigns from the root `wreckmatch.com` identity. Use
separate authenticated subdomains so each stream has its own reputation:

| Stream | Subdomain | Example sender | Use |
| --- | --- | --- | --- |
| Transactional | `mail.wreckmatch.com` | `Sarah from WreckMatch <sarah@mail.wreckmatch.com>` | Lead confirmations, guide delivery |
| Opted-in marketing | `updates.wreckmatch.com` | `WreckMatch Updates <hello@updates.wreckmatch.com>` | Users/leads with marketing consent |
| Attorney partners | `partners.wreckmatch.com` | `WreckMatch Partner Team <partnerships@partners.wreckmatch.com>` | PI/MVA attorney partner outreach |

For Resend, add and verify each subdomain in the Resend dashboard, then publish
the DNS records Resend gives you for SPF/DKIM/return-path. Add a DMARC record
for each subdomain before sending. Start with `p=none`, monitor reports, then
tighten only after authentication and deliverability look healthy.

## Files

Create real data files next to the templates:

```text
data/attorney-campaign/attorneys.csv
data/attorney-campaign/leads.csv
data/attorney-campaign/audience-labs.csv
data/attorney-campaign/suppressions.csv
data/attorney-campaign/sender-health.json
```

Templates:

- `data/attorney-campaign/attorneys.template.csv`
- `data/attorney-campaign/leads.template.csv`
- `data/attorney-campaign/audience-labs.template.csv`
- `data/attorney-campaign/suppressions.template.csv`
- `data/attorney-campaign/sender-health.template.json`

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

### Suppressions

Suppression rows prevent sends even if an attorney is otherwise eligible.

Useful columns:

- `email`
- `domain`
- `reason`
- `created_at`

### Sender health

Copy `sender-health.template.json` to `sender-health.json` and update it from
Resend/GHL metrics before each send or scheduled run:

```json
{
  "bounceRate": 0,
  "complaintRate": 0,
  "unsubscribeRate": 0,
  "replyRate": 0
}
```

Rates are decimals: `0.01` means 1%.

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

Set Resend configuration in your environment or GitHub Actions secrets/vars:

```bash
RESEND_API_KEY="re_..."
ATTORNEY_CAMPAIGN_FROM="WreckMatch Partner Team <partnerships@partners.wreckmatch.com>"
ATTORNEY_CAMPAIGN_REPLY_TO="partnerships@partners.wreckmatch.com"
ATTORNEY_CAMPAIGN_UNSUBSCRIBE_URL="https://www.wreckmatch.com/unsubscribe"
ATTORNEY_CAMPAIGN_UNSUBSCRIBE_WEBHOOK_URL="https://services.leadconnectorhq.com/hooks/..."
ATTORNEY_CAMPAIGN_PHYSICAL_ADDRESS="Your compliant mailing address"
ATTORNEY_CAMPAIGN_WARMUP_START="2026-06-16"
ATTORNEY_CAMPAIGN_MAX_DAILY="800"
```

Then run:

```bash
npm run marketing:attorneys:send
```

The send command expands to:

```bash
node scripts/attorney-email-campaign.mjs --provider=resend --send --confirm=SEND_ATTORNEY_CAMPAIGN
```

Both flags are required. This is intentional so a planning run cannot trigger a
batch email workflow.

### GHL fallback

If you prefer GHL to own sending:

```bash
ATTORNEY_CAMPAIGN_WEBHOOK_URL="https://services.leadconnectorhq.com/hooks/..."
npm run marketing:attorneys:send:ghl
```

## Daily volume and warmup

The safest way to send "as many as possible" is to let reputation unlock volume.
The script applies this default warmup schedule for the partner subdomain:

| Warmup day | Daily cap |
| --- | ---: |
| 1 | 25 |
| 2 | 35 |
| 3 | 50 |
| 4 | 70 |
| 5 | 90 |
| 6 | 120 |
| 7 | 150 |
| 8 | 200 |
| 9 | 250 |
| 10 | 325 |
| 11 | 400 |
| 12 | 500 |
| 13 | 650 |
| 14+ | 800 or `ATTORNEY_CAMPAIGN_MAX_DAILY` |

The cap is reduced or paused automatically from `sender-health.json`:

- Complaint rate `>= 0.1%`: pause.
- Bounce rate `>= 3%`: pause.
- Bounce rate `>= 2%`: cut cap in half.
- Unsubscribe rate `>= 1%`: reduce cap.
- Reply rate `>= 3%` with clean bounces/complaints: allow modest growth.

Do not override this with huge `--daily-cap` values until the partner subdomain
has real positive engagement and low complaints.

## Unsubscribe handling

Campaign emails link to `/unsubscribe?campaign=...&recipient=...`, where
`recipient` is a SHA-256 hash of the recipient email. The page posts to
`/api/marketing/unsubscribe`.

Set `ATTORNEY_CAMPAIGN_UNSUBSCRIBE_WEBHOOK_URL` (or
`MARKETING_UNSUBSCRIBE_WEBHOOK_URL`) to a GHL/CRM webhook that writes the hash,
campaign, and reason into your suppression system. Export that suppression list
back to `data/attorney-campaign/suppressions.csv` before sends, or make the GHL
workflow own suppression before it sends.

## Automation

The daily GitHub Action runs a preview every day. It only sends if all are true:

1. `RESEND_API_KEY` secret is configured.
2. `ATTORNEY_CAMPAIGN_AUTOSEND` repository variable is set to `true`.
3. The real input files exist.
4. The send command passes the approval token and all Resend compliance checks.

Recommended repository variables:

```text
ATTORNEY_CAMPAIGN_AUTOSEND=false
ATTORNEY_CAMPAIGN_FROM=WreckMatch Partner Team <partnerships@partners.wreckmatch.com>
ATTORNEY_CAMPAIGN_REPLY_TO=partnerships@partners.wreckmatch.com
ATTORNEY_CAMPAIGN_UNSUBSCRIBE_URL=https://www.wreckmatch.com/unsubscribe
ATTORNEY_CAMPAIGN_UNSUBSCRIBE_WEBHOOK_URL=<optional GHL/CRM webhook>
ATTORNEY_CAMPAIGN_PHYSICAL_ADDRESS=<your address>
ATTORNEY_CAMPAIGN_WARMUP_START=2026-06-16
ATTORNEY_CAMPAIGN_MAX_DAILY=800
```

## GHL workflow setup

This section applies only when using `--provider=ghl`.

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

