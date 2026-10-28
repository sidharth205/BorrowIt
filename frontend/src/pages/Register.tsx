import { useState, type SyntheticEvent } from 'react'
import { Link } from 'react-router-dom'
import { friendlyAuthError } from '../auth/errors'
import { supabase } from '../lib/supabase'

export default function Register() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (displayName.trim().length < 1 || displayName.trim().length > 80) {
      setError('Name must be between 1 and 80 characters.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setSubmitting(true)
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { display_name: displayName.trim() },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    })
    setSubmitting(false)

    if (signUpError) {
      setError(friendlyAuthError(signUpError))
      return
    }
    // Same message whether or not the email already exists, so the form
    // cannot be used to discover which emails have accounts.
    setDone(true)
  }

  if (done) {
    return (
      <main className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-semibold text-slate-900">Check your email</h1>
        <p className="mt-3 text-slate-700">
          If this address can be registered, we sent a confirmation link to it. Open the
          link, then sign in.
        </p>
        <Link to="/login" className="mt-6 inline-block text-blue-700 underline">
          Go to sign in
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold text-slate-900">Create your account</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            maxLength={80}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Password (at least 8 characters)
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-blue-700 px-4 py-2 font-medium text-white disabled:opacity-60"
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-700 underline">
          Sign in
        </Link>
      </p>
    </main>
  )
}