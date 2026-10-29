import { Shell } from '@/components/venture-shell'
import { ShortlistTable } from '@/components/shortlist-table'
import { AutoRefresh } from '@/components/auto-refresh'
import { store } from '@/lib/store'
import { isRunning } from '@/lib/ventures'
export default async function Shortlist() { const [cities, ventures] = await Promise.all([store.listCities(), store.listVentures()]); const rows = ventures.filter((v) => v.list === 'shortlisted'); return <Shell active="Shortlist"><AutoRefresh active={rows.some((v) => isRunning(v.research))} /><div className="flex flex-col gap-6"><div><p className="text-xs text-muted-foreground">Pipeline</p><h1 className="mt-2 text-3xl font-semibold">Shortlist</h1><p className="mt-2 text-sm text-muted-foreground">Ventures you picked from the catalogue. The research agent fills in each profile, with sources, once it&apos;s shortlisted.</p></div><ShortlistTable ventures={rows} cities={cities.map((c) => ({ id: c.id, name: c.name }))} /></div></Shell> }
