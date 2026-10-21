import Anthropic from '@anthropic-ai/sdk'
import type { City, Venture } from '@/data/ventures'

// The two AI agents behind the pipeline:
//  - runScout: searches the web for proven ventures that could be brought to a city (fills the catalogue).
//  - runResearch: researches one shortlisted venture in depth, citing a source for each claim.
// Both use Claude with web search / web fetch and return their result through a "submit" tool,
// so the output is structured JSON the app can store directly.

const MODEL = 'claude-opus-5-5'
const client = new Anthropic()

const LAB_CONTEXT = `Si-Labs is a venture lab that brings proven, livelihood-creating ventures from one place to a new city.
The lab acts as a franchise and distribution hub: it finds ventures with a track record elsewhere, checks they can be
replicated, and helps them enter the target city in exchange for a fee or revenue share. The lab cares most about
LROI (Livelihood Return on Investment: good jobs created per dollar invested), replicability, franchise-readiness
and the founders' willingness to expand. Prefer ventures with real operating history over early-stage ideas.`

const expansionModels = ['franchise', 'partner', 'cooperative', 'owned'] as const

type SubmitTool<T> = { tool: Anthropic.Beta.BetaTool; parse: (input: unknown) => T }

async function runAgent<T>({ system, prompt, submit }: { system: string; prompt: string; submit: SubmitTool<T> }): Promise<T> {
  const messages: Anthropic.Beta.BetaMessageParam[] = [{ role: 'user', content: prompt }]
  for (let turn = 0; turn < 8; turn++) {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'medium' },
      system,
      tools: [
        { type: 'web_search_20260209', name: 'web_search', max_uses: 10 },
        { type: 'web_fetch_20260209', name: 'web_fetch', max_uses: 6 },
        submit.tool,
      ],
      messages,
    })
    if (response.stop_reason === 'refusal') throw new Error(`The model declined this request (${response.stop_details?.category ?? 'no category'}).`)
    messages.push({ role: 'assistant', content: response.content })

    const call = response.content.find((block): block is Anthropic.Beta.BetaToolUseBlock => block.type === 'tool_use' && block.name === submit.tool.name)
    if (call) {
      try {
        return submit.parse(call.input)
      } catch (error) {
        messages.push({ role: 'user', content: [{ type: 'tool_result', tool_use_id: call.id, is_error: true, content: `Invalid input: ${(error as Error).message}. Call ${submit.tool.name} again with corrected input.` }] })
        continue
      }
    }
    if (response.stop_reason === 'pause_turn') continue // server-side tool loop paused; resend to resume
    if (response.stop_reason === 'max_tokens') throw new Error('The agent ran out of output tokens before finishing.')
    messages.push({ role: 'user', content: `Call ${submit.tool.name} now with what you have found.` })
  }
  throw new Error('The agent did not return a result.')
}

// --- Input parsing -----------------------------------------------------------

const record = (value: unknown, field: string) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${field} must be an object`)
  return value as Record<string, unknown>
}
const text = (value: unknown, field: string) => {
  if (typeof value !== 'string') throw new Error(`${field} must be a string`)
  return value.trim()
}
const integer = (value: unknown, field: string, min: number, max: number) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(`${field} must be a number`)
  return Math.min(max, Math.max(min, Math.round(value)))
}
const list = (value: unknown, field: string) => {
  if (!Array.isArray(value)) throw new Error(`${field} must be an array`)
  return value
}
const texts = (value: unknown, field: string) => list(value, field).map((item, i) => text(item, `${field}[${i}]`))
const expansionModel = (value: unknown, field: string): Venture['expansionModel'] => {
  const model = text(value, field)
  if (!expansionModels.includes(model as Venture['expansionModel'])) throw new Error(`${field} must be one of ${expansionModels.join(', ')}`)
  return model as Venture['expansionModel']
}
const url = (value: unknown, field: string) => {
  const link = text(value, field)
  if (link && !/^https?:\/\//.test(link)) throw new Error(`${field} must be an http(s) URL or empty`)
  return link
}

const strictObject = (properties: Record<string, unknown>) => ({ type: 'object' as const, properties, required: Object.keys(properties), additionalProperties: false })
const stringList = { type: 'array', items: { type: 'string' } }

// --- Scout -------------------------------------------------------------------

export type ScoutCandidate = Pick<Venture, 'name' | 'sector' | 'hqCity' | 'hqCountry' | 'oneLiner' | 'expansionModel' | 'cityFit' | 'cityFitReason'> & { website: string }
export type ScoutResult = { city: Omit<City, 'id' | 'scout'>; candidates: ScoutCandidate[] }

const scoutTool: SubmitTool<ScoutResult> = {
  tool: {
    name: 'submit_candidates',
    description: 'Submit the target city profile and the list of venture candidates you found. Call this once, at the end.',
    strict: true,
    input_schema: strictObject({
      city: strictObject({
        name: { type: 'string', description: 'City name, properly capitalised' },
        country: { type: 'string' },
        demandSignals: { ...stringList, description: '2-4 short local needs or market signals' },
        localRivals: { ...stringList, description: 'Local operators already doing similar things' },
        costFit: { type: 'integer', description: '0-10: how affordable it is to operate here' },
        talentFit: { type: 'integer', description: '0-10: availability of the workforce these ventures need' },
        blockers: { ...stringList, description: 'Main risks or barriers to entry' },
      }),
      candidates: {
        type: 'array',
        items: strictObject({
          name: { type: 'string' },
          sector: { type: 'string', description: 'e.g. Education, Climate and jobs, Food, farming and restaurants, Tech, Health' },
          hqCity: { type: 'string' },
          hqCountry: { type: 'string' },
          oneLiner: { type: 'string', description: 'One sentence on what the venture does' },
          website: { type: 'string', description: 'Official website URL, or empty string if unknown' },
          expansionModel: { type: 'string', enum: [...expansionModels], description: 'Most plausible way to bring it to the city' },
          cityFit: { type: 'integer', description: '0-100: how well it fits the target city' },
          cityFitReason: { type: 'string', description: 'One or two sentences on why it fits (or does not)' },
        }),
      },
    }),
  },
  parse: (input) => {
    const root = record(input, 'input')
    const city = record(root.city, 'city')
    return {
      city: {
        name: text(city.name, 'city.name'),
        country: text(city.country, 'city.country'),
        demandSignals: texts(city.demandSignals, 'city.demandSignals'),
        localRivals: texts(city.localRivals, 'city.localRivals'),
        costFit: integer(city.costFit, 'city.costFit', 0, 10),
        talentFit: integer(city.talentFit, 'city.talentFit', 0, 10),
        blockers: texts(city.blockers, 'city.blockers'),
      },
      candidates: list(root.candidates, 'candidates').map((item, i) => {
        const c = record(item, `candidates[${i}]`)
        return {
          name: text(c.name, `candidates[${i}].name`),
          sector: text(c.sector, `candidates[${i}].sector`),
          hqCity: text(c.hqCity, `candidates[${i}].hqCity`),
          hqCountry: text(c.hqCountry, `candidates[${i}].hqCountry`),
          oneLiner: text(c.oneLiner, `candidates[${i}].oneLiner`),
          website: url(c.website, `candidates[${i}].website`),
          expansionModel: expansionModel(c.expansionModel, `candidates[${i}].expansionModel`),
          cityFit: integer(c.cityFit, `candidates[${i}].cityFit`, 0, 100),
          cityFitReason: text(c.cityFitReason, `candidates[${i}].cityFitReason`),
        }
      }),
    }
  },
}

export function runScout(cityName: string, knownVentures: string[]) {
  return runAgent({
    system: `You are the scouting agent for Si-Labs.\n\n${LAB_CONTEXT}\n\nYour job: given a target city, research what the city needs and find proven ventures from other places that could be brought there. Use web search to check that each venture is real and operating. Be honest in the fit scores; a human will decide which candidates to shortlist.`,
    prompt: `Target city: ${cityName}\n\nFind 8 to 12 venture candidates that could be replicated in this city.${knownVentures.length ? `\n\nAlready in the catalogue, do not repeat: ${knownVentures.join(', ')}.` : ''}\n\nWhen you are done, call submit_candidates.`,
    submit: scoutTool,
  })
}

// --- Research ----------------------------------------------------------------

export type ResearchResult = Pick<Venture, 'oneLiner' | 'hqCity' | 'hqCountry' | 'businessModel' | 'yearsRunning' | 'scale' | 'jobsCreated' | 'whoTheyEmploy' | 'expansionModel' | 'expansionHistory' | 'cityFit' | 'cityFitReason' | 'scores' | 'sources'>

const scoreSchema = (description: string) => strictObject({
  value: { type: 'integer', description: `0-10. ${description}` },
  reason: { type: 'string', description: 'One or two sentences explaining the score' },
  sourceRefs: { type: 'array', items: { type: 'integer' }, description: '1-based indexes into sources that back this score' },
})

const researchTool: SubmitTool<ResearchResult> = {
  tool: {
    name: 'submit_research',
    description: 'Submit the completed venture profile. Every factual claim should be backed by an entry in sources. Call this once, at the end.',
    strict: true,
    input_schema: strictObject({
      oneLiner: { type: 'string' },
      hqCity: { type: 'string' },
      hqCountry: { type: 'string' },
      businessModel: { type: 'string', description: 'How the venture makes money, 2-4 sentences' },
      yearsRunning: { type: 'integer', description: 'Years since founding; 0 if unknown' },
      scale: { type: 'string', description: 'Current footprint, e.g. "42 locations in 3 countries"' },
      jobsCreated: { type: 'integer', description: 'Approximate number of people employed or supported; 0 if unknown' },
      whoTheyEmploy: { type: 'string', description: 'Who the jobs go to, e.g. "young women from low-income areas"' },
      expansionModel: { type: 'string', enum: [...expansionModels] },
      expansionHistory: { type: 'string', description: 'How and where it has expanded so far, 2-4 sentences' },
      cityFit: { type: 'integer', description: '0-100: fit for the target city' },
      cityFitReason: { type: 'string', description: 'Why it fits the target city, 2-3 sentences' },
      scores: strictObject({
        lroi: scoreSchema('Livelihood Return on Investment: good jobs created per dollar invested'),
        replicability: scoreSchema('How easily the model can be copied in a new city'),
        franchiseReadiness: scoreSchema('Documented playbooks, training, brand and unit economics ready for franchising'),
        willingnessToExpand: scoreSchema('Evidence the founders want to expand to new cities'),
      }),
      sources: {
        type: 'array',
        description: 'The pages you relied on, in the order you cite them',
        items: strictObject({ title: { type: 'string' }, url: { type: 'string' } }),
      },
    }),
  },
  parse: (input) => {
    const root = record(input, 'input')
    const scores = record(root.scores, 'scores')
    const sources = list(root.sources, 'sources').map((item, i) => {
      const source = record(item, `sources[${i}]`)
      return { title: text(source.title, `sources[${i}].title`), url: url(source.url, `sources[${i}].url`) }
    }).filter((source) => source.url)
    if (!sources.length) throw new Error('sources must contain at least one URL')
    const score = (key: keyof Venture['scores']) => {
      const s = record(scores[key], `scores.${key}`)
      return {
        value: integer(s.value, `scores.${key}.value`, 0, 10),
        reason: text(s.reason, `scores.${key}.reason`),
        sourceRefs: list(s.sourceRefs, `scores.${key}.sourceRefs`).map((ref, i) => integer(ref, `scores.${key}.sourceRefs[${i}]`, 1, sources.length)),
      }
    }
    return {
      oneLiner: text(root.oneLiner, 'oneLiner'),
      hqCity: text(root.hqCity, 'hqCity'),
      hqCountry: text(root.hqCountry, 'hqCountry'),
      businessModel: text(root.businessModel, 'businessModel'),
      yearsRunning: integer(root.yearsRunning, 'yearsRunning', 0, 500),
      scale: text(root.scale, 'scale'),
      jobsCreated: integer(root.jobsCreated, 'jobsCreated', 0, 10_000_000),
      whoTheyEmploy: text(root.whoTheyEmploy, 'whoTheyEmploy'),
      expansionModel: expansionModel(root.expansionModel, 'expansionModel'),
      expansionHistory: text(root.expansionHistory, 'expansionHistory'),
      cityFit: integer(root.cityFit, 'cityFit', 0, 100),
      cityFitReason: text(root.cityFitReason, 'cityFitReason'),
      scores: { lroi: score('lroi'), replicability: score('replicability'), franchiseReadiness: score('franchiseReadiness'), willingnessToExpand: score('willingnessToExpand') },
      sources,
    }
  },
}

export function runResearch(venture: Venture, city: City | undefined) {
  const known = { name: venture.name, sector: venture.sector, hq: `${venture.hqCity}, ${venture.hqCountry}`, oneLiner: venture.oneLiner, links: venture.sources.map((s) => s.url) }
  return runAgent({
    system: `You are the research agent for Si-Labs.\n\n${LAB_CONTEXT}\n\nYour job: a human has shortlisted a venture. Do the background research the lab needs to decide whether to pitch it: business model, scale, jobs and who they go to, expansion history, and the four scores. Use web search and web fetch, prefer primary sources (the venture's own site, annual reports, reputable press), and cite every claim. If something cannot be found, say so plainly instead of guessing.`,
    prompt: `Venture to research:\n${JSON.stringify(known, null, 2)}\n\nTarget city: ${city ? `${city.name}${city.country ? `, ${city.country}` : ''}` : 'unknown'}${city?.demandSignals.length ? `\nCity demand signals: ${city.demandSignals.join('; ')}` : ''}\n\nWhen you are done, call submit_research.`,
    submit: researchTool,
  })
}
