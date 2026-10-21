'use server'
import { after } from 'next/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { Venture } from '@/data/ventures'
import { runResearch, runScout } from '@/lib/agents'
import { getCity, getVenture, store, updateVenture } from '@/lib/store'
import { blankCity, isRunning, slugify } from '@/lib/ventures'

const now = () => new Date().toISOString()
const message = (error: unknown) => (error instanceof Error ? error.message : String(error))

// Starts the scout agent for a city in the background and sends the user to that city's catalogue.
export async function startScout(formData: FormData) {
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
        scores: { lroi: { value: 0, reason: 'Not researched yet.' }, replicability: { value: 0, reason: 'Not researched yet.' }, franchiseReadiness: { value: 0, reason: 'Not researched yet.' }, willingnessToExpand: { value: 0, reason: 'Not researched yet.' } },
        sources: c.website ? [{ title: `${c.name} website`, url: c.website }] : [],
        lastUpdated: now().slice(0, 10), isSample: false,
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
  await updateVenture(id, { stage: 'shortlisted' })
  await startResearch(id)
  revalidatePath('/', 'layout')
}

export async function startResearch(id: string) {
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
    await updateVenture(id, { ...result, status: 'needs_review', isSample: false, lastUpdated: now().slice(0, 10), research: { status: 'done', startedAt: venture.research.startedAt, finishedAt: now() } })
  } catch (error) {
    const venture = await getVenture(id)
    await updateVenture(id, { research: { status: 'failed', startedAt: venture?.research.startedAt, finishedAt: now(), error: message(error) } })
  }
}

export async function approveVenture(id: string) {
  await updateVenture(id, { status: 'ready_to_pitch' })
  revalidatePath('/', 'layout')
}
