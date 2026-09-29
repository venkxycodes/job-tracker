import { useEffect, useState, type FormEvent } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth'
import { collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { auth, configured, db, googleProvider } from './firebase'
import { currentRound, effectiveStatus, localDate, newRound, parseApplication, STATUSES, withStatus, type Application, type Round, type RoundStatus, type Status } from './domain'
import { ChoiceSelect, DateField } from './Fields'
import './App.css'

type Page = 'Applications' | 'Interviews'
type Draft = { company: string; role: string; applicationDate: string; status: Status }
const emptyDraft = (): Draft => ({ company: '', role: '', applicationDate: localDate(), status: 'Applied' })
const dateLabel = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
const errorText = (error: unknown) => error instanceof Error ? error.message : 'Something went wrong. Please try again.'

function RoundEditor({ round, index, total, saving, onSave, onMove }: { round: Round; index: number; total: number; saving: boolean; onSave: (round: Round) => Promise<void>; onMove: (direction: -1 | 1) => void }) {
  const [draft, setDraft] = useState(round)
  const changed = JSON.stringify(draft) !== JSON.stringify(round)
  return <form className="round-editor" onSubmit={(event) => { event.preventDefault(); if (draft.name.trim()) void onSave({ ...draft, name: draft.name.trim() }) }}>
    <div className="round-heading"><span className="round-number">{String(index + 1).padStart(2, '0')}</span><strong>{round.name}</strong><span className={`pill ${round.status.toLowerCase()}`}>{round.status}</span></div>
    <div className="round-fields">
      <label>Round name<input aria-label={`Name for round ${index + 1}`} required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
      <div className="field"><span className="field-label">Status</span><ChoiceSelect label={`Status for ${round.name}`} value={draft.status} onChange={(value) => setDraft({ ...draft, status: value as RoundStatus })} options={['Upcoming', 'Completed', 'Skipped']} /></div>
      <div className="field"><span className="field-label">Scheduled date and time</span><DateField label={`Schedule for ${round.name}`} value={draft.scheduledAt} onChange={(value) => setDraft({ ...draft, scheduledAt: value })} withTime /></div>
      <label className="notes-field">Notes<textarea aria-label={`Notes for ${round.name}`} rows={2} value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} placeholder="People, prep, or follow-up details" /></label>
    </div>
    <div className="round-actions"><div><button type="button" className="text-button" disabled={saving || index === 0} onClick={() => onMove(-1)}>Move up</button><button type="button" className="text-button" disabled={saving || index === total - 1} onClick={() => onMove(1)}>Move down</button></div><button type="submit" className="secondary-button" disabled={saving || !changed}>{saving ? 'Saving…' : 'Save round'}</button></div>
  </form>
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [retry, setRetry] = useState(0)
  const [applications, setApplications] = useState<Application[]>([])
  const [page, setPage] = useState<Page>('Applications')
  const [editing, setEditing] = useState<Application | 'new' | null>(null)
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [today, setToday] = useState(localDate())

  useEffect(() => onAuthStateChanged(auth, (next) => { setUser(next); setAuthLoading(false); setError(''); setApplications([]); setLoading(!!next) }, (err) => { setAuthLoading(false); setError(errorText(err)) }), [])
  useEffect(() => {
    if (!user) return
    return onSnapshot(collection(db, 'users', user.uid, 'applications'), (snapshot) => {
      const valid = snapshot.docs.map((item) => parseApplication(item.id, item.data())).filter((item): item is Application => item !== null)
      setApplications(valid)
      setLoading(false)
      if (valid.length !== snapshot.size) setError('Some saved applications could not be read. Please check their data.')
    }, (err) => { setError(`Could not load applications: ${errorText(err)}`); setLoading(false) })
  }, [user, retry])
  useEffect(() => {
    const refresh = () => setToday(localDate())
    const timer = window.setInterval(refresh, 30_000)
    window.addEventListener('focus', refresh)
    return () => { window.clearInterval(timer); window.removeEventListener('focus', refresh) }
  }, [])

  const path = (id: string) => doc(db, 'users', user!.uid, 'applications', id)
  const act = async (key: string, action: () => Promise<void>, success: string) => {
    setBusy(key); setError(''); setNotice('')
    try { await action(); setNotice(success); return true }
    catch (err) { setError(errorText(err)); return false }
    finally { setBusy(null) }
  }
  const startAdd = () => { setDraft(emptyDraft()); setEditing('new'); setError('') }
  const startEdit = (app: Application) => { setDraft({ company: app.company, role: app.role, applicationDate: app.applicationDate, status: app.status }); setEditing(app); setError('') }
  const saveApplication = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const company = draft.company.trim(), role = draft.role.trim()
    if (!company || !role) { setError('Company and role are required.'); return }
    const now = Date.now()
    if (editing === 'new') {
      const id = crypto.randomUUID()
      const app: Application = { id, company, role, applicationDate: draft.applicationDate, status: 'Applied', appliedStageStartedAt: draft.applicationDate, initialAppliedStage: true, rounds: [], createdAt: now, updatedAt: now }
      const saved = await act(id, () => setDoc(path(id), app), 'Application added.')
      if (saved) setEditing(null)
    } else if (editing) {
      const base = withStatus(editing, draft.status, today)
      const appliedStageStartedAt = editing.status === 'Applied' && base.status === 'Applied' && base.appliedStageStartedAt === editing.appliedStageStartedAt && editing.initialAppliedStage ? draft.applicationDate : base.appliedStageStartedAt
      const saved = await act(editing.id, () => updateDoc(path(editing.id), { company, role, applicationDate: draft.applicationDate, status: base.status, appliedStageStartedAt, initialAppliedStage: base.initialAppliedStage, rounds: base.rounds, updatedAt: now }), 'Application updated.')
      if (saved) setEditing(null)
    }
  }
  const changeStatus = (app: Application, status: Status) => act(app.id, async () => {
    const next = withStatus(app, status, today)
    await updateDoc(path(app.id), { status: next.status, appliedStageStartedAt: next.appliedStageStartedAt, initialAppliedStage: next.initialAppliedStage, rounds: next.rounds, updatedAt: Date.now() })
  }, `Moved to ${status}.`)
  const saveRounds = (app: Application, rounds: Round[], message: string) => act(app.id, () => updateDoc(path(app.id), { rounds, updatedAt: Date.now() }), message)
  const removeApplication = async (app: Application) => {
    if (!window.confirm(`Delete ${app.role} at ${app.company}? This also deletes its interview history.`)) return
    const deleted = await act(app.id, () => deleteDoc(path(app.id)), 'Application deleted.')
    if (deleted) setEditing(null)
  }
  const sorted = [...applications].sort((a, b) => b.updatedAt - a.updatedAt)
  const interviewApps = sorted.filter((app) => effectiveStatus(app, today) === 'Interview')

  if (!configured) return <main className="setup-screen"><div className="brand">track<span>·</span></div><div className="setup-card"><p className="eyebrow">Setup needed</p><h1>Connect your Firebase project</h1><p>Copy <code>.env.example</code> to <code>.env.local</code>, fill in your Firebase web app settings, then restart the app. See the README for setup steps.</p></div></main>
  if (authLoading) return <main className="center-state">Checking your sign-in…</main>
  if (!user) return <main className="sign-in"><div className="brand">track<span>·</span></div><div className="sign-in-content"><p className="eyebrow">Your job search, in focus</p><h1>Every application.<br /><em>One clear view.</em></h1><p>Keep your applications moving and see what comes next in every interview.</p><button className="primary-button" onClick={() => void act('sign-in', () => signInWithPopup(auth, googleProvider).then(() => {}), 'Signed in.') } disabled={!!busy}>Continue with Google <span aria-hidden="true">↗</span></button>{error && <p className="error" role="alert">{error}</p>}</div><div className="sign-in-footer">A calmer way to keep track of what matters.</div></main>

  return <div className="app-shell">
    <header className="topbar"><div className="brand">track<span>·</span></div><nav aria-label="Primary navigation"><button className={page === 'Applications' ? 'active' : ''} onClick={() => setPage('Applications')}>Applications</button><button className={page === 'Interviews' ? 'active' : ''} onClick={() => setPage('Interviews')}>Interviews <span className="nav-count">{interviewApps.length}</span></button></nav><div className="account"><span title={user.email || ''}>{user.displayName || user.email}</span><button className="text-button" onClick={() => void signOut(auth).catch((err) => setError(errorText(err)))}>Sign out</button></div></header>
    <main className="workspace">
      {error && <div className="error banner" role="alert">{error} <button className="text-button" onClick={() => { setError(''); setLoading(true); setRetry((n) => n + 1) }}>Retry loading</button></div>}
      {notice && <div className="notice" role="status">{notice}<button aria-label="Dismiss notice" onClick={() => setNotice('')}>×</button></div>}
      <div className="page-title"><div><p className="eyebrow">Your search workspace</p><h1>{page}</h1><p>{page === 'Applications' ? 'See where every opportunity stands.' : 'Stay ready for the next conversation.'}</p></div>{page === 'Applications' ? <button className="primary-button" onClick={startAdd}>+ Add application</button> : <button className="primary-button" onClick={() => setPage('Applications')}>View applications</button>}</div>
      {loading ? <div className="center-state">Loading your applications…</div> : page === 'Applications' ? <>
        {applications.length === 0 && <div className="empty-banner"><strong>Your search starts here.</strong><span>Add an application to see it move across your board.</span><button className="secondary-button" onClick={startAdd}>Add your first application</button></div>}
        <div className="board" aria-label="Applications board">{STATUSES.map((status) => {
          const cards = sorted.filter((app) => effectiveStatus(app, today) === status)
          return <section className={`column column-${status.toLowerCase()}`} key={status} aria-label={`${status}, ${cards.length} applications`}><div className="column-heading"><div><span className="status-mark" /><h2>{status}</h2></div><span className="column-count">{cards.length}</span></div><div className="column-body">{cards.length ? cards.map((app) => <article className="application-card" key={app.id}><button className="card-open" onClick={() => startEdit(app)} aria-label={`Edit ${app.role} at ${app.company}`}><span className="company-icon">{app.company.slice(0, 1).toUpperCase()}</span><strong>{app.company}</strong><span className="role">{app.role}</span><span className="card-detail">Applied {dateLabel(app.applicationDate)}</span>{status === 'Interview' && <span className="card-detail accent">{currentRound(app.rounds)?.name || 'No upcoming round'}</span>}{status === 'Ghosted' && app.status === 'Applied' && <span className="auto-tag">Auto-ghosted · 45 days</span>}{status !== 'Interview' && app.rounds.length > 0 && <span className="card-detail">{app.rounds.length} interview {app.rounds.length === 1 ? 'round' : 'rounds'} saved</span>}</button><div className="status-control"><span>Move to</span><ChoiceSelect label={`Move ${app.company} to status`} value={app.status === 'Applied' && status === 'Ghosted' ? 'Ghosted' : app.status} disabled={busy === app.id} onChange={(value) => void changeStatus(app, value as Status)} options={STATUSES} compact /></div></article>) : <p className="column-empty">No applications here yet.</p>}</div></section>
        })}</div>
      </> : interviewApps.length === 0 ? <div className="empty-banner"><strong>No active interviews yet.</strong><span>Move an application to Interview when a company reaches out.</span><button className="secondary-button" onClick={() => setPage('Applications')}>Go to applications</button></div> : <div className="interview-list">{interviewApps.map((app) => <section className="interview-card" key={app.id}><div className="interview-top"><div><p className="eyebrow">Interview in progress</p><h2>{app.company}</h2><p>{app.role}</p></div><button className="text-button" onClick={() => { setPage('Applications'); startEdit(app) }}>Edit application ↗</button></div><div className="next-round"><span>Current round</span><strong>{currentRound(app.rounds)?.name || 'No upcoming round'}</strong></div><div className="timeline">{app.rounds.map((round, index) => <RoundEditor key={`${round.id}-${JSON.stringify(round)}`} round={round} index={index} total={app.rounds.length} saving={busy === app.id} onSave={async (updated) => { await saveRounds(app, app.rounds.map((item) => item.id === updated.id ? updated : item), 'Round updated.') }} onMove={(direction) => { const rounds = [...app.rounds]; const other = index + direction; [rounds[index], rounds[other]] = [rounds[other], rounds[index]]; void saveRounds(app, rounds, 'Round order updated.') }} />)}</div><button className="secondary-button" disabled={busy === app.id} onClick={() => void saveRounds(app, [...app.rounds, newRound(app.rounds.length + 1)], 'Round added.')}>+ Add round</button></section>)}</div>}
    </main>
    {editing && <div className="modal-backdrop" onKeyDown={(event) => { if (event.key === 'Escape' && !busy) setEditing(null) }} onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) setEditing(null) }}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="edit-title"><div className="modal-top"><div><p className="eyebrow">Application details</p><h2 id="edit-title">{editing === 'new' ? 'Add application' : 'Edit application'}</h2></div><button className="close-button" aria-label="Close" onClick={() => setEditing(null)}>×</button></div><form className="application-form" onSubmit={(event) => void saveApplication(event)}><label>Company<input required autoFocus autoComplete="organization" value={draft.company} onChange={(event) => setDraft({ ...draft, company: event.target.value })} placeholder="e.g. Acme" /></label><label>Role<input required value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value })} placeholder="e.g. Product engineer" /></label><div className="field"><span className="field-label">Application date</span><DateField label="Application date" value={draft.applicationDate} onChange={(value) => setDraft({ ...draft, applicationDate: value })} /></div>{editing !== 'new' && <div className="field"><span className="field-label">Status</span><ChoiceSelect label="Application status" value={draft.status} onChange={(value) => setDraft({ ...draft, status: value as Status })} options={STATUSES} /></div>}{editing !== 'new' && editing.rounds.length > 0 && <p className="history-note">Interview history: {editing.rounds.map((round) => `${round.name} (${round.status})`).join(' · ')}. Move to Interview to edit rounds.</p>}{error && <p className="error" role="alert">{error}</p>}<div className="modal-actions">{editing !== 'new' && <button type="button" className="delete-button" disabled={!!busy} onClick={() => void removeApplication(editing)}>Delete</button>}<button type="button" className="text-button" onClick={() => setEditing(null)}>Cancel</button><button className="primary-button" type="submit" disabled={!!busy}>{busy ? 'Saving…' : editing === 'new' ? 'Add application' : 'Save changes'}</button></div></form></div></div>}
  </div>
}

export default App
