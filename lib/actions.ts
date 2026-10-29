'use server'
import { after } from 'next/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { contactRoles, resultFromValue, type City, type Contact, type Decision, type ScoutRun, type Score, type Venture } from '@/data/ventures'
import { pathwayKeys, verticals, type Pathway } from '@/data/pathways'
import { runResearch, runScout, type ResearchResult } from '@/lib/agents'
import { agentsBlocked, demoMode } from '@/lib/demo'
import { getCity, getVenture, store, updateVenture } from '@/lib/store'
import { requireSession } from '@/lib/auth'
import { blankCity, currentStage, decisionStatus, isRunning, nextStages, questionsFor, slugify, stageBlockers, stagesFor, testsFor } from '@/lib/ventures'

const now = () => new Date().toISOString()
const message = (error: unknown) => (error instanceof Error ? error.message : String(error))

// Starts the scout agent for a city in the background, records the run in the city's history
// and sends the user to the run page.
export async function startScout(formData: FormData) {
  await requireSession()
  const name = String(formData.get('city') ?? '').trim()
  if (!name || agentsBlocked) return
  const id = slugify(name)
  const existing = await getCity(id)
  if (isRunning(existing?.scout)) redirect(`/scout/${existing?.runs?.[0]?.id ?? ''}`)
  const startedAt = now()
  const run: ScoutRun = { id: `run-${Date.now()}`, cityId: id, cityName: existing?.name || name, status: 'running', startedAt, ventureIds: [], demo: demoMode }
  const city = existing ?? blankCity(id, name)
  await store.saveCity({ ...city, scout: { status: 'running', startedAt }, runs: [run, ...(city.runs ?? [])] })
  after(() => scoutCity(id, name, run.id))
  revalidatePath('/', 'layout')
  redirect(`/scout/${run.id}`)
}

// Updates one run in a city's history, keeping `city.scout` in step with the latest run.
const withRun = (city: City, runId: string, patch: Partial<ScoutRun>): City => {
  const runs = (city.runs ?? []).map((run) => (run.id === runId ? { ...run, ...patch } : run))
  const latest = runs[0]
  return { ...city, runs, scout: latest ? { status: latest.status, startedAt: latest.startedAt, finishedAt: latest.finishedAt, error: latest.error } : city.scout }
}

async function scoutCity(cityId: string, name: string, runId: string) {
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
        id, cityId, scoutRunId: runId, list: 'catalogue', research: { status: 'not_started' },
        pathway: 'undecided', stage: 'sourcing', stageHistory: [{ to: 'sourcing', pathway: 'undecided', at: now(), by: 'Scout agent' }], stageOutputs: {}, contacts: [],
        source: 'Scout agent', originator: '', verticals: [], countryRegion: c.hqCountry,
        name: c.name, sector: c.sector, hqCity: c.hqCity, hqCountry: c.hqCountry, oneLiner: c.oneLiner,
        businessModel: 'To be researched', yearsRunning: 0, scale: 'To be researched', jobsCreated: 0, whoTheyEmploy: 'To be researched',
        expansionModel: c.expansionModel, expansionHistory: 'To be researched.', status: 'new', cityFit: c.cityFit, cityFitReason: c.cityFitReason,
        scores: Object.fromEntries(testsFor('undecided').filter((t) => !t.derived).map(({ key }) => [key, { result: 'needs_analysis' as const, note: 'Not screened yet.', confirmed: false }])),
        screening: { recommendation: 'hold', rationale: 'Not screened yet. Shortlist it to run research.' },
        discovery: questionsFor('undecided').map(({ key }) => ({ key, answer: 'Ask in the meeting.', source: 'ask' as const })),
        sources: c.website ? [{ title: `${c.name} website`, url: c.website }] : [],
        lastUpdated: now().slice(0, 10), isSample: demoMode,
      })
    }
    await store.saveVentures(candidates)
    const cityName = result.city.name || city.name
    await store.saveCity(withRun({ ...city, ...result.city, name: cityName }, runId, { status: 'done', finishedAt: now(), cityName, ventureIds: candidates.map((v) => v.id) }))
  } catch (error) {
    const city = (await getCity(cityId)) ?? blankCity(cityId, name)
    await store.saveCity(withRun(city, runId, { status: 'failed', finishedAt: now(), error: message(error) }))
  }
}

// Moves a catalogue candidate onto the shortlist and kicks off the research agent.
export async function shortlistVenture(id: string) {
  await requireSession()
  await updateVenture(id, { list: 'shortlisted' })
  await startResearch(id)
  revalidatePath('/', 'layout')
}

export async function startResearch(id: string) {
  await requireSession()
  const venture = await getVenture(id)
  if (!venture || isRunning(venture.research) || agentsBlocked) return
  await updateVenture(id, { research: { status: 'running', startedAt: now() } })
  after(() => researchVenture(id))
  revalidatePath('/', 'layout')
}

async function researchVenture(id: string) {
  try {
    const venture = await getVenture(id)
    if (!venture) return
    const result = await runResearch(venture, await getCity(venture.cityId))
    await updateVenture(id, { ...result, ...mergeResearch(venture, result), status: 'needs_review', isSample: venture.isSample || demoMode, lastUpdated: now().slice(0, 10), research: { status: 'done', startedAt: venture.research.startedAt, finishedAt: now() } })
  } catch (error) {
    const venture = await getVenture(id)
    await updateVenture(id, { research: { status: 'failed', startedAt: venture?.research.startedAt, finishedAt: now(), error: message(error) } })
  }
}

// Research results arrive as unconfirmed suggestions: test results a person has confirmed are kept, and
// discovery answers are replaced only for the questions the agent covers.
function mergeResearch(venture: Venture, result: ResearchResult): Pick<Venture, 'scores' | 'discovery'> {
  const scores = { ...venture.scores }
  for (const [key, s] of Object.entries(result.scores)) {
    if (!scores[key]?.confirmed) scores[key] = { result: resultFromValue(s.value), note: s.reason, sourceRefs: s.sourceRefs, confirmed: false, aiValue: s.value }
  }
  const answered = new Set(result.discovery.map((d) => d.key))
  return { scores, discovery: [...venture.discovery.filter((d) => !answered.has(d.key)), ...result.discovery] }
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
    const raw = formData.get(key)
    const value = Number(raw)
    return raw !== null && raw !== '' && Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : fallback
  }
  const pick = <T extends string>(key: string, options: readonly T[], fallback: T) => {
    const value = str(key) as T
    return options.includes(value) ? value : fallback
  }
  // Only the current pathway's tests and questions are on the form; the others are kept as they are.
  const scores = { ...venture.scores }
  for (const { key } of testsFor(venture.pathway).filter((t) => !t.derived)) {
    const before = scores[key]
    const result = pick(`score.${key}.result`, ['yes', 'no', 'needs_analysis'] as const, before?.result ?? 'needs_analysis')
    const note = str(`score.${key}.note`, before?.note)
    const changed = !before || result !== before.result || note !== before.note
    scores[key] = { ...before, result, note, confirmed: (before?.confirmed ?? false) || changed }
  }
  const asked = new Set(questionsFor(venture.pathway).map((q) => q.key))
  const discovery = [...venture.discovery.filter((d) => !asked.has(d.key)), ...[...asked].map((key) => ({
    key,
    answer: str(`discovery.${key}.answer`) || 'Ask in the meeting.',
    source: formData.get(`discovery.${key}.answered`) ? 'public' as const : 'ask' as const,
  }))]
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
    source: str('source', venture.source),
    originator: str('originator', venture.originator),
    countryRegion: str('countryRegion', venture.countryRegion),
    verticals: verticals.filter((v) => formData.getAll('verticals').includes(v)),
    lastUpdated: now().slice(0, 10),
  })
  revalidatePath('/', 'layout')
  redirect(`/ventures/${id}`)
}

// Pipeline: pathway, stage moves and stage outputs. Every move is logged in stageHistory.
export async function setPathway(id: string, pathway: Pathway) {
  const by = await requireSession()
  const venture = await getVenture(id)
  if (!venture || !pathwayKeys.includes(pathway) || venture.pathway === pathway) return
  const stages = stagesFor(pathway)
  // Keep the stage when the new pathway has it (e.g. screening); Distribution has no sourcing stage.
  const stage = stages.find((s) => s.key === venture.stage)?.key ?? stages.find((s) => s.key === 'screening')?.key ?? stages[0].key
  const event = { from: venture.stage, to: stage, fromPathway: venture.pathway, pathway, at: now(), by }
  await updateVenture(id, { pathway, stage, stageHistory: [...venture.stageHistory, event], lastUpdated: now().slice(0, 10) })
  revalidatePath('/', 'layout')
}

// Moves forward only to the next stage (or past an optional one) and only once the current stage's
// outputs are complete; moving back is always allowed.
export async function moveStage(id: string, to: string) {
  const by = await requireSession()
  const venture = await getVenture(id)
  if (!venture) return
  const stages = stagesFor(venture.pathway)
  const from = currentStage(venture)
  const target = stages.find((s) => s.key === to)
  if (!target || target.key === from.key) return
  const forward = stages.indexOf(target) > stages.indexOf(from)
  if (forward && (stageBlockers(venture).length || !nextStages(venture).includes(target))) return
  const event = { from: from.key, to: target.key, pathway: venture.pathway, at: now(), by }
  await updateVenture(id, { stage: target.key, stageHistory: [...venture.stageHistory, event], lastUpdated: now().slice(0, 10) })
  revalidatePath('/', 'layout')
  redirect(`/ventures/${id}?stage=${target.key}`)
}

export async function saveStageOutputs(id: string, stageKey: string, formData: FormData) {
  await requireSession()
  const venture = await getVenture(id)
  const stage = venture && stagesFor(venture.pathway).find((s) => s.key === stageKey)
  if (!venture || !stage) return
  const outputs = Object.fromEntries(stage.fields.map((f) => {
    const value = String(formData.get(f.key) ?? '').trim()
    return [f.key, f.options && value && !f.options.includes(value) ? '' : value]
  }))
  await updateVenture(id, { stageOutputs: { ...venture.stageOutputs, [stageKey]: outputs }, lastUpdated: now().slice(0, 10) })
  revalidatePath('/', 'layout')
  redirect(`/ventures/${id}?stage=${stageKey}`)
}

// A person confirms (or changes) one screening test result.
export async function confirmScore(id: string, key: string, result: Score['result']) {
  await requireSession()
  const venture = await getVenture(id)
  if (!venture || !testsFor(venture.pathway).some((t) => t.key === key && !t.derived)) return
  const before = venture.scores[key]
  await updateVenture(id, { scores: { ...venture.scores, [key]: { ...before, note: before?.note ?? '', result, confirmed: true } } })
  revalidatePath('/', 'layout')
}

// Contacts. Marking one as primary clears the flag on the others.
const contactFrom = (formData: FormData, id: string): Contact => {
  const str = (key: string) => String(formData.get(key) ?? '').trim()
  const role = str('role') as Contact['role']
  return { id, name: str('name'), role: contactRoles.includes(role) ? role : 'Other', email: str('email'), phone: str('phone'), linkedin: str('linkedin'), isPrimary: formData.get('isPrimary') === 'on' }
}
const withPrimary = (contacts: Contact[], primaryId?: string) => contacts.map((c) => ({ ...c, isPrimary: primaryId ? c.id === primaryId : c.isPrimary }))

export async function saveContact(id: string, contactId: string | null, formData: FormData) {
  await requireSession()
  const venture = await getVenture(id)
  if (!venture) return
  const contact = contactFrom(formData, contactId ?? `c-${Date.now()}`)
  if (!contact.name) return
  const others = venture.contacts.filter((c) => c.id !== contact.id)
  const list = contactId ? venture.contacts.map((c) => (c.id === contactId ? contact : c)) : [...others, contact]
  const isFirst = !others.length
  await updateVenture(id, { contacts: withPrimary(list, contact.isPrimary || isFirst ? contact.id : undefined) })
  revalidatePath(`/ventures/${id}`)
}

export async function removeContact(id: string, contactId: string) {
  await requireSession()
  const venture = await getVenture(id)
  if (!venture) return
  const rest = venture.contacts.filter((c) => c.id !== contactId)
  await updateVenture(id, { contacts: rest.some((c) => c.isPrimary) ? rest : withPrimary(rest, rest[0]?.id) })
  revalidatePath(`/ventures/${id}`)
}
