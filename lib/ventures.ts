import { cities, selectedCityId, type Venture } from '@/data/ventures'
export const city = cities.find((item) => item.id === selectedCityId) ?? cities[0]
export const statusLabel = (status: Venture['status']) => status === 'ready_to_pitch' ? 'Ready to pitch' : status === 'needs_review' ? 'Needs review' : 'New'
export const avgScore = (venture: Venture) => Object.values(venture.scores).reduce((sum, score) => sum + score.value, 0) / 4
