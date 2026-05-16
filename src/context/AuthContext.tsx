import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { Profile } from "../types";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  role: "admin" | "member" | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Keep the auth state callback synchronous to avoid missing events.
  // Supabase fires INITIAL_SESSION immediately on subscribe, so this also
  // handles the "on mount, fetch session" requirement without a separate
  // getSession() call (which would cause a double profile fetch).
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);

      // If signed out, clear profile immediately and stop loading.
      if (!nextUser) {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch the profiles row whenever the authenticated user changes.
  // Using a separate effect keeps the auth listener synchronous and gives us
  // a clean cancellation path if the component unmounts mid-request.
  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    setLoading(true);

    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (cancelled) return;
        setProfile(data as Profile | null);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    // onAuthStateChange fires SIGNED_OUT → setUser(null) → setProfile(null)
  }, []);

  // Derived — avoids storing duplicate state that can fall out of sync.
  const role = profile?.role ?? null;

  return (
    <AuthContext.Provider value={{ user, profile, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Internal hook (consumed by useAuth) ─────────────────────────────────────

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside <AuthProvider>");
  return ctx;
}
