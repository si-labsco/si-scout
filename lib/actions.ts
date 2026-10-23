'use server'
import { after } from 'next/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { discoveryQuestions, screeningTests, type Decision, type Venture } from '@/data/ventures'
import { runResearch, runScout } from '@/lib/agents'
import { demoMode } from '@/lib/demo'
import { getCity, getVenture, store, updateVenture } from '@/lib/store'
import { requireSession } from '@/lib/auth'
import { blankCity, decisionStatus, isRunning, slugify } from '@/lib/ventures'

const now = () => new Date().toISOString()
const message = (error: unknown) => (error instanceof Error ? error.message : String(error))

// Starts the scout agent for a city in the background and sends the user to that city's catalogue.
export async function startScout(formData: FormData) {
  await requireSession()
  const name = String(formData.get('city') ?? '').trim()
  if (!name) return
  const id = slugify(name)
  const existing = await getCity(id)
  if (!isRunning(existing?.scout)) {
    await store.saveCity({ ...(existing ?? blankCity(id, name)), scout: { status: 'running', startedAt: now() } })
    after(() => scoutCity(id, name))
  }
  redirect(`/catalogue?city=${id}`)
}

async function scoutCity(cityId: string, name: string) {
  try {
    const ventures = await store.listVentures()
    const result = await runScout(name, ventures.filter((v) => v.cityId === cityId).map((v) => v.name))
    const city = (await getCity(cityId)) ?? blankCity(cityId, name)
    const taken = new Set(ventures.map((v) => v.id))
    const known = new Set(ventures.filter((v) => v.cityId === cityId).map((v) => v.name.toLowerCase()))
    const candidates: Venture[] = []
    for (const c of result.candidates) {
      if (known.has(c.name.toLowerCase())) continue
      known.add(c.name.toLowerCase())
      let id = slugify(c.name) || 'venture'
      if (taken.has(id)) id = `${id}-${cityId}`
      for (let n = 2; taken.has(id); n++) id = `${slugify(c.name)}-${cityId}-${n}`
      taken.add(id)
      candidates.push({
        id, cityId, stage: 'catalogue', research: { status: 'not_started' },
        name: c.name, sector: c.sector, hqCity: c.hqCity, hqCountry: c.hqCountry, oneLiner: c.oneLiner,
        businessModel: 'To be researched', yearsRunning: 0, scale: 'To be researched', jobsCreated: 0, whoTheyEmploy: 'To be researched',
        expansionModel: c.expansionModel, expansionHistory: 'To be researched.', status: 'new', cityFit: c.cityFit, cityFitReason: c.cityFitReason,
        scores: Object.fromEntries(screeningTests.map(({ key }) => [key, { value: 0, reason: 'Not screened yet.' }])) as Venture['scores'],
        screening: { recommendation: 'hold', rationale: 'Not screened yet. Shortlist it to run research.' },
        discovery: discoveryQuestions.map(({ key }) => ({ key, answer: 'Ask in the partner meeting.', source: 'ask' as const })),
        sources: c.website ? [{ title: `${c.name} website`, url: c.website }] : [],
        lastUpdated: now().slice(0, 10), isSample: demoMode,
      })
    }
    await store.saveVentures(candidates)
    await store.saveCity({ ...city, ...result.city, name: result.city.name || city.name, scout: { status: 'done', startedAt: city.scout?.startedAt, finishedAt: now() } })
  } catch (error) {
    const city = (await getCity(cityId)) ?? blankCity(cityId, name)
    await store.saveCity({ ...city, scout: { status: 'failed', startedAt: city.scout?.startedAt, finishedAt: now(), error: message(error) } })
  }
}

// Moves a catalogue candidate onto the shortlist and kicks off the research agent.
export async function shortlistVenture(id: string) {
  await requireSession()
  await updateVenture(id, { stage: 'shortlisted' })
  await startResearch(id)
  revalidatePath('/', 'layout')
}

export async function startResearch(id: string) {
  await requireSession()
  const venture = await getVenture(id)
  if (!venture || isRunning(venture.research)) return
  await updateVenture(id, { research: { status: 'running', startedAt: now() } })
  after(() => researchVenture(id))
  revalidatePath('/', 'layout')
}

async function researchVenture(id: string) {
  try {
    const venture = await getVenture(id)
    if (!venture) return
    const result = await runResearch(venture, await getCity(venture.cityId))
    await updateVenture(id, { ...result, status: 'needs_review', isSample: venture.isSample || demoMode, lastUpdated: now().slice(0, 10), research: { status: 'done', startedAt: venture.research.startedAt, finishedAt: now() } })
  } catch (error) {
    const venture = await getVenture(id)
    await updateVenture(id, { research: { status: 'failed', startedAt: venture?.research.startedAt, finishedAt: now(), error: message(error) } })
  }
}

// The human screening decision (stage 1 of the Distribution Partnership framework).
export async function decideVenture(id: string, decision: Decision) {
  await requireSession()
  await updateVenture(id, { status: decisionStatus(decision) })
  revalidatePath('/', 'layout')
}

// Saves the edit form on /ventures/[id]/edit. Every field on the venture page can be changed by hand.
export async function saveVentureEdits(id: string, formData: FormData) {
  await requireSession()
  const venture = await getVenture(id)
  if (!venture) return
  const str = (key: string, fallback = '') => String(formData.get(key) ?? fallback).trim()
  const num = (key: string, min: number, max: number, fallback: number) => {
    const value = Number(formData.get(key))
    return Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : fallback
  }
  const pick = <T extends string>(key: string, options: readonly T[], fallback: T) => {
    const value = str(key) as T
    return options.includes(value) ? value : fallback
  }
  const scores = Object.fromEntries(screeningTests.map(({ key }) => [key, {
    ...venture.scores[key],
    value: num(`score.${key}.value`, 0, 10, venture.scores[key].value),
    reason: str(`score.${key}.reason`, venture.scores[key].reason),
  }])) as Venture['scores']
  const discovery = discoveryQuestions.map(({ key }) => ({
    key,
    answer: str(`discovery.${key}.answer`) || 'Ask in the partner meeting.',
    source: formData.get(`discovery.${key}.answered`) ? 'public' as const : 'ask' as const,
  }))
  // One source per line: "Title | https://url" (a bare URL also works).
  const sources = str('sources').split('\n').map((line) => line.trim()).filter(Boolean).flatMap((line) => {
    const [title, link] = line.includes('|') ? line.split('|').map((part) => part.trim()) : [line, line]
    return /^https?:\/\//.test(link) ? [{ title: title || link, url: link }] : []
  })
  await updateVenture(id, {
    name: str('name', venture.name) || venture.name,
    sector: str('sector', venture.sector),
    hqCity: str('hqCity', venture.hqCity),
    hqCountry: str('hqCountry', venture.hqCountry),
    oneLiner: str('oneLiner', venture.oneLiner),
    businessModel: str('businessModel', venture.businessModel),
    yearsRunning: num('yearsRunning', 0, 500, venture.yearsRunning),
    scale: str('scale', venture.scale),
    jobsCreated: num('jobsCreated', 0, 10_000_000, venture.jobsCreated),
    whoTheyEmploy: str('whoTheyEmploy', venture.whoTheyEmploy),
    expansionModel: pick('expansionModel', ['franchise', 'partner', 'cooperative', 'owned'] as const, venture.expansionModel),
    expansionHistory: str('expansionHistory', venture.expansionHistory),
    cityFit: num('cityFit', 0, 100, venture.cityFit),
    cityFitReason: str('cityFitReason', venture.cityFitReason),
    scores,
    screening: { recommendation: pick('recommendation', ['proceed', 'hold', 'decline'] as const, venture.screening.recommendation), rationale: str('rationale', venture.screening.rationale) },
    discovery,
    sources,
    notes: str('notes'),
    lastUpdated: now().slice(0, 10),
  })
  revalidatePath('/', 'layout')
  redirect(`/ventures/${id}`)
}
