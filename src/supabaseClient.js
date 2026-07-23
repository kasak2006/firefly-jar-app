import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase env vars. Copy .env.example to .env and fill in your project URL + anon key.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// The address auth emails (confirmation, password reset) should send people back to.
// Prefer an explicit, deployed URL so links never bake in whatever localhost dev
// server happened to be open at signup time. Falls back to the current origin.
export const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin
