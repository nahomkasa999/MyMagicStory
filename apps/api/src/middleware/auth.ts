import { createClient } from "@supabase/supabase-js";
import type { Context, Next } from "hono";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function supabaseAuth(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) return c.text("Unauthorized", 401);

  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) return c.text("Unauthorized", 401);

  c.set("user", user);
  await next();
}
