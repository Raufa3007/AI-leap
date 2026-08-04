import { createBrowserClient } from "@supabase/ssr"

const SUPABASE_URL = "https://hcwsdskgzgwrhvqnjwno.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhjd3Nkc2tnemd3cmh2cW5qd25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTM4NjIsImV4cCI6MjA3NjU2OTg2Mn0.dy12fRXWz7JFpR5XT2bRIMDQWl8cR6WPEpCpHIBbKSA"

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }
  return supabaseClient
}
