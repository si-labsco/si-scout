import { Shell } from '@/components/venture-shell'
import { ventures } from '@/data/ventures'
import { VentureRow } from '@/components/venture-shell'
export default function Catalogue(){return <Shell active="Catalogue"><h1 className="text-3xl font-semibold">Catalogue</h1><p className="mt-2 text-sm text-muted-foreground">Every venture in your working catalogue.</p><div className="mt-8 divide-y divide-foreground/10 overflow-hidden rounded-xl border border-glass-border glass">{ventures.map((v,i)=><VentureRow key={v.id} venture={v} index={i}/>)}</div></Shell>}
