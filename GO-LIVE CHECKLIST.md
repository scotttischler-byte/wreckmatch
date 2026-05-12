# GO-LIVE CHECKLIST

Use this checklist from top to bottom. Do not skip steps.

## Current Project Status (Auto-Updated)

### ✅ Completed In Codebase

1. Landing page implemented with responsive 8-step intake flow.
2. Form validation and submit loading state implemented.
3. `/api/submit-lead` API route implemented with error handling.
4. Thank-you page with 3:00 countdown implemented.
5. Retell chat + callback integration implemented with mode-aware launcher.
6. Production helper files added:
  - `.env.example`
  - `.env.local` (template style placeholders)
  - `SETUP.md`
  - `DEPLOY.md`
  - `vercel.json`
7. Production deploy script added to `package.json`:
  - `npm run deploy`

### 🟡 Remaining Before Final Go-Live

1. Replace placeholders in `.env.local` with real production values.
2. Copy same env vars into Vercel Project Settings.
3. Run one end-to-end test on production URL.
4. Confirm GHL receives a real lead.
5. Confirm domain DNS and SSL are fully active.

---

## 0) Before You Start (5 minutes)

1. Confirm you are in the project folder:
  - Open Terminal.
  - Run:
    ```bash
    cd /Users/scott/wreckmatch
    ```
2. Confirm required files exist:
  - `.env.local`
  - `.env.example`
  - `SETUP.md`
3. If anything is missing, stop and add it before continuing.

[Screenshot: Finder/IDE root showing `.env.local`, `.env.example`, `SETUP.md`, and `GO-LIVE CHECKLIST.md`]

---

## 1) Fill In `.env.local` (Most Important)

Open `.env.local` in Cursor and replace placeholder values with real values.

### 1.1 Retell Public Key

1. Go to [Retell Dashboard](https://dashboard.retellai.com/).
2. Log in.
3. Left sidebar -> **Keys** -> **Public Keys**.
4. Copy your public key.
5. Paste into:
  ```env
   NEXT_PUBLIC_RETELL_PUBLIC_KEY=YOUR_REAL_VALUE
  ```

[Screenshot: Retell Dashboard -> Keys -> Public Keys -> Copy button]

### 1.2 Retell Chat Agent ID

1. In Retell sidebar, click **Agents**.
2. Open your Chat Agent.
3. Find **Agent ID** on the details page.
4. Copy and paste into:
  ```env
   NEXT_PUBLIC_RETELL_CHAT_AGENT_ID=YOUR_REAL_VALUE
  ```

[Screenshot: Retell Agent page showing “Agent ID” field]

### 1.3 Retell Voice Agent ID

1. In Retell sidebar, click **Agents**.
2. Open your Voice Agent (callback agent).
3. Find **Agent ID**.
4. Copy and paste into:
  ```env
   NEXT_PUBLIC_RETELL_VOICE_AGENT_ID=YOUR_REAL_VALUE
  ```

[Screenshot: Retell Voice Agent page with Agent ID highlighted]

### 1.4 Retell Phone Number

1. Use the number Retell uses for callback calls.
2. Enter one of these formats:
  - `+19785156063` (recommended)
  - `9785156063`
3. Paste into:
  ```env
   NEXT_PUBLIC_RETELL_PHONE_NUMBER=+19785156063
  ```

### 1.5 GoHighLevel Webhook URL

1. Log in to GoHighLevel.
2. Go to **Automation** -> **Workflows**.
3. Open your lead workflow.
4. Add/open webhook step.
5. Copy webhook URL.
6. Paste into:
  ```env
   GHL_WEBHOOK_URL=https://your-real-ghl-webhook-url
  ```

[Screenshot: GHL Workflow -> Webhook step -> URL copy icon]

### 1.6 Site URL

1. Leave this for now if deploying to Vercel.
2. After deployment, set it to your real production URL:
  ```env
   NEXT_PUBLIC_SITE_URL=https://wreckmatch.com
  ```

### 1.8 Save and sanity-check

1. Save file.
2. Confirm no value is still `your_..._here` or `example.com`.

---

## 2) Test Locally (Before Deployment)

### 2.1 Install dependencies (if needed)

In Terminal:

```bash
cd /Users/scott/wreckmatch
npm install
```

### 2.2 Start development server

```bash
npm run dev
```

You should see something like:

- `Local: http://localhost:3000`

[Screenshot: Terminal showing `next dev` and `http://localhost:3000`]

### 2.3 Open the site

1. Open browser.
2. Go to `http://localhost:3000`.
3. Confirm page loads with:
  - dark law-firm theme
  - hero section
  - phone number
  - 8-question intake card

### 2.4 Test the 8-step form

1. Fill each step.
2. Try clicking **Next** with an empty answer to confirm validation message appears.
3. On final step, enter valid phone and submit.
4. Confirm redirect to `/thank-you`.
5. Confirm countdown starts at `3:00`.

[Screenshot: Form step with validation message]
[Screenshot: Thank-you page showing 3:00 countdown]

### 2.5 Test build locally (production simulation)

Stop dev server (`Ctrl + C`) and run:

```bash
npm run build
```

Expected: build finishes successfully with no errors.

---

## 3) Test Retell Widget (Local)

### 3.1 Main CTA test (chat)

1. On homepage, click:
  - **Talk to Ava 24/7 (AI or Live Expert)**
2. Confirm Retell widget opens.
3. Send a test message in chat.

[Screenshot: Widget opened after clicking main CTA]

### 3.2 Mobile floating button test (callback)

1. Open browser DevTools.
2. Toggle device toolbar (mobile view).
3. Refresh page.
4. Click **Call Ava Now** floating button.
5. Confirm callback widget opens (phone/callback flow).

[Screenshot: Mobile view with “Call Ava Now” floating button]

### 3.3 If widget does not open

Check these first:

1. `NEXT_PUBLIC_RETELL_PUBLIC_KEY` is real (not placeholder).
2. Agent IDs are correct (chat vs voice not swapped).
3. Hard refresh browser (`Cmd+Shift+R` on Mac).
4. Restart dev server after `.env.local` edits.

---

## 4) Deploy to Vercel (Beginner Path)

### 4.1 Push code to GitHub

If not already in GitHub:

1. Create new GitHub repository.
2. In project terminal:
  ```bash
   git add .
   git commit -m "Prepare WreckMatch for go-live"
   git branch -M main
   git remote add origin <YOUR_GITHUB_REPO_URL>
   git push -u origin main
  ```

### 4.2 Import project in Vercel

1. Go to [Vercel](https://vercel.com/).
2. Log in with GitHub.
3. Click **Add New...** -> **Project**.
4. Select your repo.
5. Click **Import**.

[Screenshot: Vercel dashboard -> Add New -> Project]

### 4.3 Add environment variables in Vercel

In project setup (or Project -> Settings -> Environment Variables), add each:

- `NEXT_PUBLIC_RETELL_PUBLIC_KEY`
- `NEXT_PUBLIC_RETELL_CHAT_AGENT_ID`
- `NEXT_PUBLIC_RETELL_VOICE_AGENT_ID`
- `NEXT_PUBLIC_RETELL_PHONE_NUMBER`
- `GHL_WEBHOOK_URL`
- `NEXT_PUBLIC_SITE_URL`

Set values exactly as in `.env.local`, except production URL should be your real domain URL.

[Screenshot: Vercel Environment Variables form with key/value rows]

### 4.4 Deploy

1. Click **Deploy**.
2. Wait for build to complete.
3. Open deployment URL provided by Vercel.

---

## 5) Post-Deployment Verification (Go-Live QA)

Run this full checklist on the live URL.

### 5.1 Homepage checks

1. Hero text and styling look correct on desktop.
2. Phone number click-to-call works.
3. No broken layout on mobile.

### 5.2 Form checks

1. Validation appears when trying empty submissions.
2. Final submit works.
3. Redirect to `/thank-you` works.
4. Countdown appears and ticks down.

### 5.3 Retell checks

1. Main CTA opens chat widget.
2. Mobile floating button opens callback widget.
3. Test one complete conversation.

### 5.4 Automation checks

1. Submit a test lead.
2. Confirm API request succeeds.
3. Confirm lead appears in GoHighLevel workflow/logs.
4. Confirm the normalized lead payload fields are present in the webhook and contact upsert flow.

### 5.5 SEO and domain checks

1. Title and meta description show correctly in browser tab.
2. Production domain is connected in Vercel.
3. HTTPS is active (lock icon in browser).

---

## 6) Final Go-Live Decision

Go live only when all are true:

1. `npm run build` passes.
2. Form submits successfully on production.
3. Retell chat + callback both open and work.
4. GHL receives lead payloads.
5. Thank-you page loads with countdown.

If any item fails, fix it first and retest.

---

## 7) Quick Troubleshooting

1. **Widget not opening** -> check Retell keys/IDs and redeploy.
2. **Form fails on submit** -> check `GHL_WEBHOOK_URL` and server logs.
3. **Old values still used** -> redeploy after updating Vercel env vars.
4. **Works locally, fails on Vercel** -> compare `.env.local` vs Vercel env vars line by line.

---

## 8) Nice-to-Have Next (After Go-Live)

1. Add analytics (GA4, Meta Pixel).
2. Add error monitoring (Sentry).
3. Add rate limiting/CAPTCHA to submission endpoint.
4. Add real-time alert (Slack/email) for each new lead.

