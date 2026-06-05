import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.warn('Supabase env vars missing — VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set')
}

// Fall back to placeholder values so the app doesn't crash on bad config.
// Features will silently fail to load until a redeploy with correct vars.
export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  key || 'placeholder'
)
