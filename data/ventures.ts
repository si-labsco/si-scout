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

// Stage 1 of the Si Labs Distribution Partnership framework: five screening tests.
export const screeningTests = [
  { key: 'commercialViability', label: 'Commercial viability', question: 'Is this an established business with paying customers, a credible revenue model and evidence of profitability or a viable path to profitability?' },
  { key: 'decentJobs', label: 'Decent jobs', question: 'Does the business create meaningful employment or livelihoods, with acceptable working conditions and potential for improved incomes?' },
  { key: 'replicability', label: 'Replicability', question: 'Is there a recognisable product, service or operating model that can be delivered in other markets?' },
  { key: 'distributionFit', label: 'Distribution fit', question: 'Is there a clear market-entry need that Si Labs and its Lab Leads could realistically address?' },
  { key: 'commercialPotential', label: 'Commercial potential', question: 'Is there sufficient economic value in expansion to compensate the business, Si Labs and Lab Leads?' },
] as const
export type ScreeningKey = (typeof screeningTests)[number]['key']

// Stage 2: the core discovery questions for the first partner meetings.
export const discoveryQuestions = [
  { key: 'businessModel', area: 'Business model', question: 'What does the business sell, who are its customers and how does it generate revenue?' },
  { key: 'traction', area: 'Commercial traction', question: 'What evidence demonstrates that the business model works commercially?' },
  { key: 'expansion', area: 'Expansion', question: 'Which markets are you targeting, and what has prevented or slowed expansion so far?' },
  { key: 'distributionNeed', area: 'Distribution need', question: 'What specifically would you need a local distribution partner to deliver?' },
  { key: 'replication', area: 'Replication', question: 'What would be required to establish the business in a new market, including capital, people, systems and training?' },
  { key: 'responsibilities', area: 'Partner responsibilities', question: 'What would your company provide centrally, and what would you expect Si Labs or a local operator to deliver?' },
  { key: 'commercialStructure', area: 'Commercial structure', question: 'How does your company earn revenue from expansion, and what commercial arrangements would you consider with a distribution partner?' },
  { key: 'jobs', area: 'Jobs', question: 'How many jobs does a typical operating unit support, and what employment conditions can be demonstrated?' },
  { key: 'success', area: 'Success criteria', question: 'What would a successful initial partnership look like over the first 6–12 months?' },
] as const
export type DiscoveryKey = (typeof discoveryQuestions)[number]['key']

export type Decision = 'proceed' | 'hold' | 'decline'

// Draft answer to a discovery question: 'public' if found in research, 'ask' if it needs the partner meeting.
export type DiscoveryAnswer = { key: DiscoveryKey; answer: string; source: 'public' | 'ask' }

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
  // new: in the catalogue; needs_review: screened, waiting on a human decision; proceed / hold / declined: the decision.
  status: 'new' | 'needs_review' | 'proceed' | 'hold' | 'declined'
  cityFit: number
  cityFitReason: string
  scores: Record<ScreeningKey, Score>
  // The research agent's recommended screening decision; the human decision is `status`.
  screening: { recommendation: Decision; rationale: string }
  discovery: DiscoveryAnswer[]
  sources: { title: string; url: string }[]
  // Free-form meeting and team notes. Edited by hand; research never overwrites them.
  notes?: string
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

type SeedVenture = Omit<Venture, 'cityId' | 'stage' | 'research'>

// Ventures shared in #ventures-for-si-labs, researched from web search results (Oct 2026).
// Figures come from third-party sources (the ventures' own sites could not be opened); each
// expansion history ends with what is unverified. Screening scores, recommendations and city fit
// are judgement calls. 0 means unknown for yearsRunning and jobsCreated.
const seed: SeedVenture[] = [
  {
    id: 'jo-academy', name: "Jo Academy", sector: "Education", hqCity: "Amman", hqCountry: "Jordan",
    oneLiner: "Arabic-language online learning platform for Grades 1–12, especially Tawjihi (Jordanian secondary exam) prep, plus university and skills courses.",
    businessModel: "Subscription-based online marketplace: students and families pay subscriptions for recorded and live courses delivered by contracted teachers. The company claims more than 35% of Jordan's Tawjihi student market. Revenue is not public; ZoomInfo's under-$5M estimate looks inconsistent with a reported ~$133M Series B valuation.",
    yearsRunning: 12, scale: "About 2.1M registered students across Jordan, Iraq, Palestine and Saudi Arabia (company-reported); claims 35%+ of Jordan's Tawjihi market; raised about $28M in total, with a Series B in Nov 2024 led by the Jordan Capital and Investment Fund.", jobsCreated: 478,
    whoTheyEmploy: "Teachers and content creators, video production, engineers and AI staff, sales and support. 478 staff in Oct 2024 (43% women); third-party estimates now run up to about 700.",
    expansionModel: 'owned',
    expansionHistory: "Founded in Amman in 2014. Foursan Group bought 49% in Dec 2021 and later made a follow-on investment. The company then entered Iraq, Palestine and Saudi Arabia (as ULA) and bought AI startup NoNerds for $140K. The JCIF-led Series B, about $28M, is aimed at the Saudi expansion and 100+ more jobs in Jordan. Unverified: student count and market share are company claims; LinkedIn gives 2013 as the founding year; the ~700 headcount (Caplight, Apr 2026) is a third-party estimate; revenue is not disclosed.",
    status: 'needs_review', cityFit: 15,
    cityFitReason: "Content is built around Arab national curricula and exams like Tawjihi. The only NYC audience is a niche of Arabic-speaking or heritage-learning families, in a crowded US K-12 edtech market.",
    scores: {
      commercialViability: { value: 7, reason: "Large paying subscriber base, dominant Tawjihi share and institutional PE backing, though revenue and profit are undisclosed." },
      decentJobs: { value: 6, reason: "About 480–700 salaried staff, 43% women, mostly teaching, content and tech roles; pay and conditions are not public." },
      replicability: { value: 5, reason: "The platform and teacher-marketplace model can be repeated, but each market needs new curriculum-specific content and teachers." },
      distributionFit: { value: 1, reason: "No New York entry need: its expansion targets Arab curricula markets, and the company runs that expansion itself." },
      commercialPotential: { value: 2, reason: "No realistic NYC revenue pool to share among the business, Si Labs and Lab Leads." },
    },
    screening: { recommendation: 'decline', rationale: "Strong and well-funded at home, but the product is locked to Arab national curricula and the company expands directly, so Lab Leads have no NYC distribution role." },
    discovery: [
      { key: 'businessModel', source: 'public', answer: "Students pay subscriptions to an online marketplace of teacher-led recorded and live courses, focused on Tawjihi prep." },
      { key: 'traction', source: 'public', answer: "About 2.1M registered students in four countries and a claimed 35%+ of Jordan's Tawjihi market; $28M Series B in Nov 2024." },
      { key: 'expansion', source: 'public', answer: "Owned expansion into Iraq, Palestine and Saudi Arabia (ULA brand), with new funding focused on Saudi Arabia." },
      { key: 'distributionNeed', source: 'ask', answer: "Do you have any plan to serve diaspora Arabic-speaking families in the US, e.g. Arabic-language or Arab-curriculum courses, and would a New York community channel matter to that?" },
      { key: 'replication', source: 'ask', answer: "How long and what does it cost to localise into a new curriculum market? Take Saudi Arabia: content production, teacher recruitment, licensing." },
      { key: 'responsibilities', source: 'ask', answer: "In Saudi Arabia, which roles were hired locally and which run from Amman (marketing, school partnerships, teacher recruitment)?" },
      { key: 'commercialStructure', source: 'ask', answer: "How are teachers paid (revenue share per subscriber vs salary), and would you pay a local partner a placement fee or a revenue share on new subscribers?" },
      { key: 'jobs', source: 'ask', answer: "What is current headcount (478 in Oct 2024; estimates near 700), and how is pay for contract teachers set compared with salaried staff?" },
      { key: 'success', source: 'ask', answer: "What subscriber or revenue level in a new market counts as success, and what were Saudi Arabia's first-year numbers?" },
    ],
    sources: [
      { title: "JCIF: Significant investment in Jo Academy", url: "https://www.jcif.jo/news/jordan-capital-and-investment-fund-announces-significant-investment-in-jo-academy/" },
      { title: "Caplight: JoAcademy", url: "https://www.caplight.com/company/joacademy" },
      { title: "WAYA: JoAcademy acquires NoNerds", url: "https://waya.media/jordans-joacademy-acquires-ai-edtech-startup-nonerds-in-usd-140k-deal/" },
      { title: "Foursan acquires 49% of Jo Academy", url: "https://www.4san.com/news/foursan-acquires-49-of-jo-academy" },
      { title: "CB Insights: Jo Academy", url: "https://www.cbinsights.com/company/jo-academy" },
    ],
    lastUpdated: '2026-10-23', isSample: false,
  },
  {
    id: 'kla-schools', name: "KLA Schools", sector: "Education", hqCity: "Miami", hqCountry: "United States",
    oneLiner: "Premium preschool franchise for ages 6 weeks to 5 years, with a Reggio Emilia-inspired, multilingual curriculum.",
    businessModel: "Each school earns tuition. The franchisor earns a $78,500 initial fee, a 6% royalty and about a 1.5% brand fund, and owns 6 schools itself. Item 19 average gross revenue is about $1.6M–$1.8M per school (2021–2022 FDDs). Total investment is about $1.1M–$6.0M per school.",
    yearsRunning: 18, scale: "26 schools per the Franchise Times Top 400 (2026). The company says 31 schools are open or in development, and one 2026 franchise guide lists 37. Schools are in Florida, Illinois, Texas, Washington, Michigan and other states; none in New York.", jobsCreated: 600,
    whoTheyEmploy: "Early-childhood teachers and assistants, school directors, cooks and admin staff, many of them bilingual; 15–30 staff per school plus about 13 at Miami headquarters.",
    expansionModel: 'franchise',
    expansionHistory: "Founded in Miami in Sept 2008 by Roberto and Candy Ortega, and franchising since July 2009. The system grew from 11 schools in FL, IL and WA in 2015 to about 26 open in 2026. Its 2025–26 targets include the West Coast and the East Coast from Massachusetts to Georgia. Unverified: unit counts conflict (26 vs 31 incl. pipeline vs 37); the 600 jobs figure is an estimate (about 26 schools × 15–30 staff, plus HQ); no NY franchise registration confirmed.",
    status: 'proceed', cityFit: 60,
    cityFitReason: "NYC has strong demand for premium bilingual early education, but very high real-estate costs and NYC DOHMH child-care licensing push units toward the top of the $1.1M–$6.0M range. New York is a franchise-registration state, and KLA's NY status is unconfirmed.",
    scores: {
      commercialViability: { value: 8, reason: "About 26 open schools averaging $1.6–1.8M gross revenue each, plus franchise fees and royalties." },
      decentJobs: { value: 6, reason: "15–30 early-childhood jobs per school; career paths into director roles, but pay is likely near-sector (low) and unconfirmed." },
      replicability: { value: 8, reason: "Mature 17-year franchise system with curriculum, training and Item 19 disclosure." },
      distributionFit: { value: 6, reason: "Actively recruiting East Coast franchisees and sites, which Lab Leads could source, but NY is not named as a priority." },
      commercialPotential: { value: 7, reason: "High-value placements ($78,500 fee, $1M+ investors) leave room for a placement fee or fee-share." },
    },
    screening: { recommendation: 'proceed', rationale: "Franchise-ready with high unit economics and an East Coast push; discovery must confirm NY franchise registration and appetite for a broker-style partner." },
    discovery: [
      { key: 'businessModel', source: 'public', answer: "Tuition-funded preschools; the franchisor earns a $78,500 initial fee, 6% royalty and ~1.5% brand fund; 6 schools are company-owned." },
      { key: 'traction', source: 'public', answer: "About 26 schools open (Franchise Times 2026); Item 19 average gross revenue about $1.6–1.8M per school; ranked in the Franchise Times Top 400." },
      { key: 'expansion', source: 'public', answer: "Franchise growth from Miami into IL, WA, TX, MI and others; 2025–26 targets are the West Coast and the East Coast from MA to GA." },
      { key: 'distributionNeed', source: 'ask', answer: "Is KLA registered to sell franchises in New York State, and would you consider NYC or nearby suburbs (Westchester, Long Island, NJ) if a partner sourced qualified multi-unit franchisees and sites?" },
      { key: 'replication', source: 'ask', answer: "For a dense urban market, what are minimum site specs (square footage, outdoor space), and has any KLA opened in a leased urban storefront rather than a freestanding building?" },
      { key: 'responsibilities', source: 'ask', answer: "Would a Lab Lead's role be franchisee lead generation and vetting, real-estate scouting, or local licensing support (NYC DOHMH Article 47), and what stays with KLA's development team?" },
      { key: 'commercialStructure', source: 'ask', answer: "Do you already pay franchise brokers (e.g. a share of the $78,500 fee), and at what rate? Would you pay a placement fee per signed franchise agreement?" },
      { key: 'jobs', source: 'ask', answer: "What are typical teacher and assistant pay rates and benefits at a KLA school, and how many staff does a 10,000+ sq ft school employ at full enrollment?" },
      { key: 'success', source: 'ask', answer: "What counts as a successful first year for a new school (enrollment %, time to break-even), and how many East Coast signings do you want by 2027?" },
    ],
    sources: [
      { title: "Franchise Times Top 400 2026: KLA Schools", url: "https://www.franchisetimes.com/top-400-2026/385-kla-schools/article_48aabb61-7d5b-4b09-9f5a-f5fab96db51d.html" },
      { title: "1851 Franchise: KLA Schools deep dive 2026", url: "https://1851franchise.com/franchise-deep-dive-kla-schools-franchise-costs-fees-profit-and-data-2724421" },
      { title: "Entrepreneur: KLA Schools franchise information", url: "https://www.entrepreneur.com/franchises/directory/kla-schools/333835" },
      { title: "KLA Schools Franchise: 31 locations and growing", url: "https://www.klaschoolsfranchise.com/blog/our-preschool-franchises-reach-31-locations-and-growing/" },
      { title: "Franzy: KLA Schools", url: "https://franzy.com/franchises/kla-schools" },
    ],
    lastUpdated: '2026-10-23', isSample: false,
  },
  {
    id: 'climateready', name: "ClimateReady", sector: "Climate and jobs", hqCity: "Unknown", hqCountry: "Unknown (the .si domain suggests Slovenia)",
    oneLiner: "Described internally as a city-level heat action plan that creates local jobs; no public record of the venture could be found.",
    businessModel: "Unknown",
    yearsRunning: 0, scale: "Unknown", jobsCreated: 0,
    whoTheyEmploy: "Unknown",
    expansionModel: 'partner',
    expansionHistory: "Searches for \"climateready.si\", \"ClimateReady Slovenia\", Slovenian-language terms and \"ClimateReady heat action plan jobs\" found no organisation behind the domain. The only Slovenian heat plan in results is Maribor's (adopted January 2025 under the EU Interreg Ready4Heat project), which is a municipal plan, not a venture. Other \"ClimateReady\" names (South Florida ClimateReady Tech Hub, AccuWeather ClimateReady, Boston's Climate Ready Workforce Action Plan) are unrelated. Unverified: everything; the site could not be loaded from the research environment, and the link to Ready4Heat/Maribor is only a guess.",
    status: 'new', cityFit: 40,
    cityFitReason: "NYC has a real heat-resilience need and existing heat-jobs programmes (NYC Cool Roofs trains jobseekers to install reflective roofs), but with no verified venture, fit cannot be scored above a placeholder.",
    scores: {
      commercialViability: { value: 0, reason: "No company, customers or revenue found in public sources." },
      decentJobs: { value: 0, reason: "Job creation is only claimed in the internal description; nothing verifiable." },
      replicability: { value: 0, reason: "Unknown; a heat action plan could be a repeatable consulting or programme model, but nothing is published." },
      distributionFit: { value: 0, reason: "Unknown; NYC already runs its own heat programmes, so any role would need a clear paying buyer." },
      commercialPotential: { value: 0, reason: "Unknown; no evidence of who pays (city, utility, employer)." },
    },
    screening: { recommendation: 'hold', rationale: "Cannot be screened: no public trace of the venture. Hold until the person who suggested it supplies the founders, a deck or a working website." },
    discovery: [
      { key: 'businessModel', source: 'ask', answer: "Who pays for the heat action plan: a city government under contract, EU or national grants, utilities, or employers? What does one city engagement cost?" },
      { key: 'traction', source: 'ask', answer: "Which cities (e.g. Maribor or other Slovenian municipalities) have adopted a ClimateReady plan, and what has been delivered and paid for so far?" },
      { key: 'expansion', source: 'ask', answer: "Has the plan been used outside the first city, and is ClimateReady connected to the Interreg Ready4Heat project or a similar EU programme?" },
      { key: 'distributionNeed', source: 'ask', answer: "What would a NYC entry look like given NYC already has its own heat programmes (Cool Neighborhoods, Cool Roofs) — who would be the NYC client?" },
      { key: 'replication', source: 'ask', answer: "Is there a written playbook (heat mapping, cooling centres, tree planting, outreach) that a local partner could run, and how long does a city rollout take?" },
      { key: 'responsibilities', source: 'ask', answer: "What would a NYC Lab Lead do: sell to agencies and community boards, recruit local workers, or run delivery?" },
      { key: 'commercialStructure', source: 'ask', answer: "Is ClimateReady a company, NGO or public project, and can it pay a market-entry fee or revenue share from city contracts?" },
      { key: 'jobs', source: 'ask', answer: "Which local jobs does the plan create (heat ambassadors, retrofit installers, tree crews), how many per city, for how long and at what pay?" },
      { key: 'success', source: 'ask', answer: "What measurable results (heat-related ER visits, jobs filled, residents reached) has it shown in its first city?" },
    ],
    sources: [
      { title: "EU Mission on Adaptation: Preparing Maribor, Slovenia, for hotter days", url: "https://mission-adaptation-portal.ec.europa.eu/stories-0/preparing-maribor-slovenia-hotter-days-through-heat-action-planning_en" },
      { title: "Interreg Central Europe: Ready4Heat", url: "https://www.interreg-central.eu/projects/ready4heat/" },
      { title: "City of Boston: Climate Ready Workforce Action Plan (unrelated namesake)", url: "https://www.boston.gov/news/city-boston-releases-climate-ready-workforce-action-plan" },
      { title: "EDA: South Florida ClimateReady Tech Hub (unrelated namesake)", url: "https://www.eda.gov/news/press-release/2024/07/02/South-Florida-ClimateReady-Tech-Hub" },
    ],
    lastUpdated: '2026-10-23', isSample: false,
  },
  {
    id: 'climate-week-network', name: "Climate Week Network", sector: "Climate and jobs", hqCity: "San Francisco", hqCountry: "United States",
    oneLiner: "Free global platform, led by Climatebase, where people find Climate Weeks and organisers launch new ones in their own city.",
    businessModel: "Free to use; philanthropically supported, led by Climatebase.org and fiscally sponsored by Grounded.org (a 501(c)(3)), so it takes tax-deductible donations. Each city week raises its own sponsors.",
    yearsRunning: 3, scale: "20+ announced 2026 city weeks (e.g. San Diego, Mexico City, Boston, Austin, Barcelona, Munich, Lagos, Medellín); SF Climate Week 2026 reported 60,000+ attendees, 650 events and 1,000+ speakers", jobsCreated: 0,
    whoTheyEmploy: "Staff not published; run by the Climatebase team plus local volunteer organisers and event hosts in each city.",
    expansionModel: 'partner',
    expansionHistory: "Grew out of SF Climate Week (started 2023), which Climatebase hosts with the City of San Francisco; the network launched with 20+ cities, starting with San Diego and Mexico City. Boston held its first Climate Week in May 2026, co-presented by ClimaTech and Climatebase. Unverified: staff numbers, named funders and grant amounts are not published; the 60,000 SF attendee figure is from the organiser's press release.",
    status: 'needs_review', cityFit: 25,
    cityFitReason: "NYC already has Climate Week NYC, run by Climate Group with a large sponsor base, so there is little gap for a second network-led week.",
    scores: {
      commercialViability: { value: 3, reason: "Free, donation-funded platform; city weeks live on sponsorships, with no network revenue disclosed." },
      decentJobs: { value: 2, reason: "Mostly volunteer and short-term event work; staff not published." },
      replicability: { value: 9, reason: "Open playbook already used by 20+ cities." },
      distributionFit: { value: 2, reason: "New York already has Climate Week NYC (Climate Group)." },
      commercialPotential: { value: 2, reason: "Nonprofit-style model with no revenue share for Si Labs or Lab Leads." },
    },
    screening: { recommendation: 'decline', rationale: "Highly replicable, but it is a philanthropic, free network and New York already has a large Climate Week." },
    discovery: [
      { key: 'businessModel', source: 'public', answer: "Free platform, philanthropically funded and fiscally sponsored by Grounded.org; city weeks fund themselves via sponsors." },
      { key: 'traction', source: 'public', answer: "20+ city weeks announced for 2026; SF Climate Week 2026 reported 60,000+ attendees and 650 events." },
      { key: 'expansion', source: 'public', answer: "Cities join by launching their own week with the network's tools; recent joiners include Boston (May 2026) and Austin." },
      { key: 'distributionNeed', source: 'ask', answer: "Would the network want a NYC presence that complements Climate Week NYC (e.g. a startup/jobs track), or does it avoid cities with an existing week?" },
      { key: 'replication', source: 'public', answer: "Toolkit, event platform and shared resources are provided free to local organisers." },
      { key: 'responsibilities', source: 'ask', answer: "Local organisers recruit hosts and sponsors; ask whether any city lead is paid by the network or only by local sponsors." },
      { key: 'commercialStructure', source: 'ask', answer: "Is there any paid tier, sponsor revenue share or grant budget that could pay a Lab Lead, or is all money raised locally?" },
      { key: 'jobs', source: 'ask', answer: "How many paid staff run the network and how many paid roles does a typical city week create?" },
      { key: 'success', source: 'ask', answer: "What does the network track per city (attendees, events, sponsor dollars, jobs fairs/hires)?" },
    ],
    sources: [
      { title: "Climatebase: Announcing the Climate Week Network", url: "https://stories.climatebase.org/p/announcing-the-climate-week-network" },
      { title: "Climate Week Network", url: "https://climateweeknetwork.org/" },
      { title: "PR Newswire: SF Climate Week 2026 kicks off with 60,000+ attendees", url: "https://www.prnewswire.com/news-releases/sf-climate-week-2026-kicks-off-april-18-with-more-than-60-000-attendees-650-events-and-over-1-000-speakers-including-al-gore-sf-mayor-daniel-lurie-and-alex-honnold-302746234.html" },
      { title: "Climatebase: Boston Climate Week announces ClimaTech as co-presenter", url: "https://stories.climatebase.org/p/boston-climate-week-announces-climatech-as-co-presenter-with-climatebase" },
      { title: "Climate Week NYC 2026", url: "https://www.climateweeknyc.org/" },
    ],
    lastUpdated: '2026-10-23', isSample: false,
  },
  {
    id: 'climatebase-fellowship', name: "Climatebase Fellowship", sector: "Climate and jobs", hqCity: "San Francisco", hqCountry: "United States",
    oneLiner: "Paid, mostly remote 12-week cohort programme that retrains professionals for climate careers.",
    businessModel: "Fellows pay $1,990 total ($1,790 programme fee plus $200 annual community membership); over half get need-based aid ($1M+ awarded across the first nine cohorts), now part-funded by sponsors such as Climatize. Climatebase also earns from employer job postings; total revenue is not disclosed.",
    yearsRunning: 5, scale: "10 cohorts (two a year; cohort 10 runs Sept-Dec 2026); 4,500+ alumni", jobsCreated: 0,
    whoTheyEmploy: "Small programme and community team (Crunchbase lists 11-50 staff for Climatebase overall); beneficiaries are mid-career professionals moving into climate work.",
    expansionModel: 'owned',
    expansionHistory: "Scaled through remote cohorts, from about 2,300 fellows in the first six cohorts to 4,500+ alumni by cohort 10, not through new locations. Its outcomes report says 1,110+ alumni from the first six cohorts work in climate roles, a 2x increase, at 250+ organisations. Unverified: revenue estimates conflict wildly ($2.4M from Datanyze vs $100M+ from LeadIQ/Growjo, the latter implausible); headcount estimates (19 to 571) are unreliable; disclosed funding is only about $150K plus an undisclosed 2022 seed; start year (about 2021) is inferred.",
    status: 'needs_review', cityFit: 45,
    cityFitReason: "New Yorkers can already join remotely; a NYC in-person chapter or employer-sponsored cohort is possible but not a clear market-entry gap.",
    scores: {
      commercialViability: { value: 6, reason: "Paying fellows at about $1,990 each across two cohorts a year, plus job-board revenue; profitability and total revenue unknown." },
      decentJobs: { value: 6, reason: "Outcomes report shows 1,110+ alumni in climate roles and a 2x rise in climate employment; programme is not a placement guarantee." },
      replicability: { value: 6, reason: "Cohort format repeats twice a year; value depends on the Climatebase brand and network." },
      distributionFit: { value: 4, reason: "Remote by design; a NYC employer or city-agency cohort partnership is the only clear local angle." },
      commercialPotential: { value: 3, reason: "Roughly $1,990 per fellow, with heavy aid, leaves little to share with Si Labs and Lab Leads." },
    },
    screening: { recommendation: 'hold', rationale: "Credible jobs outcomes, but it is a remote programme with thin per-fellow economics and no evident need for NYC distribution." },
    discovery: [
      { key: 'businessModel', source: 'public', answer: "$1,990 per fellow ($1,790 programme + $200 membership), need-based aid for over half, sponsor-funded scholarships; employers pay for job postings." },
      { key: 'traction', source: 'public', answer: "10 cohorts and 4,500+ alumni; 1,110+ alumni from the first six cohorts in climate roles." },
      { key: 'expansion', source: 'public', answer: "Grows by enlarging remote cohorts and adding scholarship sponsors (Climatize sponsored 10 places in cohort 10)." },
      { key: 'distributionNeed', source: 'ask', answer: "Would Climatebase pay for NYC employer or agency partners (e.g. NYC climate-workforce programmes) to sponsor dedicated cohorts or hire alumni?" },
      { key: 'replication', source: 'ask', answer: "Would they license or co-brand a local in-person cohort run by a NYC partner, and what content and staff would they supply?" },
      { key: 'responsibilities', source: 'ask', answer: "Would a Lab Lead sell sponsored scholarships to NYC employers, run in-person meetups, or place alumni into NYC jobs?" },
      { key: 'commercialStructure', source: 'ask', answer: "What share of fellowship revenue or sponsorship value could go to a partner who brings a paid NYC cohort?" },
      { key: 'jobs', source: 'ask', answer: "How many alumni are NYC-based, and what were their median salary changes after moving into climate roles?" },
      { key: 'success', source: 'ask', answer: "What is the fellowship's annual revenue and margin, and how many fellows pay full price vs aided?" },
    ],
    sources: [
      { title: "Climatebase Fellowship", url: "https://climatebase.org/fellowship" },
      { title: "Climatebase FAQ: Total cost of the fellowship", url: "https://faq.climatebase.org/fellowship/if-i-am-accepted-and-enroll-in-the-climatebase-fellowship-what-is-the-total-cost-of-the-program" },
      { title: "The Fellowship Effect: A Climatebase Outcomes Report", url: "https://job-outcomes.climatebase.org/" },
      { title: "Climatebase: Scholarship Fund with Climatize", url: "https://stories.climatebase.org/p/announcing-the-climatebase-scholarship-fund-with-climatize-as-our-first-partner" },
      { title: "Crunchbase: Climatebase", url: "https://www.crunchbase.com/organization/climatebase" },
    ],
    lastUpdated: '2026-10-23', isSample: false,
  },
  {
    id: 'plazrok', name: "Plazrok", sector: "Climate and jobs", hqCity: "Auckland", hqCountry: "New Zealand",
    oneLiner: "Turns unrecyclable mixed waste plastic into a lightweight aggregate that partly replaces stone in concrete.",
    businessModel: "Enviroplaz licenses the technology to master licensees per country, who build plants and earn plastic gate fees and aggregate/product sales (e.g. pavers with 88% post-consumer plastic in the aggregate, sold through Mitre 10 in NZ). Licence terms are not published.",
    yearsRunning: 11, scale: "2 known operating plants: Bombay, New Zealand (Environmental Aggregates and Concrete) and Victoria Falls, Zimbabwe (Ele-Collection licensee, launched Oct 2024, about 30 tonnes of plastic a month); US plant planned, not built", jobsCreated: 0,
    whoTheyEmploy: "Plant operators, waste collectors and sorters, logistics workers and concrete producers.",
    expansionModel: 'franchise',
    expansionHistory: "Developed and proven in New Zealand by Enviroplaz, with production at a Bombay site. Ele-Collection opened a licensed plant in Victoria Falls, Zimbabwe, in October 2024. Wenger Manufacturing holds the US master licence and, as Plazrok USA, is seeking investors to build the first US plant. Unverified: founding year, total plant count and headcount are not published; the Victoria Falls throughput comes from a single source; a FOXI Capital page pitches a $155M raise for Australian and overseas plants that is not confirmed.",
    status: 'proceed', cityFit: 60,
    cityFitReason: "NYC has plenty of waste plastic and concrete demand, but industrial siting, permits and NYC DOB/DOT concrete specs are hurdles; the natural first step is a regional US plant, not one in the city.",
    scores: {
      commercialViability: { value: 5, reason: "Two operating plants and retail product sales in NZ; no revenue or profit data." },
      decentJobs: { value: 6, reason: "Semi-skilled plant, collection and logistics jobs; numbers per plant unknown." },
      replicability: { value: 7, reason: "Master-licence model already replicated in Zimbabwe; needs local plastic supply and concrete buyers." },
      distributionFit: { value: 7, reason: "Plazrok USA is actively seeking investment partners and sites; Lab Leads could source sites, offtakers and municipal waste contracts in the NY region." },
      commercialPotential: { value: 6, reason: "Licence and offtake deals could carry a placement fee, but the US arm is pre-plant and capital-heavy." },
    },
    screening: { recommendation: 'proceed', rationale: "A licensable model with a US master licensee actively seeking partners; discovery should test plant economics and whether NY-region siting is realistic." },
    discovery: [
      { key: 'businessModel', source: 'ask', answer: "Master licensees build plants and earn gate fees and aggregate/product sales; ask the licence fee and royalty per tonne." },
      { key: 'traction', source: 'public', answer: "Plants operating in Bombay (NZ) and Victoria Falls (Zimbabwe, since Oct 2024, about 30 t plastic/month); Plazrok pavers sold via Mitre 10 NZ." },
      { key: 'expansion', source: 'public', answer: "Country master licences: Wenger Manufacturing holds the US licence and is raising money for a first US plant." },
      { key: 'distributionNeed', source: 'ask', answer: "Has Plazrok USA chosen a first-plant region, and would it consider the NY/NJ area if Lab Leads brought a site, a plastic supply contract and concrete buyers?" },
      { key: 'replication', source: 'ask', answer: "What does one plant cost (capex), what tonnage makes it break even, and how many months from licence to production?" },
      { key: 'responsibilities', source: 'ask', answer: "Would a Lab Lead source sites and investors, sign municipal or MRF plastic supply, or sell aggregate to NYC precast and paver makers?" },
      { key: 'commercialStructure', source: 'ask', answer: "Would Plazrok USA pay a placement fee per sub-licence or plant, or a revenue share on aggregate sales a partner originates?" },
      { key: 'jobs', source: 'ask', answer: "How many workers and what pay does the Victoria Falls or Bombay plant employ per shift?" },
      { key: 'success', source: 'ask', answer: "Does Plazrok aggregate have US approvals (ASTM tests) for non-structural concrete, which NYC buyers would require?" },
    ],
    sources: [
      { title: "CurbWaste: Plazrok USA", url: "https://www.curbwaste.com/company-profiles-network/plazrok-usa" },
      { title: "About Plazrok USA", url: "https://www.plazrokusa.com/about" },
      { title: "Breeze FM: Ele-Collection launches initiative to eliminate plastic waste in Victoria Falls", url: "https://breezefm.co.zw/ele-collection-launches-initiative-to-eliminate-plastic-waste-in-victoria-falls/" },
      { title: "Franklin Times: Q&A Peter Barrow", url: "https://franklintimes.co.nz/qa-peter-barrow/" },
      { title: "NZ Herald: Kiwi company turns plastic waste into concrete", url: "https://nzherald.co.nz/business/news/article.cfm?c_id=3&objectid=11802845" },
      { title: "Plazrok website", url: "https://plazrok.com/" },
    ],
    lastUpdated: '2026-10-23', isSample: false,
  },
  {
    id: 'inventwood', name: "InventWood", sector: "Climate and jobs", hqCity: "Frederick, Maryland", hqCountry: "United States",
    oneLiner: "Makes Superwood, chemically treated and compressed wood strong enough to replace steel in some building uses.",
    businessModel: "Makes and sells Superwood panels, starting with interior walls and ceilings and façade/cladding, with an exterior product (Superwood XP) to follow; sold through architectural-materials distributor Intectural.",
    yearsRunning: 10, scale: "1 plant in Frederick, MD, rated at 1M+ sq ft a year and described as fully allocated; $50M+ raised including a $15M Series A first close (April 2025)", jobsCreated: 33,
    whoTheyEmploy: "Process and R&D engineers, plant and production workers, product design and sales staff; open roles in 2026 include CTO, plant manager and product design lead.",
    expansionModel: 'owned',
    expansionHistory: "Spun out of the University of Maryland in 2016 and opened its first commercial plant in Frederick, with shipments planned for Q3 2025 via distributor Intectural; later coverage says commercial batches began shipping in 2025 and the company says production is underway and capacity is fully allocated. It was hiring about 12 roles in 2026, and no second plant has been announced. Unverified: headcount (33 per Tracxn, Aug 2026; 20-25 in other directories); shipment start is from secondary reporting, not a company release.",
    status: 'needs_review', cityFit: 40,
    cityFitReason: "NYC architects and developers are natural buyers of premium façade and interior panels, but a factory does not fit the city; the opening is specification sales, not replication.",
    scores: {
      commercialViability: { value: 6, reason: "$50M+ raised, production underway and capacity reported fully allocated; revenue not disclosed." },
      decentJobs: { value: 6, reason: "Skilled manufacturing and engineering jobs, about 33 staff and growing." },
      replicability: { value: 3, reason: "Proprietary process and heavy capital per plant; growth is by owned plants." },
      distributionFit: { value: 4, reason: "Already sells through Intectural; NYC architect and developer specification work is a possible but narrow role." },
      commercialPotential: { value: 4, reason: "High-value material, but any partner role is sales representation, not market entry." },
    },
    screening: { recommendation: 'hold', rationale: "Now shipping, but it has a distributor and is capacity-constrained; revisit if it seeks regional specification partners in the Northeast." },
    discovery: [
      { key: 'businessModel', source: 'public', answer: "Sells Superwood panels for interiors and façades through distributor Intectural." },
      { key: 'traction', source: 'ask', answer: "Production underway in Frederick; company says 1M+ sq ft annual capacity is fully allocated. Ask for named NYC projects and order backlog." },
      { key: 'expansion', source: 'ask', answer: "Single owned plant; ask when a second plant is planned and where." },
      { key: 'distributionNeed', source: 'ask', answer: "Does Intectural cover NYC architects and developers, or is there a gap for specification sales in the NYC market?" },
      { key: 'replication', source: 'public', answer: "Growth is by building owned plants with proprietary technology; no licensing announced." },
      { key: 'responsibilities', source: 'ask', answer: "Would a Lab Lead act as a spec rep to NYC architects, or help with NYC DOB façade approvals and fire ratings?" },
      { key: 'commercialStructure', source: 'ask', answer: "Would InventWood or Intectural pay commission on NYC orders a partner originates, given capacity is already allocated?" },
      { key: 'jobs', source: 'ask', answer: "How many plant jobs at full capacity, and what are starting wages and benefits for production workers?" },
      { key: 'success', source: 'ask', answer: "What is current revenue and when does the Frederick plant reach full output?" },
    ],
    sources: [
      { title: "Yahoo Finance: InventWood announces $15M first close of Series A", url: "https://finance.yahoo.com/news/inventwood-announces-15-million-first-130000011.html" },
      { title: "InventWood: Contact", url: "https://www.inventwood.com/contact" },
      { title: "Dezeen: Superwood is a chemically modified wood stronger than steel", url: "https://www.dezeen.com/2025/08/01/superwood-inventwood/" },
      { title: "Tracxn: InventWood 2026 company profile", url: "https://tracxn.com/d/companies/inventwood/__ZtmxIlYzbd8HJeA7zMeFk-yb9QidzxthruMQAULkZzM" },
      { title: "Indeed: InventWood careers", url: "https://www.indeed.com/cmp/Inventwood" },
    ],
    lastUpdated: '2026-10-23', isSample: false,
  },
  {
    id: 'tony-romas', name: "Tony Roma's", sector: "Food, farming and restaurants", hqCity: "Orlando", hqCountry: "United States",
    oneLiner: "Casual-dining barbecue rib chain founded in 1972, now mostly run by international franchisees, with a smaller fast-casual spin-off (Bones & Burgers).",
    businessModel: "Romacorp earns franchise fees and royalties from master and unit franchisees, plus sales from a few company-run US sites. The full-service franchise has a $35K fee, 4% royalty, 2% ad fund, $1.7M–$2.9M investment and $1M net worth requirement. Bones & Burgers has a $30K fee, 5% royalty and $350K–$500K build cost.",
    yearsRunning: 54, scale: "About 86 locations worldwide, 10 in the US (Franchise Times, Oct 2024). A later Restaurant Business report says about 95 worldwide and 7 in the US. Main markets: Spain, Mexico, Japan, Southeast Asia and the Middle East.", jobsCreated: 1445,
    whoTheyEmploy: "Casual-dining kitchen and front-of-house staff and managers. Romacorp has about 1,445 staff (Revelio Labs estimate, 2025), and franchisee staff abroad are not counted. No targeted-hiring mission found.",
    expansionModel: 'franchise',
    expansionHistory: "Grew from North Miami across the US and then abroad through master franchise agreements; US units fell from a peak of nearly 200 chain-wide to about 7–10. Equity Investors of New England bought Romacorp in July 2021, and CEO Mina Haque (2023) launched the fast-casual Bones & Burgers in Tampa (Dec 2022). She named New York City as a target for company stores and was exploring a Times Square site (Forbes, Aug 2024); no NYC opening has been found. Unverified: location counts conflict (60, 86 or 95 worldwide; 7 or 10 in the US). Fee and investment figures differ between the franchise site and third-party FDD summaries ($30K–$40K fee; up to $3.6M investment). Headcount is a data-provider estimate. A June 2026 sale of Spanish franchisee Avanza Food to Grupo Galería has not been confirmed.",
    status: 'needs_review', cityFit: 55,
    cityFitReason: "Management has named NYC as a target and a NYC franchise territory page exists, so the intent is there. But a full-service rib house faces very high NYC rents and the brand has faded in the US; the smaller Bones & Burgers format suits food halls, airports and campuses better.",
    scores: {
      commercialViability: { value: 6, reason: "54 years running with roughly 86–95 franchised units abroad. US average unit volume is about $1.5M, but there is no profitability disclosure and the US estate has shrunk sharply." },
      decentJobs: { value: 4, reason: "Standard casual-dining jobs (about 1,445 Romacorp staff) with no livelihood or targeted-hiring focus." },
      replicability: { value: 7, reason: "Mature franchise system with documented fees and two formats, including a cheaper fast-casual unit." },
      distributionFit: { value: 7, reason: "Wants NYC (company stores and a Times Square flagship) and markets a NYC franchise territory. Lab Leads could source sites and multi-unit operators." },
      commercialPotential: { value: 6, reason: "Placement fees on $1.7M–$2.9M full-service or $350K–$500K Bones & Burgers units are plausible, but demand for the brand in NYC is unproven." },
    },
    screening: { recommendation: 'proceed', rationale: "It is a weak decent-jobs match, but it is a franchise system that has publicly named New York as a target. That gives it a concrete, fee-bearing distribution need, so it is worth a discovery call to test appetite and unit economics." },
    discovery: [
      { key: 'businessModel', source: 'public', answer: "Franchise fees and royalties from international masters and US franchisees, plus a few company-run US sites. Published terms: $35K fee, 4% royalty, 2% ad fund." },
      { key: 'traction', source: 'ask', answer: "Ask for current systemwide sales, US average unit volumes and four-wall margins for full-service versus Bones & Burgers, and how many units opened and closed in 2025–26." },
      { key: 'expansion', source: 'ask', answer: "Ask whether the NYC plan (Times Square flagship, company stores) is still live, and whether it is funded or depends on finding a franchisee or area developer." },
      { key: 'distributionNeed', source: 'ask', answer: "Ask which NYC role they would pay a Lab Lead for: site sourcing in food halls, airports or campuses; recruiting a multi-unit franchisee; or running a company-owned pilot." },
      { key: 'replication', source: 'public', answer: "Two formats: full-service ($1.7M–$2.9M investment) and fast-casual Bones & Burgers ($350K–$500K). Franchisees sign a development agreement for 3–5 units." },
      { key: 'responsibilities', source: 'ask', answer: "Ask what training, supply chain (ribs, sauce) and opening support Romacorp provides in the US today, given its small domestic team." },
      { key: 'commercialStructure', source: 'ask', answer: "Ask whether they would pay a placement fee per signed unit, share part of the franchise or development fee, or pay a share of royalties to a NYC Lab Lead." },
      { key: 'jobs', source: 'ask', answer: "Ask about staffing per unit (full-service versus Bones & Burgers), starting wages and benefits, and whether they would commit to local hiring targets in NYC." },
      { key: 'success', source: 'ask', answer: "Ask for the 24-month target for NYC, for example a number of units signed or opened and a minimum unit volume." },
    ],
    sources: [
      { title: "Franchise Times: With brand revamp, Tony Roma's renews global growth push", url: "https://www.franchisetimes.com/international_franchising/with-brand-revamp-tony-roma-s-renews-global-growth-push/article_debb7312-8fdc-11ef-bf90-ef4c74425c05.html" },
      { title: "Forbes: How Tony Roma's is trying to make a comeback in the U.S.", url: "https://www.forbes.com/sites/garystern/2024/08/22/tony-romas-trying-to-make-a-comeback-in-the-us/" },
      { title: "Restaurant Dive: Tony Roma's future will be embedded with AI, robotics", url: "https://www.restaurantdive.com/news/tony-romas-ceo-mohaimina-haque-artificial-intelligence-future/741832/" },
      { title: "Restaurant Business: Tony Roma's gets ready for its fast casual debut", url: "https://www.restaurantbusinessonline.com/emerging-brands/tony-romas-gets-ready-its-fast-casual-debut" },
      { title: "Tony Roma's Rib and Steak Franchise", url: "https://www.tonyromasfranchise.com/" },
      { title: "WeFranch: Tony Roma's franchise", url: "https://wefranch.com/franchise/0rwr/tony-romas" },
    ],
    lastUpdated: '2026-10-23', isSample: false,
  },
  {
    id: 'area-2-farms', name: "Area 2 Farms", sector: "Food, farming and restaurants", hqCity: "Arlington, Virginia", hqCountry: "United States",
    oneLiner: "Public benefit corporation running small certified-organic indoor vertical farms that sell their harvest locally, now franchising.",
    businessModel: "Company farms sell weekly CSA baskets, farm-stand produce and restaurant/wholesale greens; since March 2026 it sells franchises (total initial investment about $308K–$471K). Raised about $9M from Seven Seven Six, Slow Ventures, 468 Capital and Animo. Revenue and profitability not disclosed.",
    yearsRunning: 4, scale: "1 operating company farm (Arlington, VA, first harvest spring 2022); Fairfax, VA and Peachtree City, GA listed as opening soon; plans for 10 new farms in 2026. No signed franchise units reported.", jobsCreated: 6,
    whoTheyEmploy: "Farm crew (6–9 employees at the Arlington farm in 2022); the \"Be a Farmer\" programme recruits career-changers to become franchise owner-operators.",
    expansionModel: 'franchise',
    expansionHistory: "Opened its first indoor farm in Arlington's Green Valley in 2022 after raising venture funding. Launched a franchise system on 10 March 2026 targeting South Florida, Atlanta, Charlotte, Columbus, Nashville and Austin, with Fairfax and Peachtree City sites listed as coming soon. Unverified: founding year (2020 incorporation vs 2022 launch; 2023 not supported); current headcount (jobs figure is the 2022 low end); number of franchise units sold (none publicly reported).",
    status: 'proceed', cityFit: 75,
    cityFitReason: "Compact indoor farms suit vacant NYC commercial space and NYC has strong CSA and restaurant demand for local greens, but rent, energy and labour costs will strain a $308K–$471K unit; the brand has not yet targeted the Northeast.",
    scores: {
      commercialViability: { value: 6, reason: "Paying CSA, farm-stand and restaurant customers and $9M venture backing, but revenue and unit profitability are undisclosed and only one farm is clearly open." },
      decentJobs: { value: 6, reason: "About 6–9 farm jobs per site plus an owner-operator; wages and conditions not public." },
      replicability: { value: 8, reason: "Standardised small indoor unit packaged as a franchise with a playbook and operator training." },
      distributionFit: { value: 8, reason: "Actively recruiting franchisees and sites; Lab Leads could source NYC operators, sites and restaurant buyers, though NYC is not on its current target list." },
      commercialPotential: { value: 7, reason: "Each unit is a $308K–$471K investment that can carry a placement fee or royalty share, but the franchise system is unproven." },
    },
    screening: { recommendation: 'proceed', rationale: "The clearest distribution fit in this group: a new franchise system seeking operators. Proceed, but test unit economics and whether any franchises have been sold before committing Lab Lead time." },
    discovery: [
      { key: 'businessModel', source: 'public', answer: "CSA subscriptions, farm stand and restaurant sales from company farms, plus franchise fees and royalties since March 2026." },
      { key: 'traction', source: 'ask', answer: "Ask for Arlington farm annual revenue, CSA subscriber count, gross margin and whether the unit is profitable after rent and energy; the FDD Item 19 if one exists." },
      { key: 'expansion', source: 'public', answer: "Franchising launched March 2026; target markets are FL, GA, NC, OH, TN and Austin; Fairfax VA and Peachtree City GA listed as coming soon; plan of 10 farms in 2026." },
      { key: 'distributionNeed', source: 'ask', answer: "Ask how many franchise agreements are signed, why NYC is not on the target list, and whether they would grant a NYC area-development or referral agreement to a local partner." },
      { key: 'replication', source: 'ask', answer: "Ask how long a unit takes from lease to first harvest, what space spec (sq ft, power, ceiling height) is required, and whether NYC building and energy costs break the model." },
      { key: 'responsibilities', source: 'ask', answer: "Ask which tasks a Lab Lead would own (franchisee sourcing, site finding, restaurant/CSA buyer development) versus what the franchisor's development team does." },
      { key: 'commercialStructure', source: 'ask', answer: "Ask the franchise fee and royalty rates and whether they pay broker/referral fees per signed unit or a revenue share on territory royalties." },
      { key: 'jobs', source: 'ask', answer: "Ask current headcount per farm, starting hourly wage, benefits, and how many Be a Farmer trainees have become operators." },
      { key: 'success', source: 'ask', answer: "Ask what would make a NYC pilot a success for them: number of units signed in 12–24 months, revenue per unit, or a flagship site." },
    ],
    sources: [
      { title: "IFA: Area 2 Farms launches new franchise opportunity (Mar 2026)", url: "https://www.franchise.org/2026/03/area-2-farms-launches-new-franchise-opportunity-a-revolution-in-local-indoor-agriculture/" },
      { title: "Franchise Times: Indoor urban farm concept launches franchise model", url: "https://www.franchisetimes.com/franchise_news/backed-by-reddit-s-co-founder-indoor-urban-farm-concept-launches-franchise-model/article_ba367276-cfb0-4aef-8274-4e581755f6db.html" },
      { title: "Fast Company: This company wants to plant farms in empty office buildings", url: "https://www.fastcompany.com/91409395/this-company-is-turning-empty-offices-across-america-into-farms" },
      { title: "Arlington Magazine: Area 2 Farms makes a case for urban farming", url: "https://www.arlingtonmagazine.com/area2farms-indoor-hydroponic-csa-arlington-virginia/" },
      { title: "ARLnow: Area 2 Farms putting roots down in Green Valley (2022)", url: "https://www.arlnow.com/2022/04/15/area-2-farms-an-indoor-vertical-organic-farm-is-putting-roots-down-in-green-valley/" },
      { title: "Area 2 Farms: Farms", url: "https://www.area2farms.com/farms" },
    ],
    lastUpdated: '2026-10-23', isSample: false,
  },
  {
    id: 'crepes-and-waffles', name: "Crepes & Waffles", sector: "Food, farming and restaurants", hqCity: "Bogotá", hqCountry: "Colombia",
    oneLiner: "Family-owned Colombian crepe, waffle and ice-cream chain (B Corp) that mainly employs women, most of them heads of household.",
    businessModel: "Sales from company-run restaurants, ice-cream parlours and to-go kiosks. 2025 revenue was about COP 1.26 trillion (about US$300M), up 13.3%, with net profit of about COP 68.2bn (5.4% margin), per Supersociedades-based rankings. Does not franchise.",
    yearsRunning: 46, scale: "About 180 outlets: the company's locations page lists 118 restaurants, 54 ice-cream parlours and 8 to-go sites. About 150 of these are in Colombia, with the rest in Ecuador, Mexico, Chile, Panama and Spain. Revenue is about COP 1.26 trillion (2025).", jobsCreated: 9300,
    whoTheyEmploy: "About 9,300 staff in Colombia (management, July 2025), 82–91% of them women, mostly heads of household and often single mothers. Benefits include housing, education and childcare support.",
    expansionModel: 'owned',
    expansionHistory: "Founded in Bogotá in 1980 and grew slowly across Colombia, still opening new cities (Ibagué, Nov 2025). Abroad, all sites are company-run: Ecuador (8), Mexico (10), Chile (3), Panama (3–4) and Spain (3–4 in Madrid). It has no US presence; press mentions the US, Peru and Brazil only as possible future markets. Unverified: headcount varies by source (5,169, about 6,000, 7,500, 8,000+ or 9,300). Outlet totals vary (177, about 180, or 200+), and it is unclear whether the locations page covers Colombia only. A Miami 'Crepes and Waffles Bar' appears to be unrelated.",
    status: 'needs_review', cityFit: 65,
    cityFitReason: "Strong pull from NYC's large Colombian and Latin American communities (Queens, northern NJ) and a direct livelihood match. But it only runs its own sites, does not franchise, and NYC labour and rent costs would strain its benefit-heavy model.",
    scores: {
      commercialViability: { value: 9, reason: "About COP 1.26 trillion revenue and COP 68bn net profit in 2025 (5.4% margin), 13% growth, and 46 years of operation." },
      decentJobs: { value: 9, reason: "About 9,300 jobs, mostly for women heads of household, with housing, education and childcare benefits; certified B Corp." },
      replicability: { value: 6, reason: "Standardized menu and formats replicated across 6 countries; the people-first HR culture is harder to copy and is guarded closely." },
      distributionFit: { value: 4, reason: "Owns every site, does not franchise and has no announced US plan. A NYC entry would need a partner-led or joint-venture structure the company has never used." },
      commercialPotential: { value: 6, reason: "High-revenue units and a loyal diaspora, but a fee or revenue-share deal with an owned-only family company is unproven." },
    },
    screening: { recommendation: 'proceed', rationale: "The best decent-jobs match among the restaurants, and it is solidly profitable. Proceed to discovery to test whether the family owners would consider a US entry led by a partner or Lab Lead." },
    discovery: [
      { key: 'businessModel', source: 'public', answer: "Company-run restaurants, ice-cream parlours and to-go kiosks; about COP 1.26 trillion revenue and 5.4% net margin in 2025. No franchising." },
      { key: 'traction', source: 'ask', answer: "Ask for revenue per restaurant and parlour in Mexico and Spain, their highest-cost markets, and whether those units are profitable on their own." },
      { key: 'expansion', source: 'ask', answer: "Ask whether the US (often mentioned in press) is on the board's 3–5 year plan, and whether NYC or Miami would come first." },
      { key: 'distributionNeed', source: 'ask', answer: "Ask how they entered Spain and Mexico (local GM, scouting team, partners) and which parts they would hand to a NYC Lab Lead: site selection, permits, hiring partners, or community marketing in Queens." },
      { key: 'replication', source: 'ask', answer: "Ask whether an ice-cream parlour or to-go kiosk could serve as a lower-cost NYC pilot before a full restaurant." },
      { key: 'responsibilities', source: 'ask', answer: "Ask which roles must stay with the family or company (food, HR culture, hiring) and which a local partner could hold." },
      { key: 'commercialStructure', source: 'ask', answer: "Ask whether they would accept a market-entry fee plus a revenue share on NYC units, or a joint venture in which the Lab Lead operates under licence. They currently own everything." },
      { key: 'jobs', source: 'public', answer: "About 9,300 staff in Colombia, about 90% women and mostly heads of household. Ask how they would keep that hiring model and its benefits at NYC wage levels." },
      { key: 'success', source: 'ask', answer: "Ask what result in the first two years would justify a second NYC site, for example revenue per unit, payback period or staff retention." },
    ],
    sources: [
      { title: "Valora Analitik: Crepes & Waffles seeks to keep growing in Colombia", url: "https://www.valoraanalitik.com/crepes-waffles-busca-seguir-creciendo-en-colombia/" },
      { title: "Mall & Retail: Frisby widens lead over Crepes & Waffles in restaurant top 10", url: "https://www.mallyretail.com/index.php?id=&id_news=3491" },
      { title: "La República: Crepes & Waffles, already in six countries and two continents", url: "https://www.larepublica.co/empresas/crepes-waffles-el-fenomeno-nacional-que-ya-conquista-seis-paises-y-dos-continentes-3593704" },
      { title: "Forbes Colombia: How Crepes & Waffles built a culinary empire", url: "https://forbes.co/2024/11/08/editors-picks/crepes-waffles-beatriz-fernandez/" },
      { title: "B Lab: Crepes y Waffles Colombia", url: "https://www.bcorporation.net/en-us/find-a-b-corp/company/crepes-y-waffles-colombia/" },
      { title: "Crepes & Waffles: locations", url: "https://www.crepesywaffles.com/ubicaciones" },
    ],
    lastUpdated: '2026-10-23', isSample: false,
  },
  {
    id: 'leon', name: "Leon Restaurants", sector: "Food, farming and restaurants", hqCity: "London", hqCountry: "United Kingdom",
    oneLiner: "UK quick-service chain selling healthier Mediterranean-inspired 'naturally fast food', now back with co-founder John Vincent after a 2025–26 restructuring.",
    businessModel: "Sales from company-run restaurants, plus fees and royalties from franchise partners (travel hubs and the Netherlands), and cookbooks and grocery products. It lost about £10M a year under Asda/EG ownership. No public franchise fee schedule was found.",
    yearsRunning: 22, scale: "43 restaurants after the CVA (May 2026): 20 company-run and 23 franchised. It had about 70 sites before administration.", jobsCreated: 530,
    whoTheyEmploy: "Quick-service crew and restaurant managers. About 530 jobs at company sites were kept through the restructuring; franchise staff are not counted. No targeted-hiring mission found.",
    expansionModel: 'franchise',
    expansionHistory: "Founded in London in 2004 and grew through company sites and franchising, including an HMSHost deal for airports and stations and units in the Netherlands and Italy. It opened in Washington DC and Virginia from 2017 but closed all four US sites in early 2021. EG Group bought it in 2021 and it later moved under Asda. Vincent bought it back in Oct 2025; administration followed on 10 Dec 2025, 23 company sites closed, and a CVA backed by Vincent's £2.5M loan let it exit in May 2026. Vincent targets 100 sites in four years and has said the US could be among the first markets for a return. Unverified: one report says 42 company sites plus 23 franchises, and dates for exiting administration differ (May vs Sep 2026).",
    status: 'new', cityFit: 45,
    cityFitReason: "Healthy fast-casual suits Manhattan office and transit traffic, and Leon has openly floated a US return. But it already failed in DC, the category is saturated (Sweetgreen, Cava, Dig) and the brand is unknown in the US.",
    scores: {
      commercialViability: { value: 3, reason: "Just out of administration after years of losses (about £10M a year); stabilised at 43 sites with founder funding only." },
      decentJobs: { value: 5, reason: "About 530 kept company jobs, mainly entry-level quick-service roles, after heavy recent cuts." },
      replicability: { value: 7, reason: "Systemised format with existing franchise partners in travel hubs and abroad." },
      distributionFit: { value: 5, reason: "A US return and 100-site goal suggest a need for local partners, but its focus is on stabilising the UK, and the earlier US entry failed." },
      commercialPotential: { value: 4, reason: "Some franchise or partner value, but high counterparty risk and no published franchise terms." },
    },
    screening: { recommendation: 'hold', rationale: "Revisit in 2027 once Leon shows stable post-CVA trading. The founder's growth goal and talk of a US return make it a candidate later, not now." },
    discovery: [
      { key: 'businessModel', source: 'public', answer: "Company-run restaurants plus franchise partners (23 franchised of 43 sites), and grocery and cookbook licensing." },
      { key: 'traction', source: 'ask', answer: "Ask for like-for-like sales and site-level EBITDA for the 20 company sites since the CVA, and when the business expects to break even." },
      { key: 'expansion', source: 'ask', answer: "Ask how much of the 100-sites-in-four-years plan is franchised, whether the US is in that window, and why NYC rather than a return to DC." },
      { key: 'distributionNeed', source: 'ask', answer: "Ask what went wrong in DC in 2017–2021 (rent, awareness, operating partner) and which of those gaps a NYC Lab Lead should fill." },
      { key: 'replication', source: 'ask', answer: "Ask whether a small kiosk or transit format (like its HMSHost travel units) is the template for a NYC entry." },
      { key: 'responsibilities', source: 'ask', answer: "Ask what a US franchise or partner would get from Leon (supply chain, recipes, brand, training), given its reduced central team." },
      { key: 'commercialStructure', source: 'ask', answer: "Ask for the current franchise fee and royalty, and whether they would pay a market-entry fee or share royalties with a Lab Lead who brings a master franchisee." },
      { key: 'jobs', source: 'ask', answer: "Ask about wage levels against the London Living Wage, staff turnover, and what wage and benefit commitments would apply in NYC." },
      { key: 'success', source: 'ask', answer: "Ask what would trigger a US go decision, for example a group profitability threshold or a signed master franchisee." },
    ],
    sources: [
      { title: "The Caterer: Leon exits administration as creditors back CVA", url: "https://www.thecaterer.com/news/leon-exits-adm-as-creditors-vote-in-favour-of-cva" },
      { title: "Consultancy.uk: Quantuma secures the future of Leon with over 530 jobs saved", url: "https://www.consultancy.uk/news/44331/quantuma-secures-the-future-of-leon-restaurants-with-over-530-jobs-saved" },
      { title: "The Grocer: Leon owner to inject £2.5m as 23 closures confirmed", url: "https://www.thegrocer.co.uk/news/leon-owner-to-inject-25m-into-food-chain-as-23-restaurant-closures-confirmed/718591.article" },
      { title: "Restaurant Dive: British QSR Leon shutters US locations", url: "https://www.restaurantdive.com/news/british-qsr-leon-shutters-us-locations/596859/" },
      { title: "The Grocer: Leon exits administration as CVA approved", url: "https://www.thegrocer.co.uk/news/leon-exits-administration-as-cva-approved-by-100-of-voting-creditors/719441.article" },
      { title: "Wikipedia: Leon Restaurants", url: "https://en.wikipedia.org/wiki/Leon_Restaurants" },
    ],
    lastUpdated: '2026-10-23', isSample: false,
  },
  {
    id: 'restorative-farms', name: "Restorative Farms", sector: "Food, farming and restaurants", hqCity: "Dallas", hqCountry: "United States",
    oneLiner: "South Dallas nonprofit building an urban farm system that trains and employs local residents, many formerly incarcerated.",
    businessModel: "Mostly grants and donations (about 82% of revenue), plus CSA, farm-stand, seedling and produce sales. Total revenue about $577K for the fiscal year ending April 2025.",
    yearsRunning: 9, scale: "Several South Dallas sites: MLK seedling farm (2017), Hatcher Station training farm (2020), a vermiculture site at DART's Lawnview Station and a container greenhouse at Fair Park; 160,000+ seedlings distributed through 2024.", jobsCreated: 0,
    whoTheyEmploy: "South Dallas residents with barriers to work, including formerly incarcerated people, through the paid Future Urban Farmers vocational programme; graduates have gone on to manage sites. Trainee and graduate counts: Unknown.",
    expansionModel: 'partner',
    expansionHistory: "Co-founded in 2017 by SMU faculty and local partners with a seedling farm at the MLK Community Center, then opened the Hatcher Station training farm in 2020 and added sites with DART, SMU and Fair Park. No expansion outside Dallas. Unverified: trainee and graduate counts and staff headcount are not public; a 2021 report said the apprentice farm would create five jobs; a second aggregator shows $358K revenue for a different filing period.",
    status: 'needs_review', cityFit: 55,
    cityFitReason: "The re-entry workforce angle matches NYC needs, but NYC already has re-entry farm programmes (e.g. Green-Up, Rikers horticulture) and land is scarce; there is no product to distribute.",
    scores: {
      commercialViability: { value: 3, reason: "About $577K revenue, roughly 82% from contributions; produce and CSA sales are small." },
      decentJobs: { value: 7, reason: "Paid vocational training and jobs for formerly incarcerated South Dallas residents, but numbers are small and undisclosed." },
      replicability: { value: 5, reason: "Programme design is copyable but depends on local land partners and grant funding." },
      distributionFit: { value: 3, reason: "Would need a NYC nonprofit and land partner, not a commercial distribution partner." },
      commercialPotential: { value: 2, reason: "Too little earned revenue to pay the business, Si Labs and Lab Leads." },
    },
    screening: { recommendation: 'hold', rationale: "Strong social impact but grant-dependent with no earned-revenue model to distribute; revisit only if it develops a licensable training curriculum or product." },
    discovery: [
      { key: 'businessModel', source: 'public', answer: "Grant and donation funded (about 82% of FY2025 revenue) with CSA, seedling and produce sales." },
      { key: 'traction', source: 'ask', answer: "Ask for earned revenue by line (CSA, seedlings, wholesale) for the last two fiscal years and how many CSA members they serve." },
      { key: 'expansion', source: 'public', answer: "Grew from one seedling farm (2017) to several South Dallas sites with DART, SMU and Fair Park; no expansion outside Dallas." },
      { key: 'distributionNeed', source: 'ask', answer: "Ask whether they want to replicate Future Urban Farmers in other cities and whether they would license the curriculum to a NYC re-entry organisation." },
      { key: 'replication', source: 'ask', answer: "Ask what a new site costs to set up, how much land it needs, and which parts of the training (certification, curriculum) are documented and transferable." },
      { key: 'responsibilities', source: 'ask', answer: "Ask whether a NYC partner would run the programme itself, and what support (training, branding, grant writing) Restorative Farms would provide." },
      { key: 'commercialStructure', source: 'ask', answer: "Ask whether they could pay a licensing or placement fee from earned revenue, or whether any NYC deal would have to be grant-funded." },
      { key: 'jobs', source: 'ask', answer: "Ask how many people have completed Future Urban Farmers since 2020, current staff headcount, trainee pay rate, and job placement rates after graduation." },
      { key: 'success', source: 'ask', answer: "Ask what outcome they would count as success for a second city: trainees placed, acres farmed or earned revenue." },
    ],
    sources: [
      { title: "SMU: Cultivating prosperity in South Dallas through innovative urban farming", url: "https://www.smu.edu/news/latest/restorative-farms" },
      { title: "SMU: 2017 Restorative Farms opens in South Dallas", url: "https://blog.smu.edu/engagedallas/resource-library/history-of-south-dallas/2017-restorative-farms-opens-in-south-dallas/" },
      { title: "ProPublica Nonprofit Explorer: Restorative Farms", url: "https://projects.propublica.org/nonprofits/organizations/843267808" },
      { title: "Whole Foods Market Foundation: Restorative Farms", url: "https://www.wholefoodsmarketfoundation.org/impact/success-stories/restorative-farms" },
      { title: "Dallas News: New partnership creates South Dallas urban farm (2021)", url: "https://www.dallasnews.com/news/inspired/2021/10/21/from-vacant-lot-to-full-plate-new-partnership-creates-south-dallas-urban-farm/" },
      { title: "American Heart Association: Innovative farms make mark on urban food landscapes", url: "https://www.heart.org/en/around-the-aha/innovative-farms-make-mark-on-urban-food-landscapes" },
    ],
    lastUpdated: '2026-10-23', isSample: false,
  },
  {
    id: 'plant-it-forward', name: "Plant It Forward", sector: "Food, farming and restaurants", hqCity: "Houston", hqCountry: "United States",
    oneLiner: "Houston nonprofit that trains refugee and immigrant farmers to run their own small urban farm businesses and sells their produce through a food hub.",
    businessModel: "Farmers sell through the Plant It Forward Food Hub (wholesale to food banks and restaurants), a produce-box CSA and farmers markets; the nonprofit is funded by grants and donations. Aggregator data shows revenue of about $1.9M in FY2024. About $3M of produce sold over its history.",
    yearsRunning: 15, scale: "Network of about 70 new-American farmers (2026 job posting); 80+ farmers trained since 2011; historically 7–8 farm sites on 5–6 acres in southwest Houston.", jobsCreated: 0,
    whoTheyEmploy: "Refugee and immigrant farmers (from Congo, Liberia, Sudan, Myanmar and elsewhere) who run their farms as independent businesses, plus a small nonprofit staff.",
    expansionModel: 'cooperative',
    expansionHistory: "Started in 2011 with one site and grew to several plots in southwest Houston plus a food hub that aggregates produce from network farms. In 2025 lost USDA-funded food bank purchases that had taken up to 70% of its wholesale produce and began an overhaul toward a cooperative model; with Agrarian Trust it won a USDA grant to buy 50–100 acres for a co-op of at least 30 farmers. Unverified: current farmer count (13 on an old fact sheet vs about 70 in the wider network); revenue is from an aggregator, not the 990.",
    status: 'needs_review', cityFit: 55,
    cityFitReason: "NYC has large refugee and immigrant communities and strong demand for culturally specific produce, but farmable land is far scarcer than in Houston and the model is in restructuring.",
    scores: {
      commercialViability: { value: 4, reason: "Real produce sales (about $3M cumulative) but grant-dependent, and it lost its main wholesale buyer channel in 2025." },
      decentJobs: { value: 7, reason: "Refugee farmers build their own businesses; incomes are exposed to lost food-bank contracts." },
      replicability: { value: 6, reason: "Land, training and shared-sales model is simple, but needs cheap land and a buyer base." },
      distributionFit: { value: 4, reason: "Would need NYC land partners and refugee agencies rather than commercial distribution." },
      commercialPotential: { value: 3, reason: "Little surplus revenue to share with Si Labs or Lab Leads." },
    },
    screening: { recommendation: 'hold', rationale: "Strong livelihoods model but grant-funded and mid-restructuring after losing USDA-funded sales; it cannot pay for a distribution partnership now." },
    discovery: [
      { key: 'businessModel', source: 'public', answer: "Food hub aggregation and wholesale, produce boxes and market sales of farmer-grown produce, with grant and donation funding for the nonprofit." },
      { key: 'traction', source: 'ask', answer: "Ask for 2025 food-hub sales, the split between food-bank, restaurant and box customers after the USDA cuts, and average farmer income." },
      { key: 'expansion', source: 'public', answer: "Houston only; pursuing a 50–100 acre cooperative farm with Agrarian Trust under a USDA land grant." },
      { key: 'distributionNeed', source: 'ask', answer: "Ask whether they need new buyers (e.g. NYC-area distributors for shelf-stable or specialty crops) or whether they would license their farmer-training model to a NYC agency." },
      { key: 'replication', source: 'ask', answer: "Ask what land, training budget and buyer volume one new farmer cohort needs, and whether the co-op model is documented." },
      { key: 'responsibilities', source: 'ask', answer: "Ask which roles a NYC partner would have to fill: land acquisition, refugee recruitment, sales to buyers, or training delivery." },
      { key: 'commercialStructure', source: 'ask', answer: "Ask whether any earned revenue could fund a placement fee or revenue share, or whether a NYC version would be grant-funded." },
      { key: 'jobs', source: 'ask', answer: "Ask how many farmers are actively farming in 2026, median annual farm income, and how many have graduated to their own land." },
      { key: 'success', source: 'ask', answer: "Ask what metrics define success for the co-op transition: farmers retained, acres secured or hub revenue." },
    ],
    sources: [
      { title: "Marketplace: Small farmers in Houston struggle in wake of USDA cuts (Nov 2025)", url: "https://www.marketplace.org/story/2025/11/24/small-farmers-in-houston-struggle-in-wake-of-usda-cuts" },
      { title: "Houston Landing: A farming co-op for new American farmers is looking for land", url: "https://www.houstonlanding.org/a-farming-co-op-for-new-american-farmers-is-on-its-way-to-houston-all-they-need-is-the-land/" },
      { title: "Courthouse News: Houston group helps refugees find success in farming", url: "https://www.courthousenews.com/houston-group-helps-refugees-find-success-in-farming/" },
      { title: "Philanthropy.org: Plant It Forward Form 990 profile", url: "https://philanthropy.org/990/report/273967754/plant-it-forward/2020" },
      { title: "GuideStar: Plant It Forward", url: "https://www.guidestar.org/profile/27-3967754" },
      { title: "Plant It Forward website", url: "https://www.plantitforward.farm/" },
    ],
    lastUpdated: '2026-10-23', isSample: false,
  },
  {
    id: 'urban-harvest', name: "Urban Harvest", sector: "Food, farming and restaurants", hqCity: "Houston", hqCountry: "United States",
    oneLiner: "Houston nonprofit running a large community-garden network, gardening education, a mobile market and a major Saturday farmers market.",
    businessModel: "About 81% contributions and grants, about 16% programme revenue (farmers market vendor fees, classes). FY2024 revenue $2.31M, expenses $2.49M (deficit about $182K); net assets $2.18M.",
    yearsRunning: 32, scale: "200+ affiliated community gardens with 3,800+ volunteer gardeners; Saturday farmers market with 100+ vendors and about 3,000–3,500 shoppers a week; mobile market.", jobsCreated: 34,
    whoTheyEmploy: "Programme, garden-education, food-access and market staff (34 employees in 2023); indirectly supports 100+ vendor farms and food businesses.",
    expansionModel: 'partner',
    expansionHistory: "Founded in 1994 as a community-garden network and started the farmers market in 2004 with 7 vendors, growing it to 100+. Garden network and mobile market expanded across Greater Houston; nothing found outside Houston. Unverified: headcount is a 2023 aggregator figure; garden counts vary by source (150–200+).",
    status: 'new', cityFit: 25,
    cityFitReason: "NYC already has GrowNYC Greenmarkets and the GreenThumb network of 550+ gardens, so the model fills no gap.",
    scores: {
      commercialViability: { value: 4, reason: "Stable $2.3M budget but mostly donations, and a 2024 operating deficit." },
      decentJobs: { value: 5, reason: "34 staff; indirectly supports 100+ vendor businesses." },
      replicability: { value: 5, reason: "Well-understood models that rest on decades of local trust." },
      distributionFit: { value: 2, reason: "New York already has GrowNYC Greenmarkets and GreenThumb gardens." },
      commercialPotential: { value: 2, reason: "No expansion revenue to share." },
    },
    screening: { recommendation: 'decline', rationale: "No NYC market gap, no expansion model and a donation-funded budget." },
    discovery: [
      { key: 'businessModel', source: 'public', answer: "Donations and grants (about 81%) plus farmers market vendor fees and class revenue (about 16%)." },
      { key: 'traction', source: 'public', answer: "FY2024 revenue $2.31M, expenses $2.49M; 100+ market vendors; 200+ affiliated gardens." },
      { key: 'expansion', source: 'public', answer: "Houston-only; no evidence of plans to expand beyond Greater Houston." },
      { key: 'distributionNeed', source: 'ask', answer: "Ask whether any vendor brands from their market want NYC distribution, since Urban Harvest itself has no NYC need." },
      { key: 'replication', source: 'ask', answer: "Ask whether they have ever licensed their market-management or garden-affiliate model to another city." },
      { key: 'responsibilities', source: 'ask', answer: "Ask what role, if any, they would want in a NYC initiative (advisory only vs operating)." },
      { key: 'commercialStructure', source: 'ask', answer: "Ask whether they could pay any fee or revenue share; likely none given the 2024 deficit." },
      { key: 'jobs', source: 'ask', answer: "Ask current headcount, full-time vs part-time split and starting wages for market and garden staff." },
      { key: 'success', source: 'ask', answer: "Ask what they would want from an out-of-state partnership, if anything (e.g. vendor sales growth)." },
    ],
    sources: [
      { title: "ProPublica Nonprofit Explorer: Urban Harvest Inc", url: "https://projects.propublica.org/nonprofits/organizations/760501430" },
      { title: "CauseIQ: Urban Harvest", url: "https://causeiq.com/organizations/urban-harvest,760501430" },
      { title: "Urban Harvest: Corporate involvement deck (2026)", url: "https://www.urbanharvest.org/wp-content/uploads/2026/04/CoporateInvolvment.pdf" },
      { title: "Houstonia: Urban Harvest turns 25", url: "https://www.houstoniamag.com/articles/2019/10/28/bob-randall-urban-harvest-turns-25" },
      { title: "Urban Harvest: Saturday farmers market", url: "https://www.urbanharvest.org/farmers-market/saturday/" },
    ],
    lastUpdated: '2026-10-23', isSample: false,
  },
  {
    id: 'aesir', name: "Aesir", sector: "Tech", hqCity: "Hong Kong", hqCountry: "Hong Kong",
    oneLiner: "Hong Kong social enterprise building AR/VR and motion-sensing learning games for children with special educational needs (autism, ADHD, dyscalculia), now also used for elderly rehab.",
    businessModel: "Sells and licenses its own SEN products (e.g. 'Happy Kingdom' AR emotion-education game book and app) and does paid custom AR/VR projects for schools, NGOs, universities and corporates. A sister company, AESIR Institute, offers SEN training and inclusive STEAM education. Revenue is not public.",
    yearsRunning: 13, scale: "Hong Kong only (office in Kwun Tong). Press reports a catalogue of hundreds of games. Number of schools or users served is not published.", jobsCreated: 0,
    whoTheyEmploy: "Unknown. A small team of developers, designers and education or therapy consultants; an old directory listing gives 1–10 staff.",
    expansionModel: 'owned',
    expansionHistory: "Founded in 2013 by Zero Wong (黃潤華), with Ernest Chan as co-founder and now Managing Director. Supported by CityU HK Tech 300 Angel Fund (2021), with a bronze at the 2021 Hong Kong ICT Awards (IT Start-up, social contribution) and seed funding of about HK$300K. It has extended from SEN children to VR muscle-training games for older people, with no expansion outside Hong Kong. Unverified: headcount (1–10 from an old listing), revenue and user numbers are unknown; some sources give 2014 as the founding year.",
    status: 'new', cityFit: 20,
    cityFitReason: "NYC special education is a huge market, but selling into schools means DOE procurement and evidence requirements, so a Hong Kong studio would license content rather than build a local workforce through Lab Leads.",
    scores: {
      commercialViability: { value: 3, reason: "Small studio living on project work, grants and awards; no revenue or profit evidence." },
      decentJobs: { value: 2, reason: "A handful of skilled tech jobs; no meaningful job creation." },
      replicability: { value: 3, reason: "Products are portable as software, but the business is mostly bespoke studio projects with no repeatable unit model." },
      distributionFit: { value: 2, reason: "At most a content-licensing deal with NYC schools or therapy providers; little for Lab Leads to run." },
      commercialPotential: { value: 2, reason: "Licensing value too small to pay the business, Si Labs and Lab Leads." },
    },
    screening: { recommendation: 'decline', rationale: "Tiny, grant-supported studio with no scale or job-creation evidence; at most a software-licensing play, not a distribution partnership." },
    discovery: [
      { key: 'businessModel', source: 'public', answer: "Own SEN AR/VR products (e.g. Happy Kingdom) plus paid custom projects for schools, NGOs and corporates; a sister training centre (AESIR Institute)." },
      { key: 'traction', source: 'ask', answer: "Operating since 2013, with awards (HKICT 2021 bronze, HK Tech 300) and press coverage. How many Hong Kong schools or centres currently pay for your products, and what share of revenue is products vs custom projects?" },
      { key: 'expansion', source: 'public', answer: "No expansion outside Hong Kong found; product scope extended to the elderly." },
      { key: 'distributionNeed', source: 'ask', answer: "Are your games available in English, and do you have clinical or efficacy evidence a US school district or therapy provider would accept?" },
      { key: 'replication', source: 'ask', answer: "Could a NYC therapy centre run your products without your developers, or does each deployment need custom work?" },
      { key: 'responsibilities', source: 'ask', answer: "Would a local partner sell licences to schools and clinics, or deliver sessions directly using your games?" },
      { key: 'commercialStructure', source: 'ask', answer: "What do schools pay today (per licence, per student, per project), and would you accept a reseller margin or revenue share?" },
      { key: 'jobs', source: 'ask', answer: "How many full-time staff do you have, and what would a local delivery role (e.g. SEN game facilitator) pay in Hong Kong?" },
      { key: 'success', source: 'ask', answer: "What would a first overseas customer need to look like for you to commit resources to it?" },
    ],
    sources: [
      { title: "Ming Pao: AR game book social enterprise helps SEN children (2022)", url: "https://news.mingpao.com/pns/%E6%B8%AF%E8%81%9E/article/20220116/s00002/1642269585683/%E9%96%8B%E7%99%BCar%E4%BA%92%E5%8B%95%E9%81%8A%E6%88%B2%E6%9B%B8-%E6%9B%BE%E8%BC%9F%E5%AD%B8-%E9%AB%98%E6%9D%90%E7%94%9F-%E5%90%88%E8%BE%A6%E7%A4%BE%E4%BC%81%E5%8A%A9sen%E7%AB%A5" },
      { title: "CityU HK Tech 300: AESIR Institute", url: "https://www.cityu.edu.hk/zh-hk/hktech300/start-ups/angel-fund-start-ups/aesir" },
      { title: "Sing Tao: Social enterprise AR+VR games for SEN students and elderly (2025)", url: "https://www.stheadline.com/realtime-finance/3494366/%E7%A4%BE%E4%BC%81%E6%8E%A8ARVR%E9%81%8A%E6%88%B2%E5%8A%A9%E5%BC%B1%E5%8B%A2%E7%BE%A4%E9%AB%94-SEN%E5%AD%B8%E7%94%9F%E6%9B%B4%E5%B0%88%E6%B3%A8%E5%AD%B8%E7%BF%92-%E8%80%81%E4%BA%BA%E5%8F%AF%E8%A8%93%E7%B7%B4%E8%82%8C%E8%82%89" },
      { title: "18hall: AESIR startup directory", url: "https://18hall.com/aesir/" },
      { title: "HKCSS-HSBC Social Enterprise Directory: AESIR", url: "https://sedirectory.org.hk/en/sedb/ses/qjuK9tOrSjyjjpYDDq3e7w" },
    ],
    lastUpdated: '2026-10-23', isSample: false,
  },
  {
    id: 'ana', name: "ANA", sector: "Tech", hqCity: "Mexico City", hqCountry: "Mexico",
    oneLiner: "AI-driven platform that trains, certifies and coordinates home elder-care workers in Latin America, with scheduling, digital payments and AI patient monitoring, to move caregivers into formal, better-paid work.",
    businessModel: "Two-sided. Caregivers pay small subscriptions for certifiable training (about MXN 99/month for 250+ short videos; MXN 299/month professional tier with 320+ courses and certifications). Care agencies use the platform for scheduling, payments and monitoring (e.g. Salus agency testimonial), and the company also pitches data tools to governments. B2B pricing and revenue are not public.",
    yearsRunning: 4, scale: "8 Latin American countries and 15,000+ registered caregivers (company-reported); seed round led by Impact Ventures PSM with Impacta VC (amount undisclosed); IDB Lab-backed.", jobsCreated: 0,
    whoTheyEmploy: "Unknown own headcount (tech, training content and operations staff). The livelihood impact falls on low-wage, mostly informal, largely female home caregivers; the company claims over 50% of users raised their pay.",
    expansionModel: 'partner',
    expansionHistory: "Grew out of Paz Mental, a Mexico City caregiver project started in 2015. ANA Care itself launched after Manuel Rosemberg and Ariel Zylbersztejn won IDB Lab's silver-economy challenge in 2022. It has expanded to 8 LatAm countries through agencies and partners, raised a seed round from Impact Ventures PSM and Impacta VC, and Rosemberg was named Schwab Foundation Social Entrepreneur of the Year (Jan 2025, Davos). No US presence found. Unverified: founding year (2022 platform vs 2015 predecessor); headcount and revenue unknown; caregiver and wage-gain figures are company claims.",
    status: 'needs_review', cityFit: 55,
    cityFitReason: "NYC has one of the largest, heavily Spanish-speaking home-care workforces in the US, but it is a regulated Medicaid/LHCSA market with entrenched agency software and NY State-mandated training (HHA/PCA), so ANA's training would need state approval.",
    scores: {
      commercialViability: { value: 5, reason: "Paying caregiver subscriptions and agency users, plus impact-investor seed money; revenue and profitability not public." },
      decentJobs: { value: 8, reason: "Directly targets formalisation, certification and higher pay for 15,000+ informal caregivers; claims 50%+ wage gains." },
      replicability: { value: 7, reason: "Software plus Spanish-language training content ports easily; local regulation and certification must be adapted." },
      distributionFit: { value: 6, reason: "Would need NYC home-care agencies, worker organisations and training-provider partners that Lab Leads could broker." },
      commercialPotential: { value: 5, reason: "Agency SaaS and training subscriptions could support a revenue share, but US regulatory adaptation is costly." },
    },
    screening: { recommendation: 'proceed', rationale: "Strong livelihood impact and a partner-led, software-based model that suits Lab Leads; discovery must test US ambitions, revenue evidence and fit with NY home-care training rules." },
    discovery: [
      { key: 'businessModel', source: 'public', answer: "Caregiver training subscriptions (MXN 99 and MXN 299 per month) plus a platform for agencies (scheduling, payments, AI monitoring); government data offering." },
      { key: 'traction', source: 'public', answer: "8 LatAm countries and 15,000+ registered caregivers (company-reported); IDB Lab, Impact Ventures PSM and Impacta VC backing; Schwab 2025 award." },
      { key: 'expansion', source: 'public', answer: "Partner-led expansion across 8 Latin American countries through agencies and institutions; no US activity found." },
      { key: 'distributionNeed', source: 'ask', answer: "Have you considered the US Hispanic home-care workforce, and would NYC agencies (LHCSAs) or 1199SEIU-style worker funds be the entry partner you would want introduced?" },
      { key: 'replication', source: 'ask', answer: "Could your Spanish-language courses be mapped to New York's HHA/PCA training requirements, or would you position as supplementary upskilling on top of state certification?" },
      { key: 'responsibilities', source: 'ask', answer: "Would a local partner sign up agencies and caregivers, run in-person cohorts, or handle compliance, and what stays with your Mexico City team?" },
      { key: 'commercialStructure', source: 'ask', answer: "What do agencies pay you today (per caregiver, per seat, per transaction), what is your current ARR, and would you pay a revenue share on accounts a partner brings?" },
      { key: 'jobs', source: 'ask', answer: "How many staff do you employ, and can you share data behind the claim that over 50% of users raised their pay (baseline, method)?" },
      { key: 'success', source: 'ask', answer: "What would a successful US pilot look like for you: number of agencies, caregivers certified, wage uplift, within what timeframe?" },
    ],
    sources: [
      { title: "ImpactAlpha: Ana Care raises seed funding", url: "https://impactalpha.com/ana-care-raises-seed-funding-to-formalize-homecare-for-seniors-in-latin-america/" },
      { title: "Expansión: ANA Care profesionaliza el cuidado de adultos mayores", url: "https://esg.expansion.mx/social/2025/01/30/ana-care-cuidadores-para-personas-de-la-tercera-edad" },
      { title: "Fast Company México: ANA, innovación en la atención médica domiciliaria", url: "https://fastcompany.mx/2025/01/21/ana-innovacion-atencion-medica-domiciliaria/" },
      { title: "El Heraldo de México: Con Ana Care revolucionan la forma de cuidar (Apr 2026)", url: "https://heraldodemexico.com.mx/edicion-impresa/2026/4/13/con-ana-care-revolucionan-la-forma-de-cuidar-795033-amp.html" },
      { title: "WEF: Ariel Zylbersztejn", url: "https://www.weforum.org/people/ariel-zylbersztejn/" },
    ],
    lastUpdated: '2026-10-23', isSample: false,
  },
]

// Seed data for the first run. Ventures already under review start on the shortlist; the rest sit in the catalogue.
export const ventures: Venture[] = seed.map((venture) => ({
  ...venture,
  cityId: selectedCityId,
  stage: venture.status === 'new' ? 'catalogue' : 'shortlisted',
  research: { status: 'done', finishedAt: '2026-10-23T00:00:00.000Z' },
}))
