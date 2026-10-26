import { screeningTests, type AgentRun, type City, type Decision, type ScoutRun, type Venture } from '@/data/ventures'
const statusLabels: Record<Venture['status'], string> = { new: 'New', needs_review: 'Needs decision', proceed: 'Proceed to discovery', hold: 'On hold', declined: 'Declined' }
export const statusLabel = (status: Venture['status']) => statusLabels[status] ?? status
export const decisionLabel = (decision: Decision) => ({ proceed: 'Proceed', hold: 'Hold', decline: 'Decline' })[decision]
export const decisionStatus = (decision: Decision): Venture['status'] => (decision === 'decline' ? 'declined' : decision)
export const avgScore = (venture: Venture) => screeningTests.reduce((sum, { key }) => sum + (venture.scores[key]?.value ?? 0), 0) / screeningTests.length
export const slugify = (text: string) => text.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
// A run that has been "running" for over 15 minutes was cut off (e.g. the server function timed out).
export const runStatus = (run?: AgentRun): AgentRun['status'] => run?.status === 'running' && run.startedAt && Date.now() - Date.parse(run.startedAt) > 15 * 60_000 ? 'failed' : run?.status ?? 'not_started'
export const isRunning = (run?: AgentRun) => runStatus(run) === 'running'
export const blankCity = (id: string, name: string): City => ({ id, name, country: '', demandSignals: [], localRivals: [], costFit: 0, talentFit: 0, blockers: [] })
// Every scout run across all cities, newest first.
export const allRuns = (cities: City[]): ScoutRun[] => cities.flatMap((c) => c.runs ?? []).sort((a, b) => b.startedAt.localeCompare(a.startedAt))
export const formatWhen = (iso?: string) => iso ? new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC' : ''
export const formatDate = (iso?: string) => iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }) : ''
