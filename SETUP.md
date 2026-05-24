# WreckMatch Setup Guide (Beginner Friendly)

This guide shows exactly where to find each value you need for `.env.local`.

## Retell AI (Sarah chatbot) — [dashboard.retellai.com](https://dashboard.retellai.com)

Sarah’s chat runs on **Retell**. The site loads the official widget from `dashboard.retellai.com`.

**Live check:** open [wreckmatch.com/splash](https://www.wreckmatch.com/splash) — you should see a **Chat with Sarah** bubble (bottom-right) within ~10 seconds.

**To edit Sarah’s responses:** Dashboard → **Agents** → your chat agent → update prompt → **Publish**.

## 1) Retell Public Key

1. Go to [Retell Dashboard](https://dashboard.retellai.com/).
2. Log in to your Retell account.
3. In the left menu, open **Keys**.
4. Click **Public Keys**.
5. Copy your key (it usually starts with `pk_` or `key_`).
6. Paste it into:

```env
NEXT_PUBLIC_RETELL_PUBLIC_KEY=your_value_here
```

## 2) Retell Chat Agent ID

1. In Retell Dashboard, open **Agents**.
2. Click your **Chat Agent** (the one used for website chat).
3. Find **Agent ID** on the agent details page.
4. Copy that ID and paste it into:

```env
NEXT_PUBLIC_RETELL_CHAT_AGENT_ID=your_value_here
```

## 3) Retell Voice Agent ID

1. In Retell Dashboard, open **Agents**.
2. Click your **Voice Agent** (the one used for callback/calls).
3. Find **Agent ID** on the agent details page.
4. Copy that ID and paste it into:

```env
NEXT_PUBLIC_RETELL_VOICE_AGENT_ID=your_value_here
```

## 4) GoHighLevel (GHL) Webhook URL

1. Log in to your GoHighLevel account.
2. Go to **Automation** -> **Workflows**.
3. Open your lead intake workflow (or create a new one).
4. Add a **Webhook** trigger/action step if you do not already have one.
5. Copy the generated webhook URL.
6. Paste it into:

```env
GHL_WEBHOOK_URL=your_value_here
```

## Final Step: Restart Your App

After updating `.env.local`, restart the dev server so Next.js picks up new env values:

```bash
npm run dev
```

If the server is already running, stop it first (`Ctrl + C`) and start again.
