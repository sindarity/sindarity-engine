# *CMD by Sindarity — Landing Page Engine

A zero-overhead, single-blueprint marketing engine that deploys 70+ unique niche websites from one codebase. One master template. One JSON data file. Infinite niches.

---

## How It Works

```
domain.com/chiropractor  →  reads "chiropractor" from niches.json  →  renders niche page
domain.com/legal         →  reads "legal" from niches.json         →  renders niche page
domain.com/              →  no match                               →  renders default page
domain.com/unknownniche  →  no match                               →  graceful default fallback
```

**Zero build step. Zero framework. Pure HTML/CSS/JS.**

---

## File Structure

```
sindarity-engine/
├── index.html          ← Master template (ONE file for all niches)
├── style.css           ← Complete luxury aesthetic stylesheet
├── router.js           ← Dynamic routing engine
├── vercel.json         ← Vercel SPA routing config
├── 404.html            ← GitHub Pages SPA fallback
├── public/
│   └── niches.json     ← Central data file (add ALL your niches here)
└── README.md
```

---

## Adding a New Niche

Open `public/niches.json` and add a new entry:

```json
"physicaltherapy": {
  "nicheName": "Physical Therapy Practices",
  "headline": "Your Claim Denials Have a Documentation Root Cause",
  "subheadline": "Clinical Revenue Recovery Infrastructure for PT Practices.",
  "painPoint": "Incomplete functional outcome documentation and inconsistent progress note standards are the #1 driver of PT claim denials — and most practices have no systematic way to track them.",
  "solution": "We build a Gap Detector Recovery System inside your EMR — identifying every denial pattern, closing the documentation gap, and building the audit trail that wins appeals.",
  "ctaText": "Run My Revenue Audit",
  "contactEmail": "pt@sindarity.com",
  "metric": "Gap Detector Recovery Report",
  "badge": "HIPAA Compliant · BAA Available"
}
```

That's it. Visit `domain.com/physicaltherapy` — it renders immediately. **No redeploy needed** (Vercel serves `niches.json` statically with cache headers).

---

## Deploy to Vercel (Recommended — Free)

### One-Click Method

1. Push this folder to a GitHub repo (public or private)
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Framework: **Other** (no framework preset needed)
4. Root Directory: leave as `/`
5. Click **Deploy**

Done. Your engine is live. Every niche URL works automatically.

### CLI Method

```bash
npm install -g vercel
cd sindarity-engine
vercel --prod
```

---

## Deploy to GitHub Pages (Free Alternative)

GitHub Pages needs one extra step because it doesn't natively support SPA routing.

1. Push the folder to a GitHub repo
2. Go to **Settings → Pages → Source**: Deploy from branch `main`, folder `/` (root)
3. The included `404.html` handles the routing redirect automatically

**Note:** GitHub Pages requires a custom domain or `username.github.io/repo-name` base path. If using a repo subdirectory, update the fetch path in `router.js`:

```js
const res = await fetch('/YOUR-REPO-NAME/niches.json');
```

---

## Connecting a Form Backend

In `router.js`, find the `── INTEGRATION POINT ──` comment and replace the `setTimeout` with your actual endpoint:

### Formspree (Free tier available)
```js
const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName, lastName, email, org,
    challenge: form.challenge.value,
    niche: form.dataset.email,
    _subject: `New *CMD Intake — ${org}`
  })
});
```

### n8n Webhook (Self-hosted, HIPAA-ready)
```js
const res = await fetch('https://your-n8n-instance.com/webhook/sindarity-intake', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ firstName, lastName, email, org, niche: form.dataset.email })
});
```

### Netlify Forms
Add `data-netlify="true"` to the `<form>` tag in `index.html` and deploy to Netlify instead.

---

## Current Niches (16 of 70+ planned)

| Key | Niche |
|-----|-------|
| `chiropractor` | Chiropractic Practices |
| `logistics` | Logistics & Freight Operations |
| `legal` | Legal & Estate Practices |
| `dentist` | Dental Practices |
| `medspa` | Med-Spa & Aesthetic Practices |
| `telehealth` | Telehealth Providers |
| `ketamine` | Ketamine & Infusion Clinics |
| `midwife` | Midwifery & Birth Practices |
| `veteran` | Veterans & Military Record Recovery |
| `estate` | Estate & Legacy Planning |
| `crypto` | Digital Asset & Crypto Estates |
| `memory` | Memory Fitness & Cognitive Care |
| `aigovernance` | AI Governance & Compliance |
| `medicaid` | Medicaid Look-Back Planning |
| `oralhistory` | Oral History & Heritage Indexing |
| `dme` | DME & Medical Equipment Logistics |

---

## Sovereign Voice Standard

All niche copy must pass the Sovereign Voice check before publishing:
- ✅ Empathetic and grounded
- ✅ Leads with the client's pain, not our technology
- ✅ Never mentions "AI" or "automation" in the headline or subheadline
- ✅ Every metric is outcome-focused, not feature-focused
- ✅ Reads like a trusted expert, not a vendor pitch

---

*CMD by Sindarity — Powered by Sindarity Data Solutions
