// Pathway configuration: the stages, screening tests and discovery questions for each path a venture
// can follow. Wording comes from the Notion process docs (SIMA / Ventures - Stream): "Investment Due
// Diligence Process" and "Distribution Partnership Process". Change the wording here; the app reads it all.

export type Pathway = 'investment' | 'distribution' | 'undecided'
export const pathwayKeys = ['investment', 'distribution', 'undecided'] as const

export const verticals = ['Experience Economy', 'Nature & Food Systems', 'Blue Economy', 'Circular Economy', 'Built Environment', 'Creative Economy', 'Care Economy', 'Peace Economy'] as const
export type Vertical = (typeof verticals)[number]

// Output fields a stage must record. `required` fields gate moving on; `passes` lists the values of a
// select that allow moving on (e.g. a "No-go" blocks the next stage).
export type StageField = { key: string; label: string; kind: 'text' | 'textarea' | 'date' | 'select'; options?: readonly string[]; required?: boolean; passes?: readonly string[]; hint?: string }
export type Stage = { key: string; number: number; name: string; purpose: string; output: string; optional?: boolean; fields: StageField[] }
export type ScreeningTest = { key: string; label: string; question: string; derived?: 'verticals' }
export type DiscoveryQuestion = { key: string; area: string; question: string }

const sourcing: Stage = {
  key: 'sourcing', number: 0, name: 'Sourcing', purpose: 'Build a pipeline through Lab Leads, referrals (investor portfolios, prizes, partners) and targeted outreach.', output: 'Long-list entry in the deal tracker',
  fields: [{ key: 'why', label: 'Why it is on the long-list', kind: 'textarea', required: true }],
}
const screening = (number: number): Stage => ({
  key: 'screening', number, name: 'Screening', purpose: 'Quick desk check against the five screening tests.', output: 'Screening card: proceed / hold / decline', fields: [],
})

const investmentStages: Stage[] = [
  sourcing,
  screening(1),
  {
    key: 'discovery', number: 2, name: 'Founder discovery', purpose: 'Understand the business, unit economics, jobs and capital need.', output: 'Discovery note with proposed pathway and DD depth; go / no-go to DD',
    fields: [
      { key: 'note', label: 'Discovery note', kind: 'textarea', required: true },
      { key: 'instrument', label: 'Instrument hypothesis', kind: 'select', options: ['Debt', 'Equity', 'Convertible', 'Revenue-share', 'Grant', 'Blended', 'Not yet known'] },
      { key: 'ddDepth', label: 'Proposed DD depth', kind: 'select', options: ['Light', 'Standard', 'Full'], required: true },
      { key: 'goNoGo', label: 'Go / no-go to DD', kind: 'select', options: ['Go to DD', 'Relationship development first', 'No-go'], required: true, passes: ['Go to DD', 'Relationship development first'] },
    ],
  },
  {
    key: 'relationship', number: 3, name: 'Relationship development', optional: true, purpose: 'Build evidence where it is too early for DD.', output: 'Agreed milestones and a review date',
    fields: [
      { key: 'milestones', label: 'Agreed milestones', kind: 'textarea', required: true },
      { key: 'reviewDate', label: 'Review date', kind: 'date', required: true },
    ],
  },
  {
    key: 'dd', number: 4, name: 'Due diligence & structuring', purpose: 'Verify the business; design the instrument and terms.', output: 'Evidence log, site visit, decision memo and indicative term sheet',
    fields: [
      { key: 'evidence', label: 'Evidence log', kind: 'textarea', required: true, hint: 'Legal, management, commercial, financial, operations, jobs, replication, financing, risks' },
      { key: 'siteVisit', label: 'Site visit', kind: 'text', hint: 'Date and who went' },
      { key: 'memo', label: 'Decision memo front sheet', kind: 'textarea', required: true, hint: 'Instrument, ticket, key terms, strengths and risks' },
      { key: 'termSheet', label: 'Indicative term sheet', kind: 'textarea', required: true },
    ],
  },
  {
    key: 'decision', number: 5, name: 'Investment decision', purpose: 'Approve, approve with conditions, or decline.', output: 'Recorded decision and approved terms',
    fields: [
      { key: 'decision', label: 'Decision', kind: 'select', options: ['Approve', 'Approve with conditions', 'Request more information', 'Decline'], required: true, passes: ['Approve', 'Approve with conditions'] },
      { key: 'rationale', label: 'Rationale', kind: 'textarea', required: true },
      { key: 'terms', label: 'Approved terms and conditions', kind: 'textarea' },
    ],
  },
  {
    key: 'closing', number: 6, name: 'Closing & disbursement', purpose: 'Sign agreements, satisfy conditions precedent, release funds.', output: 'Signed agreement, jobs baseline and funds disbursed',
    fields: [
      { key: 'signed', label: 'Agreement signed on', kind: 'date', required: true },
      { key: 'conditions', label: 'Conditions precedent (KYC/AML and others)', kind: 'textarea' },
      { key: 'jobsBaseline', label: 'Jobs baseline', kind: 'text', required: true },
      { key: 'disbursed', label: 'Funds disbursed', kind: 'text', required: true, hint: 'Amount, upfront or tranches' },
    ],
  },
  {
    key: 'monitoring', number: 7, name: 'Monitoring & support', purpose: 'Track performance, covenants and jobs; add value.', output: 'Quarterly reports, covenant checks, watch list',
    fields: [
      { key: 'report', label: 'Latest quarterly report', kind: 'textarea', required: true },
      { key: 'covenants', label: 'Covenants', kind: 'select', options: ['On track', 'Breach', 'Waived'] },
      { key: 'watchList', label: 'On the watch list', kind: 'select', options: ['No', 'Yes'] },
    ],
  },
  {
    key: 'exit', number: 8, name: 'Exit & evaluation', purpose: 'Repay, exit or complete; evaluate outcomes.', output: 'Closing report on financial and jobs results; lessons learned',
    fields: [
      { key: 'route', label: 'Exit route', kind: 'select', options: ['Repaid', 'Refinanced', 'Equity exit', 'Other completion'] },
      { key: 'report', label: 'Closing report (financial and jobs results)', kind: 'textarea', required: true },
      { key: 'lessons', label: 'Lessons learned', kind: 'textarea' },
    ],
  },
]

const distributionStages: Stage[] = [
  screening(1),
  {
    key: 'discovery', number: 2, name: 'Partner discovery', purpose: 'What does the company need to expand, and what would it pay Si Labs to deliver?', output: 'Opportunity summary',
    fields: [
      { key: 'note', label: 'Opportunity summary', kind: 'textarea', required: true, hint: 'The business, expansion opportunity, potential Si Labs role and commercial model' },
      { key: 'outstanding', label: 'Outstanding information', kind: 'textarea' },
    ],
  },
  {
    key: 'feasibility', number: 3, name: 'Distribution feasibility', purpose: 'Can our Lab Leads deliver in the target markets, at what cost, and with what potential returns?', output: 'Feasibility and economics',
    fields: [
      { key: 'markets', label: 'Target markets and Lab Leads', kind: 'text', required: true },
      { key: 'model', label: 'Commercial model', kind: 'select', options: ['A. Lower risk', 'B. Balanced', 'C. Higher upside'], required: true },
      { key: 'assessment', label: 'Feasibility and indicative economics', kind: 'textarea', required: true },
      { key: 'recommendation', label: 'Recommendation', kind: 'select', options: ['Proceed', 'Revise', 'Decline'], required: true, passes: ['Proceed'] },
    ],
  },
  {
    key: 'agreement', number: 4, name: 'Commercial agreement', purpose: 'Agree responsibilities, fees, revenue share, territories and performance expectations.', output: 'Signed pilot agreement',
    fields: [
      { key: 'signed', label: 'Pilot agreement signed on', kind: 'date', required: true },
      { key: 'terms', label: 'Key terms', kind: 'textarea', required: true, hint: 'Scope, responsibilities, fees, revenue share, territory, duration' },
      { key: 'kpis', label: 'Pilot KPIs', kind: 'textarea', required: true },
    ],
  },
  {
    key: 'pilot', number: 5, name: 'Pilot', purpose: 'Test the distribution partnership in one market.', output: 'Results against agreed KPIs',
    fields: [
      { key: 'market', label: 'Pilot market', kind: 'text', required: true },
      { key: 'results', label: 'Results against KPIs', kind: 'textarea', required: true, hint: 'Activity, conversion, revenue, margin, jobs, partner satisfaction' },
    ],
  },
  {
    key: 'scale', number: 6, name: 'Scale or exit', purpose: 'Expand, renegotiate or discontinue based on commercial and jobs outcomes.', output: 'Decision',
    fields: [
      { key: 'decision', label: 'Decision', kind: 'select', options: ['Scale', 'Revise', 'Exit'], required: true },
      { key: 'rationale', label: 'Rationale', kind: 'textarea', required: true },
    ],
  },
]

const investmentTests: ScreeningTest[] = [
  { key: 'legalLegitimate', label: 'Legal & legitimate', question: 'Is this a legally registered, operating business with a credible revenue model?' },
  { key: 'commercialTraction', label: 'Commercial traction', question: 'Are there customers, a revenue model and evidence it works locally?' },
  { key: 'meaningfulJobs', label: 'Meaningful jobs', question: 'Does it support jobs/livelihoods, with credible prospects for decent work and improved incomes?' },
  { key: 'replicability', label: 'Replicability', question: 'Is there a recognisable model that could work elsewhere?' },
  { key: 'verticalFit', label: 'Vertical fit', question: `Is it within one of our 8 verticals? ${verticals.join(' · ')}`, derived: 'verticals' },
]

const distributionTests: ScreeningTest[] = [
  { key: 'commercialViability', label: 'Commercial viability', question: 'Is this an established business with paying customers, a credible revenue model and evidence of profitability or a viable path to profitability?' },
  { key: 'decentJobs', label: 'Decent jobs', question: 'Does the business create meaningful employment or livelihoods, with acceptable working conditions and potential for improved incomes?' },
  { key: 'replicability', label: 'Replicability', question: 'Is there a recognisable product, service or operating model that can be delivered in other markets?' },
  { key: 'distributionFit', label: 'Distribution fit', question: 'Is there a clear market-entry need that Si Labs and its Lab Leads could realistically address?' },
  { key: 'commercialPotential', label: 'Commercial potential', question: 'Is there sufficient economic value in expansion to compensate the business, Si Labs and Lab Leads?' },
]

const investmentQuestions: DiscoveryQuestion[] = [
  { key: 'inv.business', area: 'Business and customers', question: 'What does the business sell, and who are its customers?' },
  { key: 'inv.economics', area: 'Revenue and unit economics', question: 'What are revenues, margins and the economics of a single site or unit?' },
  { key: 'inv.jobs', area: 'Jobs', question: 'How many jobs does each site or unit support, and on what terms?' },
  { key: 'inv.growth', area: 'Growth and replication', question: 'What are the growth and replication ambitions, and what has held them back?' },
  { key: 'inv.funding', area: 'Funding need', question: 'How much capital is needed, and what is the use of proceeds?' },
  { key: 'inv.investors', area: 'Investor interest', question: 'Which investors are already involved or interested?' },
  { key: 'inv.ask', area: 'What the founder wants', question: 'What does the founder want from Si Labs beyond capital?' },
  { key: 'inv.instrument', area: 'Financing instrument', question: 'What instrument might fit (debt, equity, convertible, revenue-share, grant or blended), without assuming funding is available?' },
]

const distributionQuestions: DiscoveryQuestion[] = [
  { key: 'businessModel', area: 'Business model', question: 'What does the business sell, who are its customers and how does it generate revenue?' },
  { key: 'traction', area: 'Commercial traction', question: 'What evidence demonstrates that the business model works commercially?' },
  { key: 'expansion', area: 'Expansion', question: 'Which markets are you targeting, and what has prevented or slowed expansion so far?' },
  { key: 'distributionNeed', area: 'Distribution need', question: 'What specifically would you need a local distribution partner to deliver?' },
  { key: 'replication', area: 'Replication', question: 'What would be required to establish the business in a new market, including capital, people, systems and training?' },
  { key: 'responsibilities', area: 'Partner responsibilities', question: 'What would your company provide centrally, and what would you expect Si Labs or a local operator to deliver?' },
  { key: 'commercialStructure', area: 'Commercial structure', question: 'How does your company earn revenue from expansion, and what commercial arrangements would you consider with a distribution partner?' },
  { key: 'jobs', area: 'Jobs', question: 'How many jobs does a typical operating unit support, and what employment conditions can be demonstrated?' },
  { key: 'success', area: 'Success criteria', question: 'What would a successful initial partnership look like over the first 6–12 months?' },
]

// Undecided ventures sit in sourcing or screening until someone picks a path; they are screened on
// both sets of tests (replicability is shared, so it appears once).
const union = <T extends { key: string }>(a: T[], b: T[]) => [...a, ...b.filter((item) => !a.some((x) => x.key === item.key))]

export const pathways: Record<Pathway, { label: string; stages: Stage[]; screeningTests: ScreeningTest[]; discoveryQuestions: DiscoveryQuestion[] }> = {
  investment: { label: 'Investment', stages: investmentStages, screeningTests: investmentTests, discoveryQuestions: investmentQuestions },
  distribution: { label: 'Distribution partnership', stages: distributionStages, screeningTests: distributionTests, discoveryQuestions: distributionQuestions },
  undecided: { label: 'Undecided', stages: [sourcing, screening(1)], screeningTests: union(investmentTests, distributionTests), discoveryQuestions: union(investmentQuestions, distributionQuestions) },
}

// The distribution tests and questions are what the research agent fills in (pathway-aware research comes later).
export { distributionTests, distributionQuestions }
