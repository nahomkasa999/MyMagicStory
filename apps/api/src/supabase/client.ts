// apps/api/src/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

// Note: These environment variables need to be set in your Hono app's environment.
// For example, in a .env file at the root of the `apps/api` directory.
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)