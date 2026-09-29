import { useState, type FormEvent } from 'react'
import './App.css'

type Job = {
  id: string
  company: string
  role: string
}

function App() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')

  function addJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const newJob: Job = {
      id: crypto.randomUUID(),
      company: company.trim(),
      role: role.trim(),
    }

    if (!newJob.company || !newJob.role) return

    setJobs((currentJobs) => [newJob, ...currentJobs])
    setCompany('')
    setRole('')
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">Job tracker</p>
        <h1>Keep your job search in one place.</h1>
        <p>Add a role you want to follow and see it in your list.</p>
      </header>

      <section className="panel" aria-labelledby="add-job-heading">
        <h2 id="add-job-heading">Add a job</h2>
        <form className="job-form" onSubmit={addJob}>
          <label>
            Company
            <input
              autoComplete="organization"
              name="company"
              onChange={(event) => setCompany(event.target.value)}
              placeholder="e.g. Acme"
              required
              value={company}
            />
          </label>
          <label>
            Role
            <input
              name="role"
              onChange={(event) => setRole(event.target.value)}
              placeholder="e.g. Product engineer"
              required
              value={role}
            />
          </label>
          <button type="submit">Add job</button>
        </form>
      </section>

      <section className="panel" aria-labelledby="saved-jobs-heading">
        <h2 id="saved-jobs-heading">Saved jobs</h2>
        {jobs.length === 0 ? (
          <p className="empty-state">No jobs yet. Add one above to get started.</p>
        ) : (
          <ul className="job-list">
            {jobs.map((job) => (
              <li key={job.id}>
                <strong>{job.role}</strong>
                <span>{job.company}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App
