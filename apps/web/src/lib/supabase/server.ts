// ============================================================
// RareSignal — Supabase Server Client (for API routes & RSC)
// ============================================================
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient as createJsClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client that respects the current user's session.
 * Use this in Server Components, Route Handlers, and Server Actions.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method is called from a Server Component where
            // cookies cannot be set. This can be safely ignored when the
            // middleware is correctly refreshing the session.
          }
        },
      },
    }
  );
}

/** @deprecated Use createClient() instead */
export const createServerSupabaseClient = createClient;

/**
 * Admin Supabase client using the service role key.
 * Bypasses RLS — use only for trusted server-side operations.
 */
export function createAdminClient() {
  return createJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/** @deprecated Use createAdminClient() instead */
export const createServiceRoleClient = createAdminClient;
