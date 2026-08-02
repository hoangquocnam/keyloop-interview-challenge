import { useQuery } from '@tanstack/react-query'
import { fetchApiHealth } from '../../services/health.ts'

const leadChecklist = [
  'Lead inbox with website submissions',
  'Lead detail page with contact history',
  'Follow-up activity logging flow',
]

export const LeadInboxPage = () => {
  const healthQuery = useQuery({
    queryKey: ['api-health'],
    queryFn: fetchApiHealth,
  })

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <p className="eyebrow">Scenario C</p>
        <h1>Sales Lead Management Tool</h1>
        <p className="hero-copy">
          Lightweight monorepo setup for a React frontend and NestJS backend.
          This is the starting point for the interview challenge build.
        </p>
      </section>

      <section className="grid">
        <article className="panel">
          <h2>Frontend direction</h2>
          <ul className="checklist">
            {leadChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <h2>Backend wiring</h2>
          <dl className="meta-list">
            <div>
              <dt>API base URL</dt>
              <dd>{import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'}</dd>
            </div>
            <div>
              <dt>Swagger</dt>
              <dd>http://localhost:3000/docs</dd>
            </div>
            <div>
              <dt>Health check</dt>
              <dd>
                {healthQuery.isLoading && 'Checking API connection...'}
                {healthQuery.isError && 'API is not reachable yet'}
                {healthQuery.data?.status === 'ok' &&
                  `Connected to ${healthQuery.data.service}`}
              </dd>
            </div>
          </dl>
        </article>
      </section>
    </main>
  )
}
