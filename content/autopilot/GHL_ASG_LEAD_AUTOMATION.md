# Accident Survival Guide — lead magnet automation

When someone submits the **Survival Guide download** or **Calculator** forms on accidentsurvivalguide.com, the site:

1. **Creates/updates a contact** in GHL (API, location `rjrb67xfpyr4MIbZBrFZ`)
2. **POSTs your inbound webhook** so GHL can send the right email
3. **Starts an outbound call from Sarah** (Retell) to their phone immediately

## Environment variables (Vercel + local)

| Variable | Purpose |
|----------|---------|
| `GHL_API_KEY` | Contact upsert via GHL API |
| `GHL_WEBHOOK_URL` or `ASG_SURVIVAL_GUIDE_WEBHOOK_URL` | Inbound webhook for workflows |
| `RETELL_API_KEY` | Sarah outbound calls |
| `RETELL_PHONE_NUMBER` | Caller ID (E.164) |
| `RETELL_VOICE_AGENT_ID` or `RETELL_AGENT_ID` | Sarah voice agent |

Without `RETELL_API_KEY`, leads still save to GHL and emails still fire; Sarah is skipped (logged).

## GHL inbound webhook workflow

1. **Automation → Create workflow → Inbound Webhook** (copy URL into `GHL_WEBHOOK_URL`).
2. **If/Else** on custom value `automation_trigger`:

### Branch: `email_survival_guide_pdf`

- Create/update contact (map `first_name`, `last_name`, `email`, `phone`, `state`, etc.)
- Tags: `wreckmatch-lead`, `asg-lead`, `survival-guide-lead`, `downloaded-guide-yes`, `sarah-callback-requested`
- **Send Email** — example subject: *Your Free Accident Survival Guide*
- Body: link `{{inboundWebhookRequest.pdf_download_url}}` or attach the PDF from that URL

### Branch: `email_calculator_access`

- Same contact mapping
- Tags: add `calculator-lead`, `compensation-calculator`
- **Send Email** — example subject: *Your Accident Compensation Calculator*
- Body: button/link to `{{inboundWebhookRequest.calculator_url}}`  
  (e.g. `https://www.accidentsurvivalguide.com/calculator`)

### Branch: `email_calculator_case_review`

- Same as calculator access; include `{{inboundWebhookRequest.calculator_summary}}` in email or an internal note for your team

### Optional

- Internal notification (SMS/email to team) when `trigger_sarah_call` = `yes`
- Nurture sequence enrollment by tag

## Webhook payload fields (reference)

Key fields sent on every ASG lead:

- `automation_trigger` — which email branch to run
- `form_type` — `survival-guide-download` | `calculator-lead-magnet` | `calculator-case-review`
- `pdf_download_url`, `calculator_url`
- `email`, `phone`, `first_name`, `lead_source`, `offer`
- `ghl_contact_id` — if API upsert succeeded

## Sarah (Retell)

Configured in `src/lib/retell-sarah.ts`. Dynamic variables passed to the agent:

- `first_name`, `lead_source`, `offer`

Test with a real mobile number after `RETELL_API_KEY` is set in production.

## Forms wired to this pipeline

| Form | API route | magnet_type |
|------|-----------|-------------|
| Homepage guide download | `POST /api/submit-survival-guide` | survival-guide-download |
| Homepage calculator CTA | `POST /api/submit-lead` | calculator-lead-magnet |
| Calculator case review (results) | `POST /api/submit-lead` | calculator-case-review |
