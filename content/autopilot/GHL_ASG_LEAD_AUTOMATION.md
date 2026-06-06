# Accident Survival Guide — lead magnet automation

When someone submits the **Survival Guide download** or **Calculator** forms on accidentsurvivalguide.com, the site:

1. **Creates/updates a contact** in GHL (API, location `rjrb67xfpyr4MIbZBrFZ`)
2. **POSTs your inbound webhook** so GHL can send the right email **and SMS**
3. **Starts an outbound call from Sarah** (Retell) to their phone immediately

## Environment variables (Vercel + local)

| Variable | Purpose |
|----------|---------|
| `GHL_API_KEY` | Contact upsert + optional direct SMS (needs `conversations/message.write` scope) |
| `GHL_WEBHOOK_URL` or `ASG_SURVIVAL_GUIDE_WEBHOOK_URL` | Inbound webhook for workflows |
| `RETELL_API_KEY` | Sarah outbound calls |
| `RETELL_PHONE_NUMBER` | Caller ID (E.164) |
| `RETELL_VOICE_AGENT_ID` or `RETELL_AGENT_ID` | Sarah voice agent |

Without `RETELL_API_KEY`, leads still save to GHL and emails/SMS still fire; Sarah is skipped (logged).

## GHL SMS setup (one-time)

### A) Direct SMS from the app (recommended)

The site tries to text leads via `POST /conversations/messages` after each lead is saved.

1. **Settings → Private Integrations** → edit the integration used for `GHL_API_KEY`.
2. Enable scope **`conversations/message.write`** (and `conversations.readonly` if available).
3. Regenerate the token and update `GHL_API_KEY` in Vercel + `.env.local`.
4. **Settings → Phone Numbers** — confirm LC Phone SMS is active on location `rjrb67xfpyr4MIbZBrFZ`.

Without that scope, SMS falls back to the inbound webhook workflow only (section B).

### B) SMS via inbound webhook workflow

1. **Settings → Phone Numbers** — confirm you have an LC Phone / Twilio number with SMS enabled for location `rjrb67xfpyr4MIbZBrFZ`.
2. **Automation → Create workflow → Inbound Webhook** (same webhook URL as email flows).
3. After **Create/Update Contact**, add an **If/Else**:
   - **Condition:** `{{inboundWebhookRequest.send_lead_sms}}` **equals** `yes`
   - **Yes branch → Send SMS** to contact phone:
     - **Message body:** `{{inboundWebhookRequest.sms_body}}`
     - Or use templates below per `sms_template_key`
4. **Compliance:** Messages include `Reply STOP to unsubscribe.` Contacts tagged `sms-opt-in` when they consent.

### SMS message (pre-filled in webhook as `sms_body`)

| `sms_template_key` | Example text |
|--------------------|--------------|
| `email_survival_guide_pdf` | Hi {name}, here's your free Accident Survival Guide: {pdf_url} Reply STOP to unsubscribe. |
| `email_calculator_access` | Hi {name}, start your free compensation estimate (under 60 sec): {calculator_url} Reply STOP to unsubscribe. |
| `email_calculator_case_review` | Hi {name}, we received your calculator case review. Our team will follow up soon. Reply STOP to unsubscribe. |
| `asg_attorney_match_request` | Hi {name}, thanks for requesting a free attorney match. A specialist will reach out shortly. Reply STOP to unsubscribe. |
| `expert_intake_asap` | Hi {name}, we got your ASAP intake request. Expect a call from our team soon. Reply STOP to unsubscribe. |

**Tip:** Duplicate the SMS step inside each email branch if you want different timing (e.g. SMS immediately, email 1 min later).

## GHL inbound webhook workflow

1. **Automation → Create workflow → Inbound Webhook** (copy URL into `GHL_WEBHOOK_URL`).
2. **Create/Update Contact** — map `first_name`, `last_name`, `email`, `phone`, `state`, `city`, custom fields `sms_consent`, `email_consent`.
3. **If/Else** on custom value `automation_trigger`:

### Branch: `email_survival_guide_pdf`

- Tags: `wreckmatch-lead`, `asg-lead`, `survival-guide-lead`, `downloaded-guide-yes`, `sarah-callback-requested`, `sms-opt-in` (if consented)
- **Send Email** — subject: *Your Free Accident Survival Guide* — link `{{inboundWebhookRequest.pdf_download_url}}`
- **Send SMS** (if `send_lead_sms` = yes) — `{{inboundWebhookRequest.sms_body}}`

### Branch: `email_calculator_access`

- Tags: add `calculator-lead`, `compensation-calculator`
- **Send Email** — link `{{inboundWebhookRequest.calculator_url}}`
- **Send SMS** (if `send_lead_sms` = yes)

### Branch: `email_calculator_case_review`

- Include `{{inboundWebhookRequest.calculator_summary}}` in email or internal note
- **Send SMS** (if `send_lead_sms` = yes)

### Branch: `expert_intake_asap`

- Tags: `expert-intake-asap`, `priority-intake`, `asap-callback`
- `priority_intake` = `yes` — internal alert + **Send SMS** to lead
- Full accident intake fields in webhook

### Branch: `asg_attorney_match_request`

- Tags: `attorney-match-lead`, `wreckmatch-referral`
- **Send SMS** (if `send_lead_sms` = yes)

### Optional

- Internal notification (SMS/email to team) when `trigger_sarah_call` = `yes`
- Nurture sequence enrollment by tag

## Webhook payload fields (reference)

Key fields sent on every ASG lead:

- `automation_trigger` — which email branch to run
- `form_type` — `survival-guide-download` | `calculator-lead-magnet` | `calculator-case-review` | etc.
- `send_lead_sms` — `yes` | `no` — use for SMS If/Else
- `sms_consent` — `Yes` | `No`
- `sms_body` — ready-to-send SMS text (when consented)
- `sms_template_key` — same as `automation_trigger` (for custom templates)
- `pdf_download_url`, `calculator_url`
- `email`, `phone`, `first_name`, `city`, `lead_source`, `offer`
- `ghl_contact_id` — if API upsert succeeded

## Sarah (Retell)

Configured in `src/lib/retell-sarah.ts`. Dynamic variables passed to the agent:

- `first_name`, `lead_source`, `offer`

Test with a real mobile number after `RETELL_API_KEY` is set in production.

## Forms wired to this pipeline

| Form | API route | magnet_type |
|------|-----------|-------------|
| Survival guide download (all pages) | `POST /api/submit-survival-guide` | survival-guide-download |
| Homepage calculator CTA | `POST /api/submit-lead` | calculator-lead-magnet |
| Calculator case review (results) | `POST /api/submit-lead` | calculator-case-review |
| Thank-you attorney match | `POST /api/submit-lead` | attorney-match |
| Expert intake ASAP (homepage) | `POST /api/submit-lead` | expert-intake-asap |

**All requests from `accidentsurvivalguide.com` are routed to GHL** even if `lead_source` is omitted (hostname detection on the API).

SMS consent: survival guide has an explicit text checkbox (default on). Calculator, attorney match, case review, and expert intake consent to calls/texts via the form consent language — webhook sends `send_lead_sms: yes`.
