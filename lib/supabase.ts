import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | undefined
let _adminClient: SupabaseClient | undefined

export function getSupabase(): SupabaseClient {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _client
}

// Server-side only — uses service role key, bypasses RLS. Never call from client components.
export function getSupabaseAdmin(): SupabaseClient {
  if (!_adminClient) {
    _adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }
  return _adminClient
}
