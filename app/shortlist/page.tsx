import { Shell } from '@/components/venture-shell'
import { ShortlistTable } from '@/components/shortlist-table'
import { AutoRefresh } from '@/components/auto-refresh'
import { store } from '@/lib/store'
import { isRunning } from '@/lib/ventures'
export default async function Shortlist() { const [cities, ventures] = await Promise.all([store.listCities(), store.listVentures()]); const rows = ventures.filter((v) => v.stage === 'shortlisted'); return <Shell active="Shortlist"><AutoRefresh active={rows.some((v) => isRunning(v.research))} /><div className="flex flex-col gap-6"><div><p className="text-xs uppercase tracking-[0.16em] text-[#92a225]">Pipeline</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Shortlist</h1><p className="mt-2 text-sm text-[#788078]">Ventures you picked from the catalogue. The research agent fills in each profile, with sources, once it&apos;s shortlisted.</p></div><ShortlistTable ventures={rows} cities={cities.map((c) => ({ id: c.id, name: c.name }))} /></div></Shell> }
