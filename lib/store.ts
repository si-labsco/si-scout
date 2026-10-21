import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { cities as seedCities, ventures as seedVentures, type City, type Venture } from '@/data/ventures'

// Server-side storage for cities and ventures. Uses Supabase when SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY are set (see supabase/schema.sql); otherwise falls back to
// an in-memory copy of the seed data that resets whenever the server restarts.

type Store = {
  listCities(): Promise<City[]>
  saveCity(city: City): Promise<void>
  listVentures(): Promise<Venture[]>
  saveVentures(ventures: Venture[]): Promise<void>
}

function memoryStore(): Store {
  const state = ((globalThis as { __siScout?: { cities: City[]; ventures: Venture[] } }).__siScout ??= {
    cities: structuredClone(seedCities),
    ventures: structuredClone(seedVentures),
  })
  const upsert = <T extends { id: string }>(list: T[], item: T) => {
    const index = list.findIndex((existing) => existing.id === item.id)
    if (index === -1) list.push(structuredClone(item))
    else list[index] = structuredClone(item)
  }
  return {
    listCities: async () => structuredClone(state.cities),
    saveCity: async (city) => upsert(state.cities, city),
    listVentures: async () => structuredClone(state.ventures),
    saveVentures: async (ventures) => ventures.forEach((venture) => upsert(state.ventures, venture)),
  }
}

function supabaseStore(client: SupabaseClient): Store {
  let seeded: Promise<void> | undefined
  const ensureSeeded = () =>
    (seeded ??= (async () => {
      const { count, error } = await client.from('cities').select('id', { count: 'exact', head: true })
      if (error) throw error
      if (count) return
      await write('cities', seedCities)
      await write('ventures', seedVentures)
    })())
  const read = async <T>(table: string): Promise<T[]> => {
    await ensureSeeded()
    const { data, error } = await client.from(table).select('data').order('created_at')
    if (error) throw error
    return data.map((row) => row.data as T)
  }
  const write = async (table: string, items: { id: string }[]) => {
    if (!items.length) return
    const rows = items.map((item) => ({ id: item.id, data: item, updated_at: new Date().toISOString() }))
    const { error } = await client.from(table).upsert(rows)
    if (error) throw error
  }
  return {
    listCities: () => read<City>('cities'),
    saveCity: (city) => write('cities', [city]),
    listVentures: () => read<Venture>('ventures'),
    saveVentures: (ventures) => write('ventures', ventures),
  }
}

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
export const store: Store = url && key ? supabaseStore(createClient(url, key, { auth: { persistSession: false } })) : memoryStore()
export const usingMemoryStore = !(url && key)

export async function getVenture(id: string) {
  return (await store.listVentures()).find((venture) => venture.id === id)
}

export async function getCity(id: string) {
  return (await store.listCities()).find((city) => city.id === id)
}

export async function updateVenture(id: string, patch: Partial<Venture>) {
  const venture = await getVenture(id)
  if (!venture) throw new Error(`Venture ${id} not found`)
  const next = { ...venture, ...patch }
  await store.saveVentures([next])
  return next
}
