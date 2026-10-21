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

1. **Scout (AI agent)**: "Run new scout" takes a city. The scout agent (`runScout` in `lib/agents.ts`) uses Claude with web search to profile the city and find proven ventures elsewhere that could be replicated there.
2. **Catalogue**: the scout's candidates, filtered by city with the dropdown.
3. **Shortlist (human)**: clicking "Shortlist" moves a candidate to the shortlist and starts the research agent.
4. **Research (AI agent)**: `runResearch` fills in the profile (business model, scale, jobs, expansion history and the four scores) and cites a source for every claim. Sources live on each venture's profile page.
5. **Approvals (human)**: researched ventures land in Approvals; "Approve for pitching" marks them ready to pitch.

Agents run in the background after the click (`lib/actions.ts`, via Next.js `after()`), and the pages refresh themselves while one is running.

## Environment variables

| Variable | Needed for |
| --- | --- |
| `ANTHROPIC_API_KEY` | The scout and research agents (Claude API). |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Saving catalogue and shortlist data. Create the tables with `supabase/schema.sql`. Without these the app keeps data in memory, which resets on every deploy or cold start. |

Agents run inside the server function, so they are capped by its time limit (`maxDuration = 300` seconds in `app/layout.tsx`).
