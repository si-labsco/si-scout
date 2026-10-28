import type { AgentRun, City, Decision, ScoutRun, Score, Venture } from '@/data/ventures'
import { pathways, type Pathway, type ScreeningTest, type Stage } from '@/data/pathways'
const statusLabels: Record<Venture['status'], string> = { new: 'New', needs_review: 'Needs decision', proceed: 'Proceed to discovery', hold: 'On hold', declined: 'Declined' }
export const statusLabel = (status: Venture['status']) => statusLabels[status] ?? status
export const decisionLabel = (decision: Decision) => ({ proceed: 'Proceed', hold: 'Hold', decline: 'Decline' })[decision]
export const decisionStatus = (decision: Decision): Venture['status'] => (decision === 'decline' ? 'declined' : decision)
export const slugify = (text: string) => text.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
// A run that has been "running" for over 15 minutes was cut off (e.g. the server function timed out).
export const runStatus = (run?: AgentRun): AgentRun['status'] => run?.status === 'running' && run.startedAt && Date.now() - Date.parse(run.startedAt) > 15 * 60_000 ? 'failed' : run?.status ?? 'not_started'
export const isRunning = (run?: AgentRun) => runStatus(run) === 'running'
export const blankCity = (id: string, name: string): City => ({ id, name, country: '', demandSignals: [], localRivals: [], costFit: 0, talentFit: 0, blockers: [] })
// Every scout run across all cities, newest first.
export const allRuns = (cities: City[]): ScoutRun[] => cities.flatMap((c) => c.runs ?? []).sort((a, b) => b.startedAt.localeCompare(a.startedAt))
export const formatWhen = (iso?: string) => iso ? new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC' : ''
export const formatDate = (iso?: string) => iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }) : ''

// Pathway helpers: the stages, tests and questions that apply to a venture.
export const stagesFor = (pathway: Pathway) => pathways[pathway].stages
export const testsFor = (pathway: Pathway) => pathways[pathway].screeningTests
export const questionsFor = (pathway: Pathway) => pathways[pathway].discoveryQuestions
export const currentStage = (venture: Venture): Stage => stagesFor(venture.pathway).find((s) => s.key === venture.stage) ?? stagesFor(venture.pathway)[0]
export const stageLabel = (venture: Venture) => { const stage = currentStage(venture); return `${pathways[venture.pathway].label} · ${stage.number} ${stage.name}` }

// Vertical fit is not scored: it follows from the venture's verticals (a hard gate on the Investment path).
export const scoreFor = (venture: Venture, test: ScreeningTest): Score =>
  test.derived === 'verticals'
    ? venture.verticals.length ? { result: 'yes', note: venture.verticals.join(', '), confirmed: true } : { result: 'no', note: 'No Si Labs vertical set. Add one on the edit page.', confirmed: true }
    : venture.scores[test.key] ?? { result: 'needs_analysis', note: 'Not screened yet.', confirmed: false }
export const yesCount = (venture: Venture) => testsFor(venture.pathway).filter((t) => scoreFor(venture, t).result === 'yes').length
// The screening decision (status) only matters until a venture moves past screening.
export const inScreening = (venture: Venture) => ['sourcing', 'screening'].includes(venture.stage)
export const resultLabel = (result: Score['result']) => ({ yes: 'Yes', no: 'No', needs_analysis: 'Needs analysis' })[result]

// What stops a venture leaving its current stage. Empty means it can move on.
export function stageBlockers(venture: Venture): string[] {
  const stage = currentStage(venture)
  const outputs = venture.stageOutputs[stage.key] ?? {}
  const blockers: string[] = []
  if (stage.key === 'screening') {
    if (venture.status !== 'proceed') blockers.push('The screening decision must be Proceed.')
    if (venture.pathway === 'undecided') blockers.push('Choose the Investment or Distribution pathway.')
    if (venture.pathway === 'investment' && !venture.verticals.length) blockers.push('Vertical fit is a hard gate: set at least one Si Labs vertical.')
  }
  for (const field of stage.fields) {
    const value = outputs[field.key]?.trim()
    if (field.required && !value) blockers.push(`Fill in “${field.label}”.`)
    else if (value && field.passes && !field.passes.includes(value)) blockers.push(`“${field.label}” is ${value}.`)
  }
  return blockers
}

// The stages a venture can move forward to: the next one, or past it when the next is optional.
export function nextStages(venture: Venture): Stage[] {
  const stages = stagesFor(venture.pathway)
  const next = stages[stages.indexOf(currentStage(venture)) + 1]
  if (!next) return []
  const after = stages[stages.indexOf(next) + 1]
  return next.optional && after ? [next, after] : [next]
}
