export const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected', 'Ghosted'] as const
export type Status = (typeof STATUSES)[number]
export type RoundStatus = 'Upcoming' | 'Completed' | 'Skipped'
export type Round = { id: string; name: string; status: RoundStatus; scheduledAt: string; notes: string }
export type Application = {
  id: string
  company: string
  role: string
  applicationDate: string
  status: Status
  appliedStageStartedAt: string
  initialAppliedStage: boolean
  rounds: Round[]
  createdAt: number
  updatedAt: number
}

export function localDate(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function effectiveStatus(app: Application, today = localDate()): Status {
  if (app.status !== 'Applied') return app.status
  const [year, month, day] = app.appliedStageStartedAt.split('-').map(Number)
  const threshold = new Date(year, month - 1, day + 45)
  return today > localDate(threshold) ? 'Ghosted' : 'Applied'
}

export function currentRound(rounds: Round[]): Round | undefined {
  return rounds.find((round) => round.status === 'Upcoming')
}

export function newRound(index: number): Round {
  return { id: crypto.randomUUID(), name: `Round ${index}`, status: 'Upcoming', scheduledAt: '', notes: '' }
}

export function withStatus(app: Application, status: Status, today = localDate()): Application {
  return {
    ...app,
    status,
    initialAppliedStage: status === 'Applied' ? (app.status === 'Applied' && app.initialAppliedStage && effectiveStatus(app, today) !== 'Ghosted') : false,
    appliedStageStartedAt: status === 'Applied' && (app.status !== 'Applied' || effectiveStatus(app, today) === 'Ghosted') ? today : app.appliedStageStartedAt,
    rounds: status === 'Interview' && app.rounds.length === 0 ? [newRound(1)] : app.rounds,
  }
}

const isDate = (value: unknown): value is string => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}

export function parseApplication(id: string, data: Record<string, unknown>): Application | null {
  if (typeof data.company !== 'string' || !data.company.trim() || typeof data.role !== 'string' || !data.role.trim() || !isDate(data.applicationDate) || !isDate(data.appliedStageStartedAt) || !STATUSES.includes(data.status as Status) || !Array.isArray(data.rounds)) return null
  const rounds: Round[] = []
  for (const value of data.rounds) {
    if (!value || typeof value !== 'object') return null
    const round = value as Record<string, unknown>
    if (typeof round.id !== 'string' || typeof round.name !== 'string' || !['Upcoming', 'Completed', 'Skipped'].includes(String(round.status)) || typeof round.scheduledAt !== 'string' || typeof round.notes !== 'string') return null
    rounds.push({ id: round.id, name: round.name, status: round.status as RoundStatus, scheduledAt: round.scheduledAt, notes: round.notes })
  }
  return { id, company: data.company, role: data.role, applicationDate: data.applicationDate, status: data.status as Status, appliedStageStartedAt: data.appliedStageStartedAt, initialAppliedStage: data.initialAppliedStage === true, rounds, createdAt: Number(data.createdAt) || 0, updatedAt: Number(data.updatedAt) || 0 }
}
