import type { Venture } from '@/data/ventures'

// Example deal for the mock-up: the Crepes & Waffles record (already in the catalogue from
// #ventures-for-si-labs) walked through every Investment stage, 0–8. The profile and the screening
// notes come from its public sources (Oct 2026). Everything from founder discovery onwards is made
// up to show what each stage records, and says so: no meeting or deal has happened.
const by = 'Example deal'
const step = (from: string | undefined, to: string, at: string) => ({ from, to, pathway: 'investment' as const, at: `${at}T09:00:00.000Z`, by })

export const exampleDealId = 'crepes-and-waffles'

// Pipeline fields laid over the seed record. Source refs point at that record's sources:
// 1 Valora Analitik, 2 Mall & Retail, 3 La República, 4 Forbes Colombia, 5 B Lab, 6 company locations page.
export const exampleDeal = (venture: Pick<Venture, 'scores' | 'discovery'>): Partial<Venture> => ({
  status: 'proceed',
  scores: {
    ...venture.scores,
    legalLegitimate: { result: 'yes', note: 'Registered Colombian company trading since 1980, with audited results reported to Supersociedades; certified B Corp.', sourceRefs: [2, 5], confirmed: true },
    commercialTraction: { result: 'yes', note: 'About COP 1.26 trillion revenue and COP 68bn net profit in 2025, growing 13% a year, across about 180 outlets.', sourceRefs: [1, 2, 6], confirmed: true },
    meaningfulJobs: { result: 'yes', note: 'About 9,300 jobs, mostly for women heads of household, with housing, education and childcare benefits.', sourceRefs: [4, 5], confirmed: true },
    replicability: { result: 'yes', note: 'Standard restaurant, ice-cream parlour and to-go formats already run in 6 countries.', sourceRefs: [3], confirmed: true },
  },
  screening: { recommendation: 'proceed', rationale: 'Passes all five Investment tests: legitimate and profitable, proven at scale, a strong jobs story for women, repeatable formats, and inside the Experience Economy and Nature & Food Systems verticals.' },
  discovery: [
    ...venture.discovery.filter((d) => !d.key.startsWith('inv.')),
    { key: 'inv.business', source: 'public', answer: 'Company-run restaurants, ice-cream parlours and to-go kiosks for middle-income customers in Colombia, Latin America and Spain.' },
    { key: 'inv.economics', source: 'ask', answer: 'Public sources give group revenue and a 5.4% net margin (2025); ask for revenue, margin and payback per site.' },
    { key: 'inv.jobs', source: 'public', answer: 'About 9,300 staff across about 180 outlets, roughly 50 per site; mostly women heads of household.' },
    { key: 'inv.growth', source: 'public', answer: 'Still opening new Colombian cities (Ibagué, Nov 2025); abroad it runs about 30 sites in 5 countries. The US is mentioned in press as a possible market.' },
    { key: 'inv.funding', source: 'ask', answer: 'Ask how much capital a new-country entry needs, and whether it has always been self-funded.' },
    { key: 'inv.investors', source: 'ask', answer: 'Family-owned as far as public sources show. Ask whether outside capital has ever been considered.' },
    { key: 'inv.ask', source: 'ask', answer: 'Ask whether Lab Leads could help with sites, hiring partners or community marketing in a new country.' },
    { key: 'inv.instrument', source: 'ask', answer: 'Hypothesis to test: revenue-share or debt tied to new-site openings, since the family keeps full ownership.' },
  ],
  notes: 'Example deal for the mock-up review. Stages 0–1 use real public research; stages 2–8 hold placeholder content.',
  list: 'shortlisted',
  pathway: 'investment',
  stage: 'exit',
  source: '#ventures-for-si-labs',
  originator: 'Si Labs team',
  verticals: ['Experience Economy', 'Nature & Food Systems'],
  countryRegion: 'Colombia / Latin America',
  contacts: [
    { id: 'c-ceo', name: 'CEO (placeholder)', role: 'CEO', isPrimary: true },
    { id: 'c-impact', name: 'Impact lead (placeholder)', role: 'Impact director', isPrimary: false },
  ],
  stageHistory: [
    step(undefined, 'sourcing', '2026-06-01'),
    step('sourcing', 'screening', '2026-06-08'),
    step('screening', 'discovery', '2026-06-15'),
    step('discovery', 'dd', '2026-07-06'),
    step('dd', 'decision', '2026-08-24'),
    step('decision', 'closing', '2026-09-07'),
    step('closing', 'monitoring', '2026-09-28'),
    step('monitoring', 'exit', '2026-10-26'),
  ],
  stageOutputs: {
    sourcing: { why: 'Proven, profitable chain with an unusually strong record of jobs for women; a reference case for the Experience Economy vertical.' },
    discovery: {
      note: 'Placeholder: two calls with the CEO (example). Strong site-level economics, steady growth in secondary cities, interest in entering new countries with a local partner. Open: site-level margins and capital needed per country.',
      instrument: 'Revenue-share',
      ddDepth: 'Standard',
      goNoGo: 'Go to DD',
    },
    dd: {
      evidence: 'Placeholder: audited accounts 2023–2025, ownership and licences, B Corp assessment, unit economics for 10 sites, staff interviews, references from two suppliers.',
      siteVisit: 'Placeholder: Bogotá, 3 sites, Jul 2026',
      memo: 'Placeholder: US$2M revenue-share facility to fund 4 new sites in one new country. Strengths: proven format, jobs for women. Risks: currency, site selection, key-person.',
      termSheet: 'Placeholder: US$2M, 5% of new-site revenue until 1.6x repaid, 6-year cap, quarterly jobs reporting.',
    },
    decision: {
      decision: 'Approve with conditions',
      rationale: 'Placeholder: strong jobs case and proven economics; condition on a site-selection plan agreed with the local Lab Lead.',
      terms: 'Placeholder: as the term sheet, with funds released in two tranches tied to site openings.',
    },
    closing: {
      signed: '2026-09-05',
      conditions: 'Placeholder: KYC/AML complete; site-selection plan approved.',
      jobsBaseline: 'Placeholder: 0 jobs in the new country; 8,000+ group-wide',
      disbursed: 'Placeholder: US$1M first tranche; US$1M on the third site opening',
    },
    monitoring: {
      report: 'Placeholder: Q3 2026: 2 sites open, 85 jobs created (80% women), revenue share paid on time.',
      covenants: 'On track',
      watchList: 'No',
    },
    exit: {
      route: 'Repaid',
      report: 'Placeholder: facility repaid at 1.6x; 4 sites and about 170 jobs created in the new country.',
      lessons: 'Placeholder: early Lab Lead involvement in site selection paid off; jobs reporting should start at signing.',
    },
  },
})
