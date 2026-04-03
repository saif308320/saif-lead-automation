# 🚀 Saif Lead Automation — Complete Setup Guide

GHL-style 7-day lead nurturing automation for your portfolio.

---

## 📋 What This Does

```
Lead submits form
      │
      ├─► Email to Saif (instant) 
      ├─► WhatsApp notification to Saif (instant)
      └─► Welcome email to lead (instant)
            │
            ├─ 10 mins ──► Follow-up email #1
            ├─ 1 day ────► Follow-up email #2  
            ├─ 2 days ───► Strategy call offer email
            ├─ 3 days ───► WhatsApp reminder to Saif
            ├─ 5 days ───► Urgency email
            └─ 7 days ───► Final farewell email
                               └─ AUTO CLOSE lead

If lead responds at ANY point → sequence stops immediately ✋
```

---

## ⚙️ Step 1: Gmail App Password Setup

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification**
3. Go to https://myaccount.google.com/apppasswords
4. Create app → Select "Mail" → Copy the 16-character password
5. Save it — you'll use it in `.env`

---

## 📱 Step 2: CallMeBot WhatsApp Setup (FREE)

1. Save this number in your WhatsApp: **+34 644 59 79 87**
2. Send this exact message: `I allow callmebot to send me messages`
3. They'll reply with your API key within 2 minutes
4. Save the API key for `.env`

---

## 🚂 Step 3: Deploy on Railway (FREE)

1. Go to https://railway.app and sign in with GitHub
2. Click **"New Project" → "Deploy from GitHub repo"**
3. Upload/push this folder to a GitHub repo, then select it
4. Click **"Add Variables"** and add ALL from `.env.example`:

```
GMAIL_USER=ghl.expert99@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
YOUR_WHATSAPP=+923XXXXXXXXX
CALLMEBOT_APIKEY=1234567
BASE_URL=https://your-project.up.railway.app
ADMIN_PASSWORD=choose_a_strong_password
PORT=3000
NODE_ENV=production
```

5. Railway will auto-deploy. Copy your URL (e.g. `https://saif-leads.up.railway.app`)

---

## 🌐 Step 4: Update Portfolio Form

1. Open `PORTFOLIO_FORM_REPLACE.html`
2. Find line: `const BACKEND_URL = 'https://YOUR-PROJECT.up.railway.app';`
3. Replace with your actual Railway URL
4. Replace your existing form in `index.html` with this entire code

---

## 📊 Step 5: Access Your Dashboard

Visit: `https://your-railway-url.up.railway.app/dashboard`

Enter your `ADMIN_PASSWORD` to see:
- All leads with status
- Automation step they're on
- History of emails sent
- Buttons to mark responded / close

---

## ✅ Step 6: Mark Lead as Responded

**Via Dashboard:** Click "✅ Mark Responded" button

**Via API** (when you reply to their email):
```bash
curl -X POST https://your-url.up.railway.app/api/responded/LEAD_ID \
  -H "Content-Type: application/json" \
  -d '{"secret": "your_admin_password"}'
```

---

## 🔧 Customize Sequence Timing

Edit `utils/automationEngine.js`:

```js
const SEQUENCE = [
  { step: 1, delayMs: 10 * 60 * 1000 },         // 10 mins
  { step: 2, delayMs: 24 * 60 * 60 * 1000 },    // 1 day
  { step: 3, delayMs: 48 * 60 * 60 * 1000 },    // 2 days
  // ... change these to whatever you want
];
```

---

## ⚠️ Important Notes

- **Railway free tier** keeps server alive as long as there's activity
- **Leads are in-memory** — they reset if server restarts. For production, add MongoDB/PostgreSQL
- **Rate limited** — max 5 form submissions per IP per 15 minutes (prevents spam)
- The `_gotcha` hidden field catches bots

---

## 📞 Test It

1. Submit your own form with a test email
2. Check Saif's email for the lead notification
3. Check WhatsApp for the alert
4. Check the test email inbox for welcome message
5. Visit `/dashboard` to see the lead
6. Wait 10 minutes, check for follow-up email

**That's it! You have a full GHL-style automation for FREE. 🔥**
