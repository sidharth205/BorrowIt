import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getHealth, type HealthResponse } from '../lib/api'

type State =
  | { kind: 'loading' }
  | { kind: 'ready'; health: HealthResponse }
  | { kind: 'error' }

export default function Home() {
  const [state, setState] = useState<State>({ kind: 'loading' })

  useEffect(() => {
    getHealth()
      .then((health) => setState({ kind: 'ready', health }))
      .catch(() => setState({ kind: 'error' }))
  }, [])

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold text-slate-900">BorrowBuddy</h1>
      <p className="mt-2 text-slate-600">Setup check: is everything connected?</p>
      <p className="mt-4 space-x-4">
        <Link to="/login" className="text-blue-700 underline">
          Sign in
        </Link>
        <Link to="/register" className="text-blue-700 underline">
          Create account
        </Link>
      </p>

      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
        {state.kind === 'loading' && <p>Checking the backend…</p>}
        {state.kind === 'error' && (
          <p className="text-red-700">
            Cannot reach the backend. Is it running, and does VITE_API_URL
            point to it?
          </p>
        )}
        {state.kind === 'ready' && (
          <ul className="space-y-1">
            <li>Backend: {state.health.status}</li>
            <li>Database: {state.health.database}</li>
          </ul>
        )}
      </div>
    </main>
  )
}