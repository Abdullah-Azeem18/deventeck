# Deventeck website

Company website for Deventeck, built with Next.js 15 (App Router), TypeScript and Three.js.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

| Path | What it holds |
| --- | --- |
| `app/layout.tsx` | Fonts (Unbounded + Manrope), SEO metadata, theme setup |
| `app/page.tsx` | Page composition |
| `app/globals.css` | All styles and color tokens (light + dark) |
| `app/api/contact/route.ts` | Contact form API (sends email with Resend) |
| `components/HeroScene.tsx` | The 3D scene (Three.js) |
| `components/*.tsx` | Header, Hero, Services, Process, Work, About, Contact, Footer |
| `lib/data.ts` | All editable content: services, projects, team, contact details |

## Edit your content

Everything in `[brackets]` is a placeholder. Open `lib/data.ts` and replace:

- project names in `projects`
- team names in `team`
- email, phone and social links in `contact`

Colors live at the top of `app/globals.css` (`--accent` = cobalt, `--accent-2` = champagne gold).

## Contact form email

1. Create a free account at https://resend.com and verify your domain.
2. Copy `.env.example` to `.env.local` and fill in:
   - `RESEND_API_KEY`
   - `CONTACT_TO_EMAIL` (where messages arrive)
   - `CONTACT_FROM_EMAIL` (e.g. `Deventeck <hello@deventeck.com>`)

Until this is set, the form opens the visitor's email app with the message ready.

## Deploy

Push to GitHub, import the repo on https://vercel.com, add the same environment variables, and connect your domain.
