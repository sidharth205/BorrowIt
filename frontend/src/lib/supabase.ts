import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

if (!url || !key) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. Copy frontend/.env.example to frontend/.env.local and fill them in.',
  )
}

// Safe for the browser: the publishable key only allows what Supabase Auth
// allows an anonymous visitor to do. Real authorization happens in our FastAPI backend.
export const supabase = createClient(url, key)