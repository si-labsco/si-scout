# si-scout

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_ANqXHcJzcCveh3siXFCwjX8EtsTi)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

## How the pipeline works

The steps below are stages 1–2 of the Si Labs **Distribution Partnership framework**: helping established, job-creating businesses enter new markets through local Lab Leads, for commercial returns to the business, Si Labs and the Lab Lead. Si Labs does not provide financing on this pathway.

1. **Scout (AI agent, its own section)**: the Scout page (`/scout`) takes a city and keeps a history of every run (`City.runs`), each with its own page listing what it found (`/scout/[runId]`). The scout agent (`runScout` in `lib/agents.ts`) uses Claude with web search to profile the city and find proven ventures elsewhere that could enter it.
2. **Catalogue**: the scout's candidates, filtered by city with the dropdown.
3. **Shortlist (human)**: clicking "Shortlist" moves a candidate to the shortlist and starts the research agent.
4. **Screening (AI agent, then human)**: `runResearch` fills in the profile and scores the five screening tests (commercial viability, decent jobs, replicability, distribution fit, commercial potential), each with a cited reason. It then recommends Proceed, Hold or Decline. The venture lands in **Approvals**, where a person makes the call.
5. **Discovery prep**: the research agent also drafts answers to the nine discovery questions from public sources. Anything it can't answer goes on a "To ask in the meeting" list on the venture's page.

### Pathways and stages

Each venture follows a **pathway**, which sets its stages, screening tests and discovery questions. All of the wording lives in `data/pathways.ts`, taken from the Notion process docs.

- **Investment** (stages 0–8): Sourcing, Screening, Founder discovery, Relationship development (optional), Due diligence & structuring, Investment decision, Closing & disbursement, Monitoring & support, Exit & evaluation. The tests are legal & legitimate, commercial traction, meaningful jobs, replicability and vertical fit. Vertical fit is a hard gate and comes from the venture's Si Labs verticals.
- **Distribution partnership** (stages 1–6): Screening, Partner discovery, Distribution feasibility, Commercial agreement, Pilot, Scale or exit. It uses the five tests and nine questions above.
- **Undecided**: Sourcing and Screening only, scored on both sets of tests. New scout candidates start here.

The venture page has a pathway selector and a stage stepper. Clicking a step opens that stage's panel, where you record its outputs (for example milestones and a review date, or the investment decision). **Move to …** stays locked until the current stage's required outputs are filled in. At screening, the decision must be Proceed, and on the Investment path a vertical must be set. Moving back is always allowed. Every move and pathway change is logged with who made it and when (`stageHistory`).

Screening results are Yes / No / Needs analysis. The research agent pre-fills them as unconfirmed suggestions, and clicking a result confirms it. Research currently scores only the Distribution tests (pathway-aware research is not built yet).

Each venture also has **contacts** (chips under the name: add, edit, remove, mark one as primary) and **sourcing** fields (source, originator, verticals, country / region).

**Example deal:** Crepes & Waffles is walked through every Investment stage (`data/example-deal.ts`). Its profile and screening come from public research; stages 2–8 hold placeholder content. On a database seeded earlier, the stored record is upgraded once, the first time the app reads it.

Without `ANTHROPIC_API_KEY` but with Supabase connected, both agents are switched off (`agentsBlocked` in `lib/demo.ts`) so demo results can't overwrite real data. Agents run in the background after the click (`lib/actions.ts`, via Next.js `after()`), and the pages refresh themselves while one is running. Ventures saved under earlier versions are mapped to the new fields when read (`normalizeVenture` in `data/ventures.ts`). They become Distribution ventures, and their old 0–10 scores become unconfirmed results.

## Login and editing

The whole app sits behind a single admin login (`/login`). `proxy.ts` sends anyone without a valid session to the login page, and every server action checks the session too (`requireSession` in `lib/auth.ts`). The session is a signed cookie that lasts 7 days. If the login variables below are missing, nobody can log in.

Every part of a venture page can be edited from its **Edit** button (`/ventures/[id]/edit`): profile, sourcing and verticals, city fit, the screening results and notes for the venture's pathway, the recommendation, the discovery answers (tick "Answered" to take a question off the meeting list), sources and free-form notes. Re-running research replaces the researched fields but keeps the notes.

## Environment variables

| Variable | Needed for |
| --- | --- |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | The login. Never commit these; set them in Vercel. |
| `AUTH_SECRET` | A long random string that signs the session cookie (e.g. `openssl rand -base64 32`). Changing it logs everyone out. |
| `ANTHROPIC_API_KEY` | The scout and research agents (Claude API). Without it the app runs in **demo mode**: both agents return made-up results (names start with "Demo:") after a few seconds, so the flow can be tried end to end. |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Saving catalogue and shortlist data. Easiest setup: Vercel → project → Storage → Create Database → Supabase, which adds both variables. Then create the tables with `supabase/schema.sql`. Empty tables are filled from `data/ventures.ts` on first load. Without these the app keeps data in memory, which resets on every deploy or cold start. |

Agents run inside the server function, so they are capped by its time limit (`maxDuration = 300` seconds in `app/layout.tsx`).
