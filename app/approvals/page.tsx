import { Shell, VentureRow } from '@/components/venture-shell'
import { ventures } from '@/data/ventures'
export default function Approvals(){const rows=ventures.filter(v=>v.status==='needs_review');return <Shell active="Approvals"><h1 className="text-3xl font-semibold">Approvals</h1><p className="mt-2 text-sm text-[#788078]">{rows.length} ventures need your review.</p><div className="mt-8 divide-y divide-[#e6e9e2] overflow-hidden rounded-xl border border-[#dde1d8] bg-[#fbfcf8]">{rows.map((v,i)=><VentureRow key={v.id} venture={v} index={i}/>)}</div></Shell>}
