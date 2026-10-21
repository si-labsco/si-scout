import type { AgentRun, City, Venture } from '@/data/ventures'
export const statusLabel = (status: Venture['status']) => status === 'ready_to_pitch' ? 'Ready to pitch' : status === 'needs_review' ? 'Needs review' : 'New'
export const avgScore = (venture: Venture) => Object.values(venture.scores).reduce((sum, score) => sum + score.value, 0) / 4
export const slugify = (text: string) => text.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
// A run that has been "running" for over 15 minutes was cut off (e.g. the server function timed out).
export const runStatus = (run?: AgentRun): AgentRun['status'] => run?.status === 'running' && run.startedAt && Date.now() - Date.parse(run.startedAt) > 15 * 60_000 ? 'failed' : run?.status ?? 'not_started'
export const isRunning = (run?: AgentRun) => runStatus(run) === 'running'
export const blankCity = (id: string, name: string): City => ({ id, name, country: '', demandSignals: [], localRivals: [], costFit: 0, talentFit: 0, blockers: [] })
