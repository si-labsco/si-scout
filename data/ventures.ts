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

type SeedVenture = Omit<Venture, 'cityId' | 'stage' | 'research'>

// Ventures shared in #ventures-for-si-labs, researched from web search results (Oct 2026).
// Figures come from third-party sources and were not checked against the ventures' own sites;
// scores and city fit are judgement calls. 0 means unknown for yearsRunning and jobsCreated.
const seed: SeedVenture[] = [
  {
    id: 'jo-academy', name: "Jo Academy", sector: "Education", hqCity: "Amman", hqCountry: "Jordan",
    oneLiner: "Arabic-language online learning platform for Grades 1–12 (including Tawjihi exam prep), university and international courses.",
    businessModel: "Paid access to recorded and live courses, mainly K-12 exam prep.",
    yearsRunning: 12, scale: "About 2.1M students across Jordan, Iraq, Palestine and Saudi Arabia", jobsCreated: 478,
    whoTheyEmploy: "Teachers and content creators, video production, engineers and AI staff, sales and support (478 staff in Oct 2024, 43% women).",
    expansionModel: 'owned',
    expansionHistory: "Grew from Jordan into Iraq, Palestine and Saudi Arabia (as ULA) after Foursan invested in 2021; acquired AI edtech startup NoNerds. Student count is press-reported, not audited.",
    status: 'needs_review', cityFit: 20,
    cityFitReason: "At most serves Arabic-speaking or heritage-learning families; content is tied to Arab curricula and US K-12 edtech is crowded.",
    scores: { lroi: { value: 5, reason: "Large regional employer, but a digital platform creates fewer jobs per dollar as it scales." }, replicability: { value: 4, reason: "Content is tied to Arab curricula and exams, so it does not transfer to US schools." }, franchiseReadiness: { value: 2, reason: "No franchise or licensing programme found." }, willingnessToExpand: { value: 6, reason: "Actively expanding and acquiring, but only within MENA." } },
    sources: [{ title: "CB Insights: Jo Academy", url: "https://www.cbinsights.com/company/jo-academy" }, { title: "Lucidity Insights: JoAcademy acquires NoNerds", url: "https://lucidityinsights.com/news/joacademy-acquires-nonerds" }, { title: "Global Private Capital Association: Foursan case", url: "https://www.globalprivatecapital.org/?p=50699" }, { title: "Jo Academy website", url: "https://www.joacademy.com/en" }],
    lastUpdated: '2026-10-21', isSample: false,
  },
  {
    id: 'kla-schools', name: "KLA Schools", sector: "Education", hqCity: "Miami", hqCountry: "United States",
    oneLiner: "Premium preschool franchise for ages 6 weeks to 5 years, using a Reggio Emilia-inspired, multilingual curriculum.",
    businessModel: "Tuition at each school. The franchisor earns a $78,500 franchise fee, 6% royalty and about 1.5% brand fund, and runs some schools itself.",
    yearsRunning: 18, scale: "About 26 schools in the US, 3 more in development for 2026", jobsCreated: 600,
    whoTheyEmploy: "Early-childhood teachers and assistants, school directors, cooks and admin staff; many bilingual educators.",
    expansionModel: 'franchise',
    expansionHistory: "Started in Miami and franchised to other states; 2025–26 targets include the West Coast and the East Coast from Massachusetts to Georgia. Jobs figure is an estimate (about 20–25 staff per school).",
    status: 'ready_to_pitch', cityFit: 65,
    cityFitReason: "Strong NYC demand for premium bilingual childcare, but real estate and licensing push costs to the top of the $1.1M–$5M range, and NY is not on their current priority list.",
    scores: { lroi: { value: 5, reason: "About 20+ local jobs per school, but each school costs $1.1M–$5M to open." }, replicability: { value: 8, reason: "Mature playbook with a franchise disclosure document, curriculum and training." }, franchiseReadiness: { value: 10, reason: "Active franchise programme with a 2026 disclosure document." }, willingnessToExpand: { value: 8, reason: "Actively selling franchises along the East Coast." } },
    sources: [{ title: "1851 Franchise: KLA Schools costs and data 2025", url: "https://1851franchise.com/kla-schools/kla-schools-franchise-costs-fees-profit-and-data-for-2025-2729413" }, { title: "1851 Franchise: KLA Schools 2025 growth", url: "https://1851franchise.com/kla-schools/kla-schools-2025-franchise-growth-2026-innovation-2731164" }, { title: "Franzy: KLA Schools", url: "https://franzy.com/franchises/kla-schools" }, { title: "KLA Schools website", url: "https://www.klaschools.com/" }],
    lastUpdated: '2026-10-21', isSample: false,
  },
  {
    id: 'climateready', name: "ClimateReady", sector: "Climate and jobs", hqCity: "Unknown", hqCountry: "Unknown",
    oneLiner: "A city-level heat action plan that creates local jobs (as described in #ventures-for-si-labs).",
    businessModel: "Unknown",
    yearsRunning: 0, scale: "Unknown", jobsCreated: 0,
    whoTheyEmploy: "Unknown",
    expansionModel: 'partner',
    expansionHistory: "Nothing could be verified in search results. The .si domain suggests Slovenia. Someone needs to check the website by hand.",
    status: 'new', cityFit: 55,
    cityFitReason: "NYC has a real need for heat resilience, but the venture itself is unverified.",
    scores: { lroi: { value: 5, reason: "Unknown; placeholder until the venture is verified." }, replicability: { value: 5, reason: "Unknown; placeholder until the venture is verified." }, franchiseReadiness: { value: 3, reason: "No evidence of a packaged model." }, willingnessToExpand: { value: 5, reason: "Unknown; placeholder until the venture is verified." } },
    sources: [{ title: "ClimateReady website", url: "https://www.climateready.si/" }],
    lastUpdated: '2026-10-21', isSample: false,
  },
  {
    id: 'climate-week-network', name: "Climate Week Network", sector: "Climate and jobs", hqCity: "San Francisco", hqCountry: "United States",
    oneLiner: "Free global platform where people find Climate Weeks and organisers launch new ones in their own city.",
    businessModel: "Free to use, run by Climatebase with philanthropic support. Each city week funds itself through sponsors and partners.",
    yearsRunning: 3, scale: "20+ cities; SF Climate Week 2025 had 25,000+ attendees across 650+ events", jobsCreated: 0,
    whoTheyEmploy: "Mostly local volunteer co-organisers and event hosts.",
    expansionModel: 'partner',
    expansionHistory: "Grew out of SF Climate Week (7k attendees in 2023, about 20k in 2024); Montréal and 20+ other cities have joined. The \"largest network\" claim is unverified.",
    status: 'needs_review', cityFit: 30,
    cityFitReason: "NYC already hosts Climate Week NYC (The Climate Group), so little gap is left.",
    scores: { lroi: { value: 3, reason: "Events create mostly short-term or volunteer work, not lasting livelihoods." }, replicability: { value: 9, reason: "Open playbook, already copied in 20+ cities." }, franchiseReadiness: { value: 7, reason: "Platform and organiser toolkit exist, but no formal franchise terms." }, willingnessToExpand: { value: 10, reason: "Recruiting new cities is the whole purpose." } },
    sources: [{ title: "Climatebase: Announcing the Climate Week Network", url: "https://stories.climatebase.org/p/announcing-the-climate-week-network" }, { title: "Oregon Climate Hub: Climate Week Network", url: "https://orclimatehub.org/resource/climate-week-network/" }, { title: "SF.gov: SF Climate Week 2024", url: "https://www.sf.gov/news/mayor-breed-announces-sf-climate-week-2024" }],
    lastUpdated: '2026-10-21', isSample: false,
  },
  {
    id: 'climatebase-fellowship', name: "Climatebase Fellowship", sector: "Climate and jobs", hqCity: "San Francisco", hqCountry: "United States",
    oneLiner: "Paid, mostly remote 12-week cohort programme that retrains professionals for climate careers.",
    businessModel: "Tuition of about $1,490–$1,990 per fellow, with need-based aid for over half. Being Climatebase's core revenue source is unconfirmed.",
    yearsRunning: 6, scale: "9 cohorts, 4,000+ fellows from 20,000+ applicants", jobsCreated: 0,
    whoTheyEmploy: "Small programme and community team; beneficiaries are mid-career professionals moving into climate work.",
    expansionModel: 'owned',
    expansionHistory: "Grew from about 2,500 to 4,000+ alumni over cohorts 1–9 (cohort 9 ran March–June 2026). Grows through remote cohorts, not new locations. Placement outcomes are not published.",
    status: 'needs_review', cityFit: 50,
    cityFitReason: "New Yorkers can already join remotely; a local cohort or partnership is possible, but there is no clear gap for a franchise.",
    scores: { lroi: { value: 6, reason: "Cheap per person and aimed at career moves, but no placement data." }, replicability: { value: 6, reason: "Format is easy to copy, but its value depends on the Climatebase brand and network." }, franchiseReadiness: { value: 3, reason: "No local licensing model; remote by design." }, willingnessToExpand: { value: 6, reason: "Wants to grow the programme, but not city by city." } },
    sources: [{ title: "Climatebase Fellowship FAQ", url: "https://faq.climatebase.org/fellowship/overview-of-the-climatebase-fellowship" }, { title: "Climatebase: Program Manager job post", url: "https://climatebase.org/job/73264/company/120" }, { title: "CB Insights: Climatebase", url: "https://www.cbinsights.com/company/climate-base" }],
    lastUpdated: '2026-10-21', isSample: false,
  },
  {
    id: 'plazrok', name: "Plazrok", sector: "Climate and jobs", hqCity: "Auckland", hqCountry: "New Zealand",
    oneLiner: "Turns unrecyclable mixed waste plastic into a lightweight aggregate that partly replaces stone in concrete.",
    businessModel: "Licenses the technology to local plants; operators earn plastic gate fees and aggregate sales (inferred from the licensee structure).",
    yearsRunning: 11, scale: "At least 2 plants: Bombay, New Zealand and Victoria Falls, Zimbabwe", jobsCreated: 0,
    whoTheyEmploy: "Plant operators, waste-sorting and logistics workers, concrete producers.",
    expansionModel: 'franchise',
    expansionHistory: "Started in New Zealand (parent Enviroplaz), then a licensed plant in Zimbabwe. Plazrok USA (a Wenger Manufacturing division) is raising money for a first US plant. Plant count, tonnage and jobs are unverified.",
    status: 'ready_to_pitch', cityFit: 65,
    cityFitReason: "Lots of waste plastic and construction demand, but industrial siting, permitting and NYC concrete specs are hurdles.",
    scores: { lroi: { value: 6, reason: "Moderate capital per plant, creating semi-skilled processing jobs." }, replicability: { value: 7, reason: "Proven process at several sites, but needs plastic supply and concrete buyers locally." }, franchiseReadiness: { value: 8, reason: "Already sold as a licence, with a US partner looking for sites." }, willingnessToExpand: { value: 9, reason: "Plazrok USA is actively looking for investment partners." } },
    sources: [{ title: "CurbWaste: Plazrok USA", url: "https://www.curbwaste.com/company-profiles-network/plazrok-usa" }, { title: "CB Insights: Enviroplaz", url: "https://www.cbinsights.com/company/enviroplaz" }, { title: "Newshub: Could this be the answer to plastic waste?", url: "https://www.newshub.co.nz/home/money/2018/01/could-this-be-the-answer-to-plastic-waste.html" }],
    lastUpdated: '2026-10-21', isSample: false,
  },
  {
    id: 'inventwood', name: "InventWood", sector: "Climate and jobs", hqCity: "Frederick, Maryland", hqCountry: "United States",
    oneLiner: "Makes Superwood, chemically treated and compressed wood strong enough to replace steel in some building uses.",
    businessModel: "Makes and sells Superwood panels and building products, starting with facades and decking.",
    yearsRunning: 10, scale: "1 plant of about 90,000 sq ft, designed for 1M sq ft a year; $50M+ raised including a $20M DOE grant", jobsCreated: 19,
    whoTheyEmploy: "Process and R&D engineers, manufacturing and production workers.",
    expansionModel: 'owned',
    expansionHistory: "Spun out of the University of Maryland in 2016 and opened its first commercial plant in Frederick (2024–25). No second site announced. Headcount differs by source; the plant was projected to hire 50–60.",
    status: 'needs_review', cityFit: 35,
    cityFitReason: "NYC is a likely buyer of Superwood for buildings, but a poor place for a factory; a supplier relationship fits better than replication.",
    scores: { lroi: { value: 3, reason: "Needs $50M+ for about 50–60 jobs." }, replicability: { value: 4, reason: "Depends on proprietary technology and a large factory." }, franchiseReadiness: { value: 2, reason: "Owns its manufacturing, with no licensing model." }, willingnessToExpand: { value: 6, reason: "Plans to scale production, but not through local partners." } },
    sources: [{ title: "Woodworking Network: InventWood closes $15M", url: "https://www.woodworkingnetwork.com/news/woodworking-industry-news/inventwood-closes-15m-funding-launch-superwood-shipments" }, { title: "UMD Mtech: InventWood profile", url: "https://mtech.umd.edu/news/mtech-ventures-and-i-corps-company-profile-inventwood" }, { title: "Unreasonable Group: InventWood", url: "https://unreasonablegroup.com/ventures/inventwood" }],
    lastUpdated: '2026-10-21', isSample: false,
  },
  {
    id: 'tony-romas', name: "Tony Roma's", sector: "Food, farming and restaurants", hqCity: "Orlando", hqCountry: "United States",
    oneLiner: "Casual-dining barbecue rib chain, now mostly run by franchisees outside the US.",
    businessModel: "Franchise royalties and development fees from international master franchisees, plus sales from remaining company-run sites.",
    yearsRunning: 54, scale: "About 86 locations worldwide (2024), about 10 in the US", jobsCreated: 0,
    whoTheyEmploy: "Standard casual-dining staff; no targeted-hiring mission found.",
    expansionModel: 'franchise',
    expansionHistory: "Franchised across the US and then internationally through master agreements (Spain, Latin America, Asia, Middle East). The US footprint keeps shrinking; new growth is international. Suggested by WeFranch. Location counts vary by source.",
    status: 'needs_review', cityFit: 35,
    cityFitReason: "An aging mid-market chain contracting in the US, facing heavy NYC competition and high occupancy costs, with no social mission.",
    scores: { lroi: { value: 4, reason: "High build-out cost per job and standard restaurant wages." }, replicability: { value: 7, reason: "Mature, standardized playbook with a simple menu." }, franchiseReadiness: { value: 9, reason: "Franchise-first company with decades of master-franchise deals." }, willingnessToExpand: { value: 7, reason: "Actively signing international deals, but not growing in the US." } },
    sources: [{ title: "Tony Roma's: growth in Mexico", url: "https://tonyromas.com/tony-romas-plans-accelerated-growth-in-mexico" }, { title: "Franchising.com: Tony Roma's news", url: "https://www.franchising.com/tonyromas/news/" }, { title: "Pacific Island Times: Tony Roma's Guam", url: "https://www.pacificislandtimes.com/post/tony-roma-s-guam-to-reopen-soon-under-new-ownership" }],
    lastUpdated: '2026-10-21', isSample: false,
  },
  {
    id: 'area-2-farms', name: "Area 2 Farms", sector: "Food, farming and restaurants", hqCity: "Arlington, Virginia", hqCountry: "United States",
    oneLiner: "Public benefit corporation running small certified-organic indoor farms that sell every harvest within 10 miles.",
    businessModel: "Weekly CSA baskets, an on-site farm stand and restaurant sales. Franchise units cost $308K–$471K. About $9M venture funding raised.",
    yearsRunning: 3, scale: "2 company farms in Virginia; franchising launched March 2026", jobsCreated: 14,
    whoTheyEmploy: "Farm workers; the \"Be a Farmer\" programme trains career-changers to become owner-operators.",
    expansionModel: 'franchise',
    expansionHistory: "Opened a second company farm in Fairfax, VA, then launched franchising in March 2026, targeting FL, GA, NC, OH and TN. Founding year conflicts (2020 vs 2023); jobs figure is an estimate (6–8 staff per farm).",
    status: 'ready_to_pitch', cityFit: 80,
    cityFitReason: "Small indoor footprint suits dense neighbourhoods and NYC has strong CSA demand, but rent and labour costs will strain unit economics.",
    scores: { lroi: { value: 5, reason: "6–8 jobs plus an owner-operator for about $300–470K per unit." }, replicability: { value: 8, reason: "Small, standardized indoor unit that can open in 30–60 days." }, franchiseReadiness: { value: 9, reason: "Formal franchise system with defined costs and support." }, willingnessToExpand: { value: 9, reason: "Expansion is the core, VC-backed strategy." } },
    sources: [{ title: "Franchising.com: Area 2 Farms", url: "https://www.franchising.com/area_2_farms/" }, { title: "IFA: Area 2 Farms launches franchise (Mar 2026)", url: "https://www.franchise.org/2026/03/area-2-farms-launches-new-franchise-opportunity-a-revolution-in-local-indoor-agriculture/" }, { title: "Franchise Times: Area 2 Farms franchise model", url: "https://www.franchisetimes.com/franchise_news/backed-by-reddit-s-co-founder-indoor-urban-farm-concept-launches-franchise-model/article_ba367276-cfb0-4aef-8274-4e581755f6db.html" }, { title: "Area 2 Farms website", url: "https://www.area2farms.com/" }],
    lastUpdated: '2026-10-21', isSample: false,
  },
  {
    id: 'crepes-and-waffles', name: "Crepes & Waffles", sector: "Food, farming and restaurants", hqCity: "Bogotá", hqCountry: "Colombia",
    oneLiner: "Family-owned Colombian crepe, waffle and ice-cream chain built around employing women, mostly single mothers.",
    businessModel: "Restaurant and ice-cream parlour sales from company-run sites; revenue funds employee benefits such as housing, education and childcare.",
    yearsRunning: 46, scale: "200+ restaurants and about 150 ice-cream parlours across 5+ countries", jobsCreated: 9300,
    whoTheyEmploy: "Overwhelmingly women (82–91%), about two-thirds of them heads of household, mostly single mothers.",
    expansionModel: 'owned',
    expansionHistory: "Grew slowly from Bogotá to other Colombian cities, then Ecuador (1995), Chile, Venezuela, Mexico and Spain, all apparently company-run. Headcount and site counts vary by source.",
    status: 'needs_review', cityFit: 70,
    cityFitReason: "Large Colombian and Latin American community in Queens and a direct livelihood fit, but high labour costs and an owned-only model make entry hard.",
    scores: { lroi: { value: 9, reason: "Labour-intensive, long-tenure jobs with strong benefits for single mothers." }, replicability: { value: 6, reason: "Simple concept and menu; the HR and social-support culture is the hard part to copy." }, franchiseReadiness: { value: 2, reason: "Does not franchise; would need a joint venture or partner deal." }, willingnessToExpand: { value: 4, reason: "Expands abroad slowly, a handful of countries in 30+ years." } },
    sources: [{ title: "Valora Analitik: 150 points in Colombia, 5 countries", url: "https://www.valoraanalitik.com/crepes-waffles-busca-seguir-creciendo-en-colombia/" }, { title: "El Tiempo: Who owns Crepes & Waffles", url: "https://www.eltiempo.com/economia/empresas/quien-es-la-duena-de-crepes-and-waffles-historia-y-expansion-760371" }, { title: "Bloomberg Línea: Beatriz Fernández", url: "https://www.bloomberglinea.com/2021/08/13/beatriz-fernandez/" }, { title: "Crepes & Waffles website", url: "https://www.crepesywaffles.com/" }],
    lastUpdated: '2026-10-21', isSample: false,
  },
  {
    id: 'leon', name: "Leon Restaurants", sector: "Food, farming and restaurants", hqCity: "London", hqCountry: "United Kingdom",
    oneLiner: "UK quick-service chain selling healthier Mediterranean-inspired \"naturally fast food\".",
    businessModel: "Sales from company-run restaurants, franchise fees and royalties, plus cookbooks and grocery products.",
    yearsRunning: 22, scale: "About 43 restaurants after restructuring, 23 of them franchised", jobsCreated: 530,
    whoTheyEmploy: "Quick-service crew and managers; no targeted-hiring mission found.",
    expansionModel: 'franchise',
    expansionHistory: "Grew in the UK, then franchised into the Netherlands, Norway, Ireland and elsewhere. Founder John Vincent bought it back from Asda in Oct 2025; it entered administration in Dec 2025 and a restructuring cut it to about 43 sites, saving about 530 jobs.",
    status: 'new', cityFit: 45,
    cityFitReason: "Healthy fast-casual could suit Manhattan office traffic, but the market is saturated (Sweetgreen, Cava, Dig) and Leon has no US brand recognition.",
    scores: { lroi: { value: 5, reason: "Efficient format, but entry-level jobs and recent job cuts." }, replicability: { value: 7, reason: "Systemized quick-service format with existing franchise operations." }, franchiseReadiness: { value: 6, reason: "Active franchise agreements, but just out of administration." }, willingnessToExpand: { value: 4, reason: "Owner is focused on stabilizing after insolvency." } },
    sources: [{ title: "Verdict Foodservice: John Vincent buys back Leon", url: "https://www.verdictfoodservice.com/news/john-vincent-buys-back-leon/" }, { title: "Consultancy.uk: Quantuma saves 530 Leon jobs", url: "https://www.consultancy.uk/news/44331/quantuma-secures-the-future-of-leon-restaurants-with-over-530-jobs-saved" }, { title: "Retail Week: Asda confirms sale of Leon", url: "https://www.retail-week.com/grocery/asda-confirms-sale-of-leon-to-founder/7049902.article" }, { title: "Wikipedia: Leon Restaurants", url: "https://en.wikipedia.org/wiki/Leon_Restaurants" }],
    lastUpdated: '2026-10-21', isSample: false,
  },
  {
    id: 'restorative-farms', name: "Restorative Farms", sector: "Food, farming and restaurants", hqCity: "Dallas", hqCountry: "United States",
    oneLiner: "South Dallas nonprofit running an urban farm system with paid vocational farm training for local residents, many formerly incarcerated.",
    businessModel: "Mostly grants and donations, plus CSA, farm stand and produce sales (including a container greenhouse at Fair Park).",
    yearsRunning: 7, scale: "3 sites in South Dallas: a training farm, a vermiculture site and a container greenhouse", jobsCreated: 0,
    whoTheyEmploy: "South Dallas residents with barriers to work, including formerly incarcerated people; some graduates go on to manage sites.",
    expansionModel: 'partner',
    expansionHistory: "Grew from one training farm to several Dallas sites with partners such as DART, SMU and Fair Park. No expansion outside Dallas. Founding year is inferred (about 2019); headcount unknown.",
    status: 'needs_review', cityFit: 60,
    cityFitReason: "The re-entry workforce angle fits NYC needs, but NYC already has similar groups and land is scarce.",
    scores: { lroi: { value: 7, reason: "Paid training for hard-to-employ people gives high impact per dollar." }, replicability: { value: 6, reason: "Model is copyable, but relies on local partners for land." }, franchiseReadiness: { value: 2, reason: "No playbook or licensing structure." }, willingnessToExpand: { value: 3, reason: "Focus is explicitly on South Dallas." } },
    sources: [{ title: "SMU: Cultivating prosperity in South Dallas", url: "https://www.smu.edu/News/Featured/Restorative-Farms" }, { title: "GuideStar: Restorative Farms", url: "https://www.guidestar.org/Profile/84-3267808" }, { title: "Whole Foods Market Foundation: Restorative Farms", url: "https://www.wholefoodsmarketfoundation.org/impact/success-stories/restorative-farms" }, { title: "Restorative Farms website", url: "https://restorativefarms.org/" }],
    lastUpdated: '2026-10-21', isSample: false,
  },
  {
    id: 'plant-it-forward', name: "Plant It Forward", sector: "Food, farming and restaurants", hqCity: "Houston", hqCountry: "United States",
    oneLiner: "Houston nonprofit that trains resettled refugees to run their own small urban farms on secured urban land.",
    businessModel: "Farmers sell through the Plant It Forward Food Hub, a CSA and markets; the nonprofit is funded by donations and grants.",
    yearsRunning: 15, scale: "13 farmers on 8 farms, about 6 acres", jobsCreated: 13,
    whoTheyEmploy: "Resettled refugees, mainly African farmers, running their farms as independent businesses.",
    expansionModel: 'cooperative',
    expansionHistory: "Grew over a decade from one site to about 8 farm plots in southwest Houston and added a food hub selling for other regional farms. No expansion outside Houston. Farmer count is from one source with an unclear date.",
    status: 'needs_review', cityFit: 65,
    cityFitReason: "NYC has large refugee and immigrant communities and strong CSA demand, but farmable land is far scarcer than in Houston.",
    scores: { lroi: { value: 7, reason: "Low capital on donated land creates owner-operator incomes for refugees." }, replicability: { value: 7, reason: "Simple, well-documented land, training and shared-sales model." }, franchiseReadiness: { value: 3, reason: "No franchise or licensing structure." }, willingnessToExpand: { value: 4, reason: "Little sign of plans outside Houston." } },
    sources: [{ title: "Brays Oaks MD: A decade with refugee farmers", url: "https://www.braysoaksmd.org/2021/05/celebrating-a-decade-of-working-with-refugee-farmers-for-a-healthier-houston/" }, { title: "Courthouse News: Refugees find success in farming", url: "https://www.courthousenews.com/houston-group-helps-refugees-find-success-in-farming/" }, { title: "Plant It Forward website", url: "https://www.plantitforward.farm/" }],
    lastUpdated: '2026-10-21', isSample: false,
  },
  {
    id: 'urban-harvest', name: "Urban Harvest", sector: "Food, farming and restaurants", hqCity: "Houston", hqCountry: "United States",
    oneLiner: "Houston nonprofit running a large community-garden network, gardening education and a major Saturday farmers market.",
    businessModel: "Donations, grants and farmers market vendor fees; about $2.4M revenue in 2023.",
    yearsRunning: 32, scale: "190+ community gardens; farmers market with 100+ vendors and about 3,000 shoppers a week", jobsCreated: 34,
    whoTheyEmploy: "Programme, education and market staff; indirectly supports 100+ vendor businesses.",
    expansionModel: 'partner',
    expansionHistory: "Began in 1994, added the farmers market in 2004 with 7 vendors and grew it to 100+. The garden network spread across Houston; nothing found outside Houston. Financials come from an aggregator, not the 990 itself.",
    status: 'new', cityFit: 35,
    cityFitReason: "NYC already has GrowNYC Greenmarkets and GreenThumb (550+ gardens), so this would add little.",
    scores: { lroi: { value: 6, reason: "Over $4M a year in vendor sales on a $2.4M budget, but few direct jobs." }, replicability: { value: 6, reason: "Well-understood models, but built on decades of community trust." }, franchiseReadiness: { value: 2, reason: "Single-metro nonprofit with no replication programme." }, willingnessToExpand: { value: 2, reason: "No sign of interest beyond Houston." } },
    sources: [{ title: "Houstonia: Urban Harvest turns 25", url: "https://www.houstoniamag.com/articles/2019/10/28/bob-randall-urban-harvest-turns-25" }, { title: "CauseIQ: Urban Harvest", url: "https://causeiq.com/organizations/urban-harvest,760501430" }, { title: "Urban Harvest website", url: "https://www.urbanharvest.org/" }],
    lastUpdated: '2026-10-21', isSample: false,
  },
  {
    id: 'aesir', name: "Aesir", sector: "Tech", hqCity: "Hong Kong", hqCountry: "Hong Kong",
    oneLiner: "Hong Kong social enterprise building AR/VR learning games for children with special educational needs, co-designed with health professionals.",
    businessModel: "Paid custom projects for schools, NGOs and corporates, plus sales of its own special-education learning products.",
    yearsRunning: 12, scale: "Hong Kong only", jobsCreated: 0,
    whoTheyEmploy: "Developers, designers and educational or therapy consultants (small team).",
    expansionModel: 'owned',
    expansionHistory: "No international expansion found. Seed funding of about HK$300K and several social-enterprise awards. Founding year conflicts (2013 vs 2014); headcount and revenue unknown.",
    status: 'new', cityFit: 25,
    cityFitReason: "NYC special education is a large market, but the product is better licensed into schools than replicated as a livelihood venture.",
    scores: { lroi: { value: 2, reason: "Small tech studio creating very few direct jobs." }, replicability: { value: 4, reason: "Software can move, but it is a bespoke studio rather than a system." }, franchiseReadiness: { value: 1, reason: "No franchise or licensing model." }, willingnessToExpand: { value: 3, reason: "No sign it is pursuing markets abroad." } },
    sources: [{ title: "Dealroom: Aesir", url: "https://app.dealroom.co/companies/aesir_hong_kong" }, { title: "PolyU: Ernest Chan profile", url: "https://www.polyu.edu.hk/alumni/featured-alumni/young-achievers/ernest-chan-ho-sing/?sc_lang=en" }, { title: "Aesir website", url: "https://aesir.hk/" }],
    lastUpdated: '2026-10-21', isSample: false,
  },
  {
    id: 'ana', name: "ANA", sector: "Tech", hqCity: "Mexico City", hqCountry: "Mexico",
    oneLiner: "AI platform that trains, certifies and coordinates home elder-care workers, helping move caregivers into formal work.",
    businessModel: "Software sold to care agencies, companies and governments, plus certifiable caregiver training.",
    yearsRunning: 4, scale: "8 Latin American countries, 15,000+ caregivers (company-reported)", jobsCreated: 0,
    whoTheyEmploy: "Own staff are tech and operations; the livelihood impact falls on low-wage, mostly informal, largely female caregivers.",
    expansionModel: 'partner',
    expansionHistory: "Started in Mexico with IDB Lab funding and expanded to 8 Latin American countries through partners; seed round from Impacta VC; founders named Schwab Foundation Social Entrepreneurs of the Year 2025. HQ and founding year are unverified.",
    status: 'needs_review', cityFit: 60,
    cityFitReason: "NYC has a very large, largely Spanish-speaking home-care workforce, but faces incumbent agency software and state rules.",
    scores: { lroi: { value: 8, reason: "Spreads at low cost per caregiver and raises formality, skills and pay." }, replicability: { value: 7, reason: "Software plus training ports easily, though NY home-care rules need localising." }, franchiseReadiness: { value: 4, reason: "No franchise, but set up to license to partners." }, willingnessToExpand: { value: 7, reason: "Actively scaling across Latin America with impact-investor backing." } },
    sources: [{ title: "ImpactAlpha: Ana Care raises seed funding", url: "https://impactalpha.com/?p=127073" }, { title: "IDB project ME-G1023", url: "https://www.iadb.org/en/project/ME-G1023" }, { title: "WEF: Ariel Zylbersztejn", url: "https://es.weforum.org/people/ariel-zylbersztejn" }, { title: "ANA website", url: "https://ana.care/" }],
    lastUpdated: '2026-10-21', isSample: false,
  },
]

// Seed data for the first run. Ventures already under review start on the shortlist; the rest sit in the catalogue.
export const ventures: Venture[] = seed.map((venture) => ({
  ...venture,
  cityId: selectedCityId,
  stage: venture.status === 'new' ? 'catalogue' : 'shortlisted',
  research: { status: 'done', finishedAt: '2026-10-21T00:00:00.000Z' },
}))
