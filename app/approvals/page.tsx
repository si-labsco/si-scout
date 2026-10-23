import { Shell } from '@/components/venture-shell'
import { VentureRow } from '@/components/venture-row'
import { store } from '@/lib/store'
import { decisionLabel } from '@/lib/ventures'
// Screening decisions: shortlisted ventures the research agent has screened, waiting on Proceed / Hold / Decline.
export default async function Approvals(){const rows=(await store.listVentures()).filter(v=>v.stage==='shortlisted'&&v.status==='needs_review');return <Shell active="Approvals"><h1 className="text-3xl font-semibold">Approvals</h1><p className="mt-2 text-sm text-muted-foreground">{rows.length} screened ventures need a decision: proceed to discovery, hold or decline. Open one to see its screening card.</p><div className="mt-8 divide-y divide-foreground/10 overflow-hidden rounded-xl border border-glass-border glass">{rows.map((v,i)=><VentureRow key={v.id} venture={v} index={i} action={<span className="shrink-0 rounded-full bg-glass-strong px-2.5 py-1 text-[11px] font-medium text-muted-foreground">Recommended: {decisionLabel(v.screening.recommendation)}</span>}/>)}{!rows.length && <div className="p-8 text-center text-sm text-subtle">Nothing waiting on a decision.</div>}</div></Shell>}
