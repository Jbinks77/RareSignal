"use client";

// ============================================================
// RareSignal — Auth Provider (wraps app with Supabase listener)
// ============================================================
import { useEffect } from "react";
import { createClient } from "./client";
import { useAppStore } from "../store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAppStore((s) => s.setUser);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
          .then(({ data: profile }) => {
            setUser({
              id: user.id,
              email: user.email!,
              displayName: profile?.display_name || user.email!.split("@")[0],
              avatarUrl: profile?.avatar_url || null,
              plan: profile?.plan || "free",
            });
          });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        setUser({
          id: session.user.id,
          email: session.user.email!,
          displayName: profile?.display_name || session.user.email!.split("@")[0],
          avatarUrl: profile?.avatar_url || null,
          plan: profile?.plan || "free",
        });
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return <>{children}</>;
}
