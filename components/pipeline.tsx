import Link from 'next/link'
import { ArrowRight, Check, Lock, Save } from 'lucide-react'
import { ActionButton } from '@/components/action-button'
import { ScrollIntoView } from '@/components/scroll-into-view'
import { moveStage, saveStageOutputs, setPathway } from '@/lib/actions'
import { pathways, pathwayKeys, type Stage } from '@/data/pathways'
import type { Venture } from '@/data/ventures'
import { currentStage, formatWhen, nextStages, stageBlockers, stagesFor } from '@/lib/ventures'

const input = 'w-full rounded-lg border border-foreground/15 glass-inset px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent'

// Pathway selector, stage stepper and the selected stage's panel (outputs, gate and history).
export function Pipeline({ venture, selected }: { venture: Venture; selected?: string }) {
  const stages = stagesFor(venture.pathway)
  const current = currentStage(venture)
  const currentIndex = stages.indexOf(current)
  const shown = stages.find((s) => s.key === selected) ?? current
  const visited = new Set(venture.stageHistory.filter((e) => e.pathway === venture.pathway).map((e) => e.to))
  return <section id="pipeline" className="border-b border-foreground/10 py-8">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-xs font-semibold text-muted-foreground">Pipeline</h2>
      <div role="group" aria-label="Pathway" className="inline-flex rounded-full border border-foreground/15 bg-glass p-1 print:hidden">
        {pathwayKeys.map((p) => <form key={p} action={setPathway.bind(null, venture.id, p)}>
          <ActionButton className={`rounded-full px-3 py-1.5 text-xs font-medium ${venture.pathway === p ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>{pathways[p].label}</ActionButton>
        </form>)}
      </div>
    </div>
    <ol className="flex gap-1 overflow-x-auto pb-2">
      {stages.map((stage, i) => {
        const state = i < currentIndex ? (visited.has(stage.key) ? 'done' : 'skipped') : i === currentIndex ? 'current' : 'upcoming'
        return <li key={stage.key} className="min-w-28 flex-1">
          <Link href={`/ventures/${venture.id}?stage=${stage.key}#pipeline`} scroll={false} data-step={shown.key === stage.key ? 'shown' : undefined} aria-current={state === 'current' ? 'step' : undefined} className={`flex h-full flex-col gap-1 rounded-lg border p-2.5 text-xs transition ${shown.key === stage.key ? 'border-accent ring-2 ring-accent/40' : 'border-foreground/10'} ${state === 'current' ? 'bg-accent/25' : state === 'done' ? 'bg-glass-strong' : 'bg-glass'}`}>
            <span className="flex items-center gap-1.5 font-semibold">
              <span className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] ${state === 'done' ? 'bg-primary text-primary-foreground' : state === 'current' ? 'bg-accent text-accent-foreground' : 'border border-foreground/20 text-muted-foreground'}`}>{state === 'done' ? <Check className="size-3" /> : stage.number}</span>
              <span className="leading-tight">{stage.name}</span>
            </span>
            <span className="text-[10px] text-subtle">{state === 'current' ? 'Current' : state === 'done' ? 'Done' : state === 'skipped' ? 'Skipped' : stage.optional ? 'Optional' : 'Upcoming'}</span>
          </Link>
        </li>
      })}
    </ol>
    <ScrollIntoView selector="[data-step=shown]" />
    <StagePanel venture={venture} stage={shown} isCurrent={shown.key === current.key} />
  </section>
}

function StagePanel({ venture, stage, isCurrent }: { venture: Venture; stage: Stage; isCurrent: boolean }) {
  const outputs = venture.stageOutputs[stage.key] ?? {}
  const blockers = isCurrent ? stageBlockers(venture) : []
  const history = venture.stageHistory.filter((e) => e.to === stage.key || e.from === stage.key).slice().reverse()
  const stages = stagesFor(venture.pathway)
  const before = stages.indexOf(stage) < stages.indexOf(currentStage(venture))
  return <div className="glass mt-4 rounded-xl border p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 className="text-lg font-semibold">{stage.number} · {stage.name}{stage.optional && <span className="ml-2 rounded-full bg-glass-strong px-2 py-0.5 text-[10px] font-medium text-muted-foreground">Optional</span>}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{stage.purpose}</p>
        <p className="mt-1 text-xs text-subtle">Output: {stage.output}</p>
      </div>
      {!isCurrent && before && <form action={moveStage.bind(null, venture.id, stage.key)} className="print:hidden"><ActionButton className="rounded-full border border-foreground/15 bg-glass px-3 py-1.5 text-xs font-medium">Move back to this stage</ActionButton></form>}
    </div>
    {stage.key === 'screening' && <p className="mt-4 text-sm text-muted-foreground">The screening card is below. {isCurrent && 'Confirm each test, then record the decision with Proceed / Hold / Decline at the bottom of the page.'} <a href="#screening" className="underline decoration-accent underline-offset-4">Go to screening</a></p>}
    {stage.fields.length > 0 && <form action={saveStageOutputs.bind(null, venture.id, stage.key)} className="mt-5 flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {stage.fields.map((f) => <label key={f.key} className={`flex flex-col gap-1.5 text-xs font-medium ${f.kind === 'textarea' ? 'sm:col-span-2' : ''}`}>
          <span>{f.label}{f.required && <span className="text-accent-foreground"> *</span>}</span>
          {f.hint && <span className="font-normal text-subtle">{f.hint}</span>}
          {f.kind === 'textarea' ? <textarea name={f.key} defaultValue={outputs[f.key] ?? ''} rows={3} className={input} />
            : f.kind === 'select' ? <select name={f.key} defaultValue={outputs[f.key] ?? ''} className={input}><option value="">Not set</option>{f.options?.map((o) => <option key={o}>{o}</option>)}</select>
            : <input name={f.key} type={f.kind === 'date' ? 'date' : 'text'} defaultValue={outputs[f.key] ?? ''} className={input} />}
        </label>)}
      </div>
      <div className="print:hidden"><ActionButton className="rounded-full border border-foreground/15 bg-glass px-4 py-2 text-xs font-medium"><Save className="size-3.5" />Save stage outputs</ActionButton></div>
    </form>}
    {isCurrent && <MoveOn venture={venture} blockers={blockers} />}
    {history.length > 0 && <div className="mt-5 border-t border-foreground/10 pt-4">
      <h4 className="text-xs font-semibold text-muted-foreground">History</h4>
      <ul className="mt-2 flex flex-col gap-1 text-xs text-subtle">{history.map((e, i) => <li key={`${e.at}-${i}`}>{formatWhen(e.at)} · {describe(e, venture)} · {e.by}</li>)}</ul>
    </div>}
  </div>
}

// The gate: "Move to <next>" is enabled only once the current stage's outputs are complete.
function MoveOn({ venture, blockers }: { venture: Venture; blockers: string[] }) {
  const next = nextStages(venture)
  if (!next.length) return venture.pathway === 'undecided'
    ? <p className="mt-5 text-sm text-muted-foreground">Choose the Investment or Distribution pathway above to continue past screening.</p>
    : <p className="mt-5 text-sm text-muted-foreground">This is the last stage.</p>
  return <div className="mt-5 flex flex-col gap-3 border-t border-foreground/10 pt-4 print:hidden">
    <div className="flex flex-wrap gap-2">{next.map((stage, i) => blockers.length
      ? <button key={stage.key} disabled className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-primary/40 px-4 py-2 text-xs font-medium text-primary-foreground"><Lock className="size-3.5" />{i ? 'Skip' : 'Move'} to {stage.number} {stage.name}</button>
      : <form key={stage.key} action={moveStage.bind(null, venture.id, stage.key)}><ActionButton className={`rounded-full px-4 py-2 text-xs font-medium ${i ? 'border border-foreground/15 bg-glass' : 'bg-primary text-primary-foreground'}`}>{i ? 'Skip' : 'Move'} to {stage.number} {stage.name}<ArrowRight className="size-3.5" /></ActionButton></form>)}
    </div>
    {blockers.length > 0 && <ul className="flex flex-col gap-1 text-xs text-muted-foreground">{blockers.map((b) => <li key={b}>• {b}</li>)}</ul>}
  </div>
}

const stageName = (venture: Venture, pathway: Venture['pathway'], key?: string) => stagesFor(pathway).find((s) => s.key === key)?.name ?? key ?? ''
function describe(e: Venture['stageHistory'][number], venture: Venture) {
  if (e.fromPathway && e.fromPathway !== e.pathway) return `Pathway changed from ${pathways[e.fromPathway].label} to ${pathways[e.pathway].label} (now ${stageName(venture, e.pathway, e.to)})`
  return e.from ? `Moved from ${stageName(venture, e.pathway, e.from)} to ${stageName(venture, e.pathway, e.to)}` : `Entered at ${stageName(venture, e.pathway, e.to)}`
}
