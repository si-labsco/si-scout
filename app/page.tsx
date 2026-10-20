'use client'

import { useState } from 'react'
import {
  ArrowUpRight,
  Bell,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Compass,
  Database,
  FileCheck2,
  Filter,
  Globe2,
  LayoutDashboard,
  ListFilter,
  MapPin,
  Plus,
  Search,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Target,
  Users,
  X,
} from 'lucide-react'

const ventures = [
  { name: 'Namma Yatri', category: 'Mobility cooperative', origin: 'Bengaluru, India', fit: 94, score: 8.8, status: 'Ready to pitch', scale: '18 cities', jobs: '42k+', color: 'bg-amber-100 text-amber-900', initials: 'NY' },
  { name: 'Too Good To Go', category: 'Food marketplace', origin: 'Copenhagen, Denmark', fit: 91, score: 8.5, status: 'Ready to pitch', scale: '17 countries', jobs: '3.2k+', color: 'bg-emerald-100 text-emerald-900', initials: 'TG' },
  { name: 'Leon', category: 'Fast-casual food', origin: 'London, UK', fit: 87, score: 8.1, status: 'Needs review', scale: '85 outlets', jobs: '2.1k+', color: 'bg-sky-100 text-sky-900', initials: 'LE' },
  { name: 'Crepes & Waffles', category: 'Restaurant collective', origin: 'Bogotá, Colombia', fit: 82, score: 7.9, status: 'Needs review', scale: '140 outlets', jobs: '4.8k+', color: 'bg-rose-100 text-rose-900', initials: 'CW' },
]

const rubric = [
  { label: 'LROI', value: 9.2, detail: 'High local return on investment' },
  { label: 'Replicability', value: 8.8, detail: 'Proven across different markets' },
  { label: 'Franchise-ready', value: 8.4, detail: 'Clear partner operating model' },
  { label: 'Willingness', value: 7.9, detail: 'Signals expansion appetite' },
]

function ScoreRing({ score }: { score: number }) {
  return (
    <div className="relative flex size-14 items-center justify-center rounded-full" style={{ background: `conic-gradient(#d7f24a ${score * 10}%, #2b3030 0)` }}>
      <div className="flex size-11 items-center justify-center rounded-full bg-[#171a19] text-sm font-semibold text-[#f4f5ef]">{score}</div>
    </div>
  )
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [city, setCity] = useState('Nairobi, Kenya')
  const [sector, setSector] = useState('All sectors')
  const [showRun, setShowRun] = useState(false)
  const [query, setQuery] = useState('')

  const filtered = ventures.filter((venture) => venture.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <main className="min-h-screen bg-[#f3f4ee] text-[#202522] selection:bg-[#d7f24a] selection:text-[#202522]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[232px] flex-col bg-[#171a19] px-4 py-5 text-[#c8cec4] lg:flex">
        <div className="flex items-center gap-3 px-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[#d7f24a] text-sm font-black text-[#171a19]">SI</div>
          <div><div className="text-sm font-semibold tracking-tight text-white">Si-Labs</div><div className="text-[10px] uppercase tracking-[0.18em] text-[#7c857c]">Venture OS</div></div>
        </div>
        <div className="mt-10 space-y-1">
          {[['Overview', LayoutDashboard], ['Scout ventures', Compass], ['Catalogue', Database], ['Approvals', FileCheck2]].map(([label, Icon]) => (
            <button key={label as string} onClick={() => setActiveTab(label as string)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${activeTab === label ? 'bg-[#2a302d] text-white' : 'text-[#8d968e] hover:bg-[#222724] hover:text-white'}`}><Icon className="size-4" />{label as string}{label === 'Approvals' && <span className="ml-auto rounded-full bg-[#d7f24a] px-1.5 py-0.5 text-[10px] font-semibold text-[#171a19]">3</span>}</button>
          ))}
        </div>
        <div className="mt-auto space-y-1 border-t border-[#303631] pt-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#8d968e] hover:bg-[#222724] hover:text-white"><CircleHelp className="size-4" />Help centre</button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#8d968e] hover:bg-[#222724] hover:text-white"><Settings2 className="size-4" />Settings</button>
          <div className="mt-4 flex items-center gap-3 rounded-lg bg-[#222724] p-2.5"><div className="flex size-7 items-center justify-center rounded-full bg-[#e0a98f] text-xs font-semibold text-[#43251c]">AK</div><div className="min-w-0"><div className="truncate text-xs font-medium text-white">Abheejit K.</div><div className="truncate text-[10px] text-[#7c857c]">Si-Labs team</div></div><ChevronDown className="ml-auto size-3.5 text-[#7c857c]" /></div>
        </div>
      </aside>

      <section className="lg:ml-[232px]">
        <header className="flex h-[72px] items-center justify-between border-b border-[#dde1d8] bg-[#f3f4ee]/95 px-5 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3"><button className="lg:hidden"><span className="sr-only">Open menu</span><LayoutDashboard className="size-5" /></button><div className="text-sm text-[#788078]">Workspace <ChevronRight className="mx-1 inline size-3" /> <span className="font-medium text-[#202522]">Venture sourcing</span></div></div>
          <div className="flex items-center gap-2"><button className="rounded-lg p-2 text-[#788078] hover:bg-white"><Bell className="size-4" /></button><div className="hidden h-6 w-px bg-[#dde1d8] sm:block" /><button className="flex items-center gap-2 rounded-lg border border-[#d9ddd3] bg-white px-3 py-2 text-xs font-medium shadow-sm"><div className="size-2 rounded-full bg-[#a5c338]" /> Live workspace <ChevronDown className="size-3.5 text-[#788078]" /></button></div>
        </header>

        <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[#788078]"><Sparkles className="size-3.5 text-[#86a51e]" /> Internal intelligence</div><h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#202522] sm:text-[38px]">Venture sourcing <span className="text-[#9aa29a]">/</span> Nairobi</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#788078]">Find proven, replicable businesses that could create value in a new city.</p></div><button onClick={() => setShowRun(true)} className="flex items-center justify-center gap-2 rounded-lg bg-[#202522] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#343a36]"><Plus className="size-4" /> Run new scout</button></div>

          <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-[#dde1d8] pb-3">{['Overview', 'Shortlist', 'Catalogue', 'Sources'].map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`px-1 py-2 mr-5 text-sm ${activeTab === tab ? 'border-b-2 border-[#202522] font-semibold text-[#202522]' : 'text-[#8a928a] hover:text-[#202522]'}`}>{tab}{tab === 'Shortlist' && <span className="ml-1.5 rounded-full bg-[#e2e7dd] px-1.5 py-0.5 text-[10px]">12</span>}</button>)}<div className="ml-auto hidden items-center gap-2 text-xs text-[#788078] md:flex"><span className="size-2 rounded-full bg-[#a5c338]" /> Last run 18 min ago <button className="ml-2 rounded-md p-1 hover:bg-white"><SlidersHorizontal className="size-4" /></button></div></div>

          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[['12', 'credible candidates', 'from 86 sources', Target], ['8.6', 'average opportunity score', 'out of 10', Sparkles], ['4', 'ready to pitch', 'approved internally', FileCheck2], ['9.4k', 'potential jobs', 'across shortlist', Users]].map(([value, label, detail, Icon]) => <div key={label as string} className="rounded-xl border border-[#dde1d8] bg-white p-5"><div className="mb-5 flex items-center justify-between"><span className="text-xs font-medium text-[#788078]">{label as string}</span><Icon className="size-4 text-[#a5b19d]" /></div><div className="text-3xl font-semibold tracking-[-0.04em]">{value as string}</div><div className="mt-1 text-xs text-[#9aa29a]">{detail as string}</div></div>)}
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(330px,0.75fr)]">
            <div className="min-w-0 rounded-xl border border-[#dde1d8] bg-white"><div className="flex flex-col gap-4 border-b border-[#edf0e9] p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold tracking-tight">Top opportunities</h2><p className="mt-1 text-xs text-[#8a928a]">Ranked for fit with Nairobi, based on your rubric.</p></div><div className="flex items-center gap-2"><div className="relative"><Search className="absolute left-2.5 top-2.5 size-3.5 text-[#9aa29a]" /><input aria-label="Search ventures" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search ventures" className="h-8 w-36 rounded-md border border-[#dde1d8] bg-[#fafbf8] pl-8 pr-2 text-xs outline-none focus:border-[#9aaa39]" /></div><button className="flex h-8 items-center gap-1.5 rounded-md border border-[#dde1d8] px-2.5 text-xs text-[#687168]"><Filter className="size-3.5" /> Filter</button></div></div><div className="divide-y divide-[#edf0e9]">{filtered.map((venture, index) => <div key={venture.name} className="group flex items-center gap-3 p-4 transition hover:bg-[#fafbf8] sm:gap-4"><div className="w-5 text-center text-xs font-medium text-[#a2aaa1]">0{index + 1}</div><div className={`flex size-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${venture.color}`}>{venture.initials}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate text-sm font-semibold">{venture.name}</h3><span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${venture.status === 'Ready to pitch' ? 'bg-[#edf6d5] text-[#63800c]' : 'bg-[#f3eee2] text-[#9a6a22]'}`}>{venture.status}</span></div><div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#8a928a]"><span>{venture.category}</span><span className="text-[#c2c8bf]">·</span><span className="flex items-center gap-1"><MapPin className="size-3" />{venture.origin}</span></div></div><div className="hidden text-right sm:block"><div className="text-sm font-semibold">{venture.fit}%</div><div className="text-[10px] text-[#9aa29a]">city fit</div></div><div className="hidden w-20 text-right md:block"><div className="text-sm font-medium">{venture.scale}</div><div className="text-[10px] text-[#9aa29a]">scale</div></div><ChevronRight className="size-4 text-[#bec5bb] transition group-hover:translate-x-0.5 group-hover:text-[#202522]" /></div>)}</div><div className="flex items-center justify-between border-t border-[#edf0e9] px-5 py-3"><span className="text-xs text-[#8a928a]">Showing {filtered.length} of 12 shortlisted ventures</span><button className="flex items-center gap-1 text-xs font-medium text-[#52670b]">View all <ArrowUpRight className="size-3.5" /></button></div></div>

            <div className="rounded-xl border border-[#dde1d8] bg-[#202522] p-5 text-[#f4f5ef]"><div className="mb-7 flex items-start justify-between"><div><div className="mb-2 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#aeb9a9]"><Globe2 className="size-3.5" /> City lens</div><h2 className="text-lg font-semibold tracking-tight">Why Nairobi?</h2></div><button className="rounded-md p-1 text-[#829080] hover:bg-[#303631]"><ListFilter className="size-4" /></button></div><div className="mb-7 flex items-end gap-3"><div className="text-5xl font-semibold tracking-[-0.07em] text-[#d7f24a]">8.1</div><div className="pb-1 text-xs text-[#aeb9a9]">overall<br />opportunity</div></div><div className="space-y-4">{rubric.map((item) => <div key={item.label}><div className="mb-1.5 flex items-center justify-between text-xs"><span className="text-[#c9d0c5]">{item.label}</span><span className="font-medium text-[#d7f24a]">{item.value}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-[#343b35]"><div className="h-full rounded-full bg-[#d7f24a]" style={{ width: `${item.value * 10}%` }} /></div><div className="mt-1 text-[10px] text-[#829080]">{item.detail}</div></div>)}</div><button className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg border border-[#485347] py-2.5 text-xs font-medium text-[#e2e9dc] transition hover:bg-[#303631]">View city signals <ArrowUpRight className="size-3.5" /></button></div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2"><div className="rounded-xl border border-[#dde1d8] bg-white p-5"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold tracking-tight">Scout activity</h2><p className="mt-1 text-xs text-[#8a928a]">How the catalogue is growing</p></div><button className="text-[#8a928a]"><ChevronDown className="size-4" /></button></div><div className="flex h-24 items-end gap-2 border-b border-[#edf0e9] pb-2">{[30, 45, 38, 58, 52, 70, 65, 84, 78, 92, 86, 100].map((height, i) => <div key={i} className={`flex-1 rounded-t-sm ${i > 8 ? 'bg-[#b9d346]' : 'bg-[#e4e9de]'}`} style={{ height: `${height}%` }} />)}</div><div className="mt-3 flex justify-between text-[10px] text-[#9aa29a]"><span>Sep 01</span><span>Sep 15</span><span>Oct 01</span><span>Oct 19</span></div></div><div className="rounded-xl border border-[#dde1d8] bg-white p-5"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold tracking-tight">Needs your review</h2><p className="mt-1 text-xs text-[#8a928a]">Keep briefs moving to prospects</p></div><span className="rounded-full bg-[#f3eee2] px-2 py-1 text-[10px] font-semibold text-[#9a6a22]">3 pending</span></div><div className="space-y-3">{['Leon brief', 'Crepes & Waffles brief', 'Namma Yatri sources'].map((item, i) => <div key={item} className="flex items-center gap-3 rounded-lg bg-[#fafbf8] p-2.5"><div className="flex size-7 items-center justify-center rounded-full bg-[#eef1e8] text-[10px] font-semibold text-[#778173]">{i + 1}</div><span className="flex-1 text-xs font-medium">{item}</span><span className="text-[10px] text-[#9aa29a]">{i === 2 ? 'Source check' : '2 days ago'}</span><ChevronRight className="size-3.5 text-[#b1b9af]" /></div>)}</div></div></div>
        </div>
      </section>

      {showRun && <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#101411]/40 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-2xl bg-[#f8f9f4] p-6 shadow-2xl"><div className="flex items-start justify-between"><div><h2 className="text-xl font-semibold tracking-tight">Run a new scout</h2><p className="mt-1 text-sm text-[#788078]">Tell us where to look for the next opportunity.</p></div><button onClick={() => setShowRun(false)} className="rounded-md p-1 text-[#788078] hover:bg-white"><X className="size-4" /></button></div><div className="mt-6 space-y-4"><label className="block text-xs font-medium">Target city<div className="relative mt-1.5"><MapPin className="absolute left-3 top-3 size-4 text-[#9aa29a]" /><input value={city} onChange={(e) => setCity(e.target.value)} className="h-10 w-full rounded-lg border border-[#d9ddd3] bg-white pl-9 pr-3 text-sm outline-none focus:border-[#9aaa39]" /></div></label><label className="block text-xs font-medium">Sector focus<div className="relative mt-1.5"><select value={sector} onChange={(e) => setSector(e.target.value)} className="h-10 w-full appearance-none rounded-lg border border-[#d9ddd3] bg-white px-3 text-sm outline-none focus:border-[#9aaa39]"><option>All sectors</option><option>Mobility</option><option>Food & hospitality</option><option>Education</option><option>Healthcare</option></select><ChevronDown className="pointer-events-none absolute right-3 top-3 size-4 text-[#9aa29a]" /></div></label></div><button onClick={() => setShowRun(false)} className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-[#202522] py-3 text-sm font-medium text-white hover:bg-[#343a36]"><Sparkles className="size-4 text-[#d7f24a]" /> Start scouting</button></div></div>}
    </main>
  )
}
