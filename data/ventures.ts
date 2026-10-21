export type City = {
  id: string
  name: string
  country: string
  demandSignals: string[]
  localRivals: string[]
  costFit: number
  talentFit: number
  blockers: string[]
  scout?: AgentRun
}

export type AgentRun = {
  status: 'not_started' | 'running' | 'done' | 'failed'
  startedAt?: string
  finishedAt?: string
  error?: string
}

export type Score = {
  value: number
  reason: string
  sourceRefs?: number[]
}

export type Venture = {
  id: string
  cityId: string
  stage: 'catalogue' | 'shortlisted'
  research: AgentRun
  name: string
  sector: string
  hqCity: string
  hqCountry: string
  oneLiner: string
  businessModel: string
  yearsRunning: number
  scale: string
  jobsCreated: number
  whoTheyEmploy: string
  expansionModel: 'franchise' | 'partner' | 'cooperative' | 'owned'
  expansionHistory: string
  status: 'new' | 'needs_review' | 'ready_to_pitch'
  cityFit: number
  cityFitReason: string
  scores: {
    lroi: Score
    replicability: Score
    franchiseReadiness: Score
    willingnessToExpand: Score
  }
  sources: { title: string; url: string }[]
  lastUpdated: string
  isSample: boolean
}

export const selectedCityId = 'new-york'

export const cities: City[] = [
  {
    id: 'new-york',
    name: 'New York',
    country: 'United States',
    demandSignals: ['Dense neighborhoods', 'High service demand', 'Strong founder ecosystem'],
    localRivals: ['Established operators', 'Well-funded marketplaces'],
    costFit: 6,
    talentFit: 9,
    blockers: ['High operating costs', 'Complex compliance'],
  },
]

type SeedVenture = Omit<Venture, 'cityId' | 'stage' | 'research' | 'cityFitReason'>

// Ventures shared in #ventures-for-si-labs. Numbers and scores are random placeholders until researched.
const seed: SeedVenture[] = [
  {
    id: 'jo-academy', name: "Jo Academy", sector: "Education", hqCity: "Amman", hqCountry: "Jordan",
    oneLiner: "Digital learning for 2.5M+ students in Jordan, KSA and Iraq.", businessModel: 'To be researched', yearsRunning: 10, scale: 'To be researched', jobsCreated: 3300, whoTheyEmploy: 'To be researched', expansionModel: 'franchise', expansionHistory: 'To be researched.', status: 'needs_review', cityFit: 95,
    scores: { lroi: { value: 6, reason: 'Placeholder score, to be researched.' }, replicability: { value: 9, reason: 'Placeholder score, to be researched.' }, franchiseReadiness: { value: 8, reason: 'Placeholder score, to be researched.' }, willingnessToExpand: { value: 6, reason: 'Placeholder score, to be researched.' } },
    sources: [{ title: "Jo Academy website", url: 'https://www.joacademy.com/en' }], lastUpdated: '2026-10-20', isSample: true,
  },
  {
    id: 'kla-schools', name: "KLA Schools", sector: "Education", hqCity: "Miami", hqCountry: "United States",
    oneLiner: "A fast-growing preschool concept based on the Reggio Emilia approach.", businessModel: 'To be researched', yearsRunning: 17, scale: 'To be researched', jobsCreated: 3800, whoTheyEmploy: 'To be researched', expansionModel: 'cooperative', expansionHistory: 'To be researched.', status: 'new', cityFit: 60,
    scores: { lroi: { value: 6, reason: 'Placeholder score, to be researched.' }, replicability: { value: 8, reason: 'Placeholder score, to be researched.' }, franchiseReadiness: { value: 7, reason: 'Placeholder score, to be researched.' }, willingnessToExpand: { value: 7, reason: 'Placeholder score, to be researched.' } },
    sources: [{ title: "KLA Schools website", url: 'https://www.klaschools.com/' }], lastUpdated: '2026-10-20', isSample: true,
  },
  {
    id: 'climateready', name: "ClimateReady", sector: "Climate and jobs", hqCity: "To research", hqCountry: "To research",
    oneLiner: "A city-level heat action plan that creates local jobs.", businessModel: 'To be researched', yearsRunning: 7, scale: 'To be researched', jobsCreated: 1400, whoTheyEmploy: 'To be researched', expansionModel: 'cooperative', expansionHistory: 'To be researched.', status: 'needs_review', cityFit: 66,
    scores: { lroi: { value: 5, reason: 'Placeholder score, to be researched.' }, replicability: { value: 8, reason: 'Placeholder score, to be researched.' }, franchiseReadiness: { value: 5, reason: 'Placeholder score, to be researched.' }, willingnessToExpand: { value: 7, reason: 'Placeholder score, to be researched.' } },
    sources: [{ title: "ClimateReady website", url: 'https://www.climateready.si/' }], lastUpdated: '2026-10-20', isSample: true,
  },
  {
    id: 'climate-week-network', name: "Climate Week Network", sector: "Climate and jobs", hqCity: "To research", hqCountry: "To research",
    oneLiner: "The largest network of Climate Weeks.", businessModel: 'To be researched', yearsRunning: 14, scale: 'To be researched', jobsCreated: 3900, whoTheyEmploy: 'To be researched', expansionModel: 'cooperative', expansionHistory: 'To be researched.', status: 'needs_review', cityFit: 62,
    scores: { lroi: { value: 8, reason: 'Placeholder score, to be researched.' }, replicability: { value: 9, reason: 'Placeholder score, to be researched.' }, franchiseReadiness: { value: 5, reason: 'Placeholder score, to be researched.' }, willingnessToExpand: { value: 8, reason: 'Placeholder score, to be researched.' } },
    sources: [{ title: "Climate Week Network website", url: 'https://climateweeknetwork.org/' }], lastUpdated: '2026-10-20', isSample: true,
  },
  {
    id: 'climatebase-fellowship', name: "Climatebase Fellowship", sector: "Climate and jobs", hqCity: "To research", hqCountry: "To research",
    oneLiner: "A climate careers fellowship and Climatebase's core revenue source.", businessModel: 'To be researched', yearsRunning: 5, scale: 'To be researched', jobsCreated: 3600, whoTheyEmploy: 'To be researched', expansionModel: 'cooperative', expansionHistory: 'To be researched.', status: 'new', cityFit: 83,
    scores: { lroi: { value: 9, reason: 'Placeholder score, to be researched.' }, replicability: { value: 6, reason: 'Placeholder score, to be researched.' }, franchiseReadiness: { value: 5, reason: 'Placeholder score, to be researched.' }, willingnessToExpand: { value: 5, reason: 'Placeholder score, to be researched.' } },
    sources: [{ title: "Climatebase Fellowship website", url: 'https://climatebase.org/fellowship' }], lastUpdated: '2026-10-20', isSample: true,
  },
  {
    id: 'plazrok', name: "Plazrok", sector: "Climate and jobs", hqCity: "To research", hqCountry: "To research",
    oneLiner: "Makes concrete aggregates from waste plastic.", businessModel: 'To be researched', yearsRunning: 24, scale: 'To be researched', jobsCreated: 1500, whoTheyEmploy: 'To be researched', expansionModel: 'cooperative', expansionHistory: 'To be researched.', status: 'new', cityFit: 65,
    scores: { lroi: { value: 6, reason: 'Placeholder score, to be researched.' }, replicability: { value: 5, reason: 'Placeholder score, to be researched.' }, franchiseReadiness: { value: 8, reason: 'Placeholder score, to be researched.' }, willingnessToExpand: { value: 7, reason: 'Placeholder score, to be researched.' } },
    sources: [{ title: "Plazrok website", url: 'https://plazrok.com/' }], lastUpdated: '2026-10-20', isSample: true,
  },
  {
    id: 'inventwood', name: "InventWood", sector: "Climate and jobs", hqCity: "To research", hqCountry: "To research",
    oneLiner: "Makes \"Superwood\", an engineered wood material.", businessModel: 'To be researched', yearsRunning: 17, scale: 'To be researched', jobsCreated: 4100, whoTheyEmploy: 'To be researched', expansionModel: 'cooperative', expansionHistory: 'To be researched.', status: 'new', cityFit: 70,
    scores: { lroi: { value: 7, reason: 'Placeholder score, to be researched.' }, replicability: { value: 7, reason: 'Placeholder score, to be researched.' }, franchiseReadiness: { value: 6, reason: 'Placeholder score, to be researched.' }, willingnessToExpand: { value: 7, reason: 'Placeholder score, to be researched.' } },
    sources: [{ title: "InventWood website", url: 'https://www.inventwood.com/' }], lastUpdated: '2026-10-20', isSample: true,
  },
  {
    id: 'tony-romas', name: "Tony Roma's", sector: "Food, farming and restaurants", hqCity: "To research", hqCountry: "To research",
    oneLiner: "A restaurant chain, suggested by WeFranch.", businessModel: 'To be researched', yearsRunning: 25, scale: 'To be researched', jobsCreated: 4400, whoTheyEmploy: 'To be researched', expansionModel: 'franchise', expansionHistory: 'To be researched.', status: 'needs_review', cityFit: 70,
    scores: { lroi: { value: 9, reason: 'Placeholder score, to be researched.' }, replicability: { value: 6, reason: 'Placeholder score, to be researched.' }, franchiseReadiness: { value: 6, reason: 'Placeholder score, to be researched.' }, willingnessToExpand: { value: 8, reason: 'Placeholder score, to be researched.' } },
    sources: [{ title: "Tony Roma's website", url: 'https://www.tonyromas.com/' }], lastUpdated: '2026-10-20', isSample: true,
  },
  {
    id: 'area-2-farms', name: "Area 2 Farms", sector: "Food, farming and restaurants", hqCity: "To research", hqCountry: "To research",
    oneLiner: "A franchise model of organic farms.", businessModel: 'To be researched', yearsRunning: 15, scale: 'To be researched', jobsCreated: 1800, whoTheyEmploy: 'To be researched', expansionModel: 'partner', expansionHistory: 'To be researched.', status: 'ready_to_pitch', cityFit: 80,
    scores: { lroi: { value: 5, reason: 'Placeholder score, to be researched.' }, replicability: { value: 6, reason: 'Placeholder score, to be researched.' }, franchiseReadiness: { value: 5, reason: 'Placeholder score, to be researched.' }, willingnessToExpand: { value: 7, reason: 'Placeholder score, to be researched.' } },
    sources: [{ title: "Area 2 Farms website", url: 'https://www.area2farms.com/' }], lastUpdated: '2026-10-20', isSample: true,
  },
  {
    id: 'crepes-and-waffles', name: "Crepes & Waffles", sector: "Food, farming and restaurants", hqCity: "Bogotá", hqCountry: "Colombia",
    oneLiner: "A Colombian restaurant chain with social impact at its core.", businessModel: 'To be researched', yearsRunning: 15, scale: 'To be researched', jobsCreated: 1800, whoTheyEmploy: 'To be researched', expansionModel: 'franchise', expansionHistory: 'To be researched.', status: 'ready_to_pitch', cityFit: 73,
    scores: { lroi: { value: 9, reason: 'Placeholder score, to be researched.' }, replicability: { value: 7, reason: 'Placeholder score, to be researched.' }, franchiseReadiness: { value: 6, reason: 'Placeholder score, to be researched.' }, willingnessToExpand: { value: 8, reason: 'Placeholder score, to be researched.' } },
    sources: [{ title: "Crepes & Waffles website", url: 'https://www.crepesywaffles.com/' }], lastUpdated: '2026-10-20', isSample: true,
  },
  {
    id: 'leon', name: "Leon Restaurants", sector: "Food, farming and restaurants", hqCity: "London", hqCountry: "United Kingdom",
    oneLiner: "A UK restaurant chain and case study.", businessModel: 'To be researched', yearsRunning: 15, scale: 'To be researched', jobsCreated: 4200, whoTheyEmploy: 'To be researched', expansionModel: 'owned', expansionHistory: 'To be researched.', status: 'new', cityFit: 69,
    scores: { lroi: { value: 7, reason: 'Placeholder score, to be researched.' }, replicability: { value: 6, reason: 'Placeholder score, to be researched.' }, franchiseReadiness: { value: 6, reason: 'Placeholder score, to be researched.' }, willingnessToExpand: { value: 9, reason: 'Placeholder score, to be researched.' } },
    sources: [{ title: "Leon Restaurants website", url: 'https://en.wikipedia.org/wiki/Leon_Restaurants' }], lastUpdated: '2026-10-20', isSample: true,
  },
  {
    id: 'restorative-farms', name: "Restorative Farms", sector: "Food, farming and restaurants", hqCity: "Dallas", hqCountry: "United States",
    oneLiner: "An urban farming nonprofit.", businessModel: 'To be researched', yearsRunning: 20, scale: 'To be researched', jobsCreated: 1700, whoTheyEmploy: 'To be researched', expansionModel: 'owned', expansionHistory: 'To be researched.', status: 'new', cityFit: 85,
    scores: { lroi: { value: 7, reason: 'Placeholder score, to be researched.' }, replicability: { value: 6, reason: 'Placeholder score, to be researched.' }, franchiseReadiness: { value: 6, reason: 'Placeholder score, to be researched.' }, willingnessToExpand: { value: 9, reason: 'Placeholder score, to be researched.' } },
    sources: [{ title: "Restorative Farms website", url: 'https://restorativefarms.org/' }], lastUpdated: '2026-10-20', isSample: true,
  },
  {
    id: 'plant-it-forward', name: "Plant It Forward", sector: "Food, farming and restaurants", hqCity: "Houston", hqCountry: "United States",
    oneLiner: "An urban farm and farmer training programme.", businessModel: 'To be researched', yearsRunning: 18, scale: 'To be researched', jobsCreated: 600, whoTheyEmploy: 'To be researched', expansionModel: 'franchise', expansionHistory: 'To be researched.', status: 'needs_review', cityFit: 67,
    scores: { lroi: { value: 6, reason: 'Placeholder score, to be researched.' }, replicability: { value: 6, reason: 'Placeholder score, to be researched.' }, franchiseReadiness: { value: 8, reason: 'Placeholder score, to be researched.' }, willingnessToExpand: { value: 9, reason: 'Placeholder score, to be researched.' } },
    sources: [{ title: "Plant It Forward website", url: 'https://www.plantitforward.farm/' }], lastUpdated: '2026-10-20', isSample: true,
  },
  {
    id: 'urban-harvest', name: "Urban Harvest", sector: "Food, farming and restaurants", hqCity: "Houston", hqCountry: "United States",
    oneLiner: "A farmers market and community gardens.", businessModel: 'To be researched', yearsRunning: 5, scale: 'To be researched', jobsCreated: 2500, whoTheyEmploy: 'To be researched', expansionModel: 'owned', expansionHistory: 'To be researched.', status: 'new', cityFit: 89,
    scores: { lroi: { value: 9, reason: 'Placeholder score, to be researched.' }, replicability: { value: 7, reason: 'Placeholder score, to be researched.' }, franchiseReadiness: { value: 9, reason: 'Placeholder score, to be researched.' }, willingnessToExpand: { value: 5, reason: 'Placeholder score, to be researched.' } },
    sources: [{ title: "Urban Harvest website", url: 'https://www.urbanharvest.org/' }], lastUpdated: '2026-10-20', isSample: true,
  },
  {
    id: 'aesir', name: "Aesir", sector: "Tech", hqCity: "Hong Kong", hqCountry: "Hong Kong",
    oneLiner: "Augmented reality with a purpose.", businessModel: 'To be researched', yearsRunning: 24, scale: 'To be researched', jobsCreated: 4700, whoTheyEmploy: 'To be researched', expansionModel: 'franchise', expansionHistory: 'To be researched.', status: 'ready_to_pitch', cityFit: 94,
    scores: { lroi: { value: 7, reason: 'Placeholder score, to be researched.' }, replicability: { value: 7, reason: 'Placeholder score, to be researched.' }, franchiseReadiness: { value: 5, reason: 'Placeholder score, to be researched.' }, willingnessToExpand: { value: 7, reason: 'Placeholder score, to be researched.' } },
    sources: [{ title: "Aesir website", url: 'https://aesir.hk/' }], lastUpdated: '2026-10-20', isSample: true,
  },
  {
    id: 'ana', name: "ANA", sector: "Tech", hqCity: "To research", hqCountry: "To research",
    oneLiner: "An AI tool for caregivers.", businessModel: 'To be researched', yearsRunning: 16, scale: 'To be researched', jobsCreated: 1100, whoTheyEmploy: 'To be researched', expansionModel: 'owned', expansionHistory: 'To be researched.', status: 'ready_to_pitch', cityFit: 60,
    scores: { lroi: { value: 7, reason: 'Placeholder score, to be researched.' }, replicability: { value: 9, reason: 'Placeholder score, to be researched.' }, franchiseReadiness: { value: 6, reason: 'Placeholder score, to be researched.' }, willingnessToExpand: { value: 9, reason: 'Placeholder score, to be researched.' } },
    sources: [{ title: "ANA website", url: 'https://ana.care/' }], lastUpdated: '2026-10-20', isSample: true,
  },
]

// Seed data for the first run. Ventures already under review start on the shortlist; the rest sit in the catalogue.
export const ventures: Venture[] = seed.map((venture) => ({
  ...venture,
  cityId: selectedCityId,
  stage: venture.status === 'new' ? 'catalogue' : 'shortlisted',
  research: { status: 'not_started' },
  cityFitReason: '',
}))
