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

The app follows stages 1–2 of the Si Labs **Distribution Partnership framework**: helping established, job-creating businesses enter new markets through local Lab Leads, for commercial returns to the business, Si Labs and the Lab Lead. Si Labs does not provide financing on this pathway.

1. **Scout (AI agent)**: "Run new scout" takes a city. The scout agent (`runScout` in `lib/agents.ts`) uses Claude with web search to profile the city and find proven ventures elsewhere that could enter it.
2. **Catalogue**: the scout's candidates, filtered by city with the dropdown.
3. **Shortlist (human)**: clicking "Shortlist" moves a candidate to the shortlist and starts the research agent.
4. **Screening (AI agent, then human)**: `runResearch` fills in the profile and scores the five screening tests (commercial viability, decent jobs, replicability, distribution fit, commercial potential), each with a cited reason. It then recommends Proceed, Hold or Decline. The venture lands in **Approvals**, where a person makes the call.
5. **Discovery prep**: the research agent also drafts answers to the nine discovery questions from public sources. Anything it can't answer goes on a "To ask in the meeting" list on the venture's page.

Stages 3–6 of the framework (distribution feasibility and economics, commercial agreement, pilot, scale or exit) are not built yet. The test and question wording lives in `screeningTests` and `discoveryQuestions` in `data/ventures.ts`.

Agents run in the background after the click (`lib/actions.ts`, via Next.js `after()`), and the pages refresh themselves while one is running. Ventures saved before the screening framework are mapped to the new fields when read (`normalizeVenture` in `lib/store.ts`). Re-run research on them to screen them properly.

## Environment variables

| Variable | Needed for |
| --- | --- |
| `ANTHROPIC_API_KEY` | The scout and research agents (Claude API). Without it the app runs in **demo mode**: both agents return made-up results (names start with "Demo:") after a few seconds, so the flow can be tried end to end. |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Saving catalogue and shortlist data. Create the tables with `supabase/schema.sql`. Without these the app keeps data in memory, which resets on every deploy or cold start. |

Agents run inside the server function, so they are capped by its time limit (`maxDuration = 300` seconds in `app/layout.tsx`).
