import { useAuth } from '../auth/auth-context'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const name = (user?.user_metadata?.display_name as string | undefined) ?? 'there'

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold text-slate-900">Hello, {name}</h1>
      <p className="mt-2 text-slate-600">Signed in as {user?.email}</p>
      <p className="mt-6 text-slate-600">
        This page is only visible when you are signed in. Listings and bookings will
        appear here in later steps.
      </p>
      <button
        onClick={() => void signOut()}
        className="mt-8 rounded-md border border-slate-300 px-4 py-2 text-slate-800"
      >
        Sign out
      </button>
    </main>
  )
}