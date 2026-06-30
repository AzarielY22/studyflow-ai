# StudyFlow AI

Turn any PDF, video, or webpage into AI-generated summaries, flashcards, and quizzes in seconds.

## Project Structure

```
├── web/          Next.js web app (landing, dashboard, API)
├── extension/    Chrome Extension (Manifest V3)
└── README.md
```

## Features

- **AI Summaries** — Quick, detailed, beginner, or college-level
- **Flashcards** — Auto-generated with flip, shuffle, and progress tracking
- **Quiz Generator** — Multiple choice, true/false, fill-in-blank, and more
- **Ask AI About Notes** — Chat grounded in your uploaded content
- **Chrome Extension** — Analyze PDFs, YouTube videos, and webpages
- **Google OAuth** — Secure sign-in
- **Stripe Billing** — Free, Pro ($9.99/mo), Premium ($14.99/mo)

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google OAuth credentials
- OpenAI API key
- Stripe account (for payments)

### Web App Setup

```bash
cd web
cp .env.example .env
# Fill in your environment variables

npm install
npm run db:generate
npm run db:push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Random secret for NextAuth |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `OPENAI_API_KEY` | OpenAI API key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_PRO_PRICE_ID` | Stripe price ID for Pro plan |
| `STRIPE_PREMIUM_PRICE_ID` | Stripe price ID for Premium plan |
| `NEXT_PUBLIC_APP_URL` | App URL (http://localhost:3000) |

### Chrome Extension Setup

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `extension/` folder
5. Add icon PNGs to `extension/icons/` (16x16, 48x48, 128x128) or update `manifest.json`

Update `APP_URL` in `extension/popup.js` and `extension/background.js` for production.

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/[...nextauth]` | GET/POST | Google OAuth |
| `/api/scan` | GET/POST | List/create study materials |
| `/api/materials/[id]` | GET/PATCH/DELETE | Manage a material |
| `/api/chat` | POST | AI chat about uploaded content |
| `/api/stripe/checkout` | GET/POST | Checkout & customer portal |
| `/api/stripe/webhook` | POST | Stripe webhook handler |

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Next.js API Routes, Prisma ORM, PostgreSQL
- **Auth:** NextAuth v5 with Google OAuth
- **Payments:** Stripe Checkout & Customer Portal
- **AI:** OpenAI GPT-4o-mini
- **Extension:** Chrome Manifest V3

## Pages

- `/` — Landing page
- `/features` — Feature overview
- `/pricing` — Subscription plans
- `/login` — Google sign-in
- `/dashboard` — Study materials
- `/dashboard/materials/[id]` — Summary, flashcards, quiz, chat
- `/billing` — Subscription management
- `/settings` — Account settings
- `/support`, `/privacy`, `/terms` — Legal & support

## License

MIT
