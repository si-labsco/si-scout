import type { City, Venture } from '@/data/ventures'
import type { ResearchResult, ScoutResult } from '@/lib/agents'

// Demo mode: with no Anthropic credentials set, the scout and research agents return made-up results
// after a short delay, so the whole flow can be tried end to end. Everything they produce is marked
// as sample data and says so in the text.
export const demoMode = !process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const seeded = (text: string) => { let h = 0; for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return (min: number, max: number) => { h = (h * 1103515245 + 12345) >>> 0; return min + (h % (max - min + 1)) } }

const demoCandidates: Omit<ScoutResult['candidates'][number], 'cityFit' | 'cityFitReason'>[] = [
  { name: 'Demo: Neighbourhood Repair Cafés', sector: 'Climate and jobs', hqCity: 'Amsterdam', hqCountry: 'Netherlands', oneLiner: 'Made-up example: community repair workshops that train local technicians.', website: '', expansionModel: 'franchise' },
  { name: 'Demo: Rooftop Greens Co-op', sector: 'Food, farming and restaurants', hqCity: 'Nairobi', hqCountry: 'Kenya', oneLiner: 'Made-up example: rooftop farms run by worker cooperatives.', website: '', expansionModel: 'cooperative' },
  { name: 'Demo: Care Circle Academy', sector: 'Health', hqCity: 'Manila', hqCountry: 'Philippines', oneLiner: 'Made-up example: training and placement for home caregivers.', website: '', expansionModel: 'partner' },
  { name: 'Demo: Second Chance Kitchens', sector: 'Food, farming and restaurants', hqCity: 'Chicago', hqCountry: 'United States', oneLiner: 'Made-up example: restaurants that hire and train people leaving prison.', website: '', expansionModel: 'franchise' },
  { name: 'Demo: SolarStitch', sector: 'Climate and jobs', hqCity: 'Dhaka', hqCountry: 'Bangladesh', oneLiner: 'Made-up example: solar installer training for garment workers.', website: '', expansionModel: 'partner' },
  { name: 'Demo: CodeBridge Bootcamps', sector: 'Education', hqCity: 'Lagos', hqCountry: 'Nigeria', oneLiner: 'Made-up example: low-cost coding bootcamps with job guarantees.', website: '', expansionModel: 'franchise' },
]

export async function demoScout(cityName: string, knownVentures: string[]): Promise<ScoutResult> {
  await sleep(8000)
  const rand = seeded(cityName)
  const [name, country = ''] = cityName.split(',').map((part) => part.trim())
  return {
    city: { name: cityName, country, demandSignals: [`Demo signal: growing demand for local services in ${name}`, 'Demo signal: young workforce looking for entry-level jobs'], localRivals: ['Demo: existing local operators'], costFit: rand(4, 9), talentFit: rand(5, 9), blockers: ['Demo: licensing and permits to be checked'] },
    candidates: demoCandidates.filter((c) => !knownVentures.includes(c.name)).map((c) => ({ ...c, cityFit: rand(55, 95), cityFitReason: `Demo reasoning: shown to illustrate how the scout explains its fit score for ${name}.` })),
  }
}

export async function demoResearch(venture: Venture, city: City | undefined): Promise<ResearchResult> {
  await sleep(6000)
  const rand = seeded(venture.name)
  const refs = venture.sources.length ? [1] : []
  const score = (what: string) => ({ value: rand(5, 9), reason: `Demo score: illustrates where the research agent would explain ${what}.`, sourceRefs: refs })
  return {
    oneLiner: venture.oneLiner,
    hqCity: venture.hqCity,
    hqCountry: venture.hqCountry,
    businessModel: 'Demo profile, not real research: this is where the agent would describe how the venture makes money, based on the sources it found.',
    yearsRunning: venture.yearsRunning || rand(3, 15),
    scale: `Demo: ${rand(5, 40)} sites in ${rand(2, 6)} cities`,
    jobsCreated: venture.jobsCreated || rand(100, 2000),
    whoTheyEmploy: 'Demo: who the jobs go to would appear here',
    expansionModel: venture.expansionModel,
    expansionHistory: 'Demo text: the agent would summarise how and where the venture has expanded so far, with citations.',
    cityFit: venture.cityFit,
    cityFitReason: `Demo reasoning: the agent would explain why this venture fits ${city?.name ?? 'the target city'}.`,
    scores: { lroi: score('jobs created per dollar'), replicability: score('how easily the model copies'), franchiseReadiness: score('playbooks and unit economics'), willingnessToExpand: score('the founders’ appetite to expand') },
    sources: venture.sources,
  }
}
