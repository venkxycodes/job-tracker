import test from 'node:test'
import assert from 'node:assert/strict'
import { currentRound, effectiveStatus, withStatus } from '../src/domain.ts'

const application = {
  id: 'a', company: 'Acme', role: 'Engineer', applicationDate: '2026-01-01',
  status: 'Applied', appliedStageStartedAt: '2026-01-01', initialAppliedStage: true,
  rounds: [], createdAt: 0, updatedAt: 0,
}

test('ghosted only after 45 full local calendar days', () => {
  assert.equal(effectiveStatus(application, '2026-02-15'), 'Applied')
  assert.equal(effectiveStatus(application, '2026-02-16'), 'Ghosted')
  assert.equal(effectiveStatus({ ...application, status: 'Offer' }, '2026-12-01'), 'Offer')
})

test('interview round is created once and survives an outcome', () => {
  const interviewing = withStatus(application, 'Interview', '2026-01-02')
  assert.equal(interviewing.rounds.length, 1)
  assert.equal(withStatus(interviewing, 'Interview').rounds.length, 1)
  assert.equal(withStatus(withStatus(interviewing, 'Offer'), 'Interview').rounds.length, 1)
})

test('returning to Applied resets its ghosting clock', () => {
  const ghosted = withStatus(application, 'Applied', '2026-03-01')
  assert.equal(ghosted.appliedStageStartedAt, '2026-03-01')
  assert.equal(ghosted.initialAppliedStage, false)
  assert.equal(effectiveStatus(ghosted, '2026-03-02'), 'Applied')
})

test('current round skips completed and skipped rounds', () => {
  const rounds = [
    { id: '1', name: 'Screen', status: 'Completed', scheduledAt: '', notes: '' },
    { id: '2', name: 'Technical', status: 'Skipped', scheduledAt: '', notes: '' },
    { id: '3', name: 'Team', status: 'Upcoming', scheduledAt: '', notes: '' },
  ]
  assert.equal(currentRound(rounds)?.name, 'Team')
})
