import { Shell } from '@/components/venture-shell'
import { ventures } from '@/data/ventures'
import { VentureRow } from '@/components/venture-shell'
export default function Catalogue(){return <Shell active="Catalogue"><h1 className="text-3xl font-semibold tracking-[-0.04em]">Catalogue</h1><p className="mt-2 text-sm text-[#788078]">Every venture in your working catalogue.</p><div className="mt-8 divide-y divide-[#e6e9e2] overflow-hidden rounded-xl border border-[#dde1d8] bg-[#fbfcf8]">{ventures.map((v,i)=><VentureRow key={v.id} venture={v} index={i}/>)}</div></Shell>}
