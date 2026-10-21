import { Shell, VentureRow } from '@/components/venture-shell'
import { ventures } from '@/data/ventures'
export default function Approvals(){const rows=ventures.filter(v=>v.status==='needs_review');return <Shell active="Approvals"><h1 className="text-3xl font-semibold">Approvals</h1><p className="mt-2 text-sm text-muted-foreground">{rows.length} ventures need your review.</p><div className="mt-8 divide-y divide-foreground/10 overflow-hidden rounded-xl border border-glass-border glass">{rows.map((v,i)=><VentureRow key={v.id} venture={v} index={i}/>)}</div></Shell>}
