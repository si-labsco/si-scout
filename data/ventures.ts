export type City = {
  id: string
  name: string
  country: string
  demandSignals: string[]
  localRivals: string[]
  costFit: number
  talentFit: number
  blockers: string[]
}

export type Score = {
  value: number
  reason: string
}

export type Venture = {
  id: string
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

export const ventures: Venture[] = [
  {
    id: 'sample-one', name: 'Sample Venture One', sector: 'Mobility', hqCity: 'Bengaluru', hqCountry: 'India',
    oneLiner: 'A placeholder cooperative making everyday mobility more accessible.', businessModel: 'Member-owned marketplace', yearsRunning: 6, scale: '18 cities', jobsCreated: 42000, whoTheyEmploy: 'Drivers and local operators', expansionModel: 'cooperative', expansionHistory: 'Expanded from one city to 18 cities; no exits reported.', status: 'ready_to_pitch', cityFit: 88,
    scores: { lroi: { value: 9, reason: 'Creates broad livelihood access.' }, replicability: { value: 9, reason: 'Playbook transfers across dense cities.' }, franchiseReadiness: { value: 8, reason: 'Local operator model is documented.' }, willingnessToExpand: { value: 8, reason: 'Leadership has signaled new-market interest.' } },
    sources: [{ title: 'Placeholder source', url: 'https://example.com' }], lastUpdated: '2026-10-01', isSample: true,
  },
  {
    id: 'sample-two', name: 'Sample Venture Two', sector: 'Food marketplace', hqCity: 'Copenhagen', hqCountry: 'Denmark',
    oneLiner: 'A placeholder platform connecting surplus food with local customers.', businessModel: 'Transaction marketplace', yearsRunning: 10, scale: '17 countries', jobsCreated: 3200, whoTheyEmploy: 'Food partners and market teams', expansionModel: 'partner', expansionHistory: 'Partner-led international growth across 17 countries; no exits reported.', status: 'ready_to_pitch', cityFit: 84,
    scores: { lroi: { value: 8, reason: 'Supports partners and reduces waste.' }, replicability: { value: 9, reason: 'Partner onboarding is repeatable.' }, franchiseReadiness: { value: 8, reason: 'Clear market launch sequence.' }, willingnessToExpand: { value: 8, reason: 'Track record suggests expansion appetite.' } },
    sources: [{ title: 'Placeholder source', url: 'https://example.com' }], lastUpdated: '2026-10-02', isSample: true,
  },
  {
    id: 'sample-three', name: 'Sample Venture Three', sector: 'Food & hospitality', hqCity: 'London', hqCountry: 'United Kingdom',
    oneLiner: 'A placeholder fast-casual concept built around accessible local employment.', businessModel: 'Company-owned stores', yearsRunning: 15, scale: '85 outlets', jobsCreated: 2100, whoTheyEmploy: 'Hospitality teams and apprentices', expansionModel: 'owned', expansionHistory: 'Grew through company-owned outlets; no exits reported.', status: 'needs_review', cityFit: 76,
    scores: { lroi: { value: 8, reason: 'Strong entry-level employment pathway.' }, replicability: { value: 7, reason: 'Operating model needs local adaptation.' }, franchiseReadiness: { value: 6, reason: 'Mostly owned expansion to date.' }, willingnessToExpand: { value: 7, reason: 'Expansion interest needs confirmation.' } },
    sources: [{ title: 'Placeholder source', url: 'https://example.com' }], lastUpdated: '2026-10-03', isSample: true,
  },
  {
    id: 'sample-four', name: 'Sample Venture Four', sector: 'Education', hqCity: 'Bogotá', hqCountry: 'Colombia',
    oneLiner: 'A placeholder learning business creating pathways into local work.', businessModel: 'Community-based service', yearsRunning: 12, scale: '140 locations', jobsCreated: 4800, whoTheyEmploy: 'Educators and community managers', expansionModel: 'franchise', expansionHistory: 'Scaled through local franchise partners; no exits reported.', status: 'needs_review', cityFit: 72,
    scores: { lroi: { value: 8, reason: 'Creates locally anchored jobs.' }, replicability: { value: 7, reason: 'Community model is adaptable.' }, franchiseReadiness: { value: 8, reason: 'Partner-led rollout is established.' }, willingnessToExpand: { value: 6, reason: 'New-market appetite is unverified.' } },
    sources: [{ title: 'Placeholder source', url: 'https://example.com' }], lastUpdated: '2026-10-04', isSample: true,
  },
]
