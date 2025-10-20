import { useState, useCallback } from "react";
import { useAuth } from "./useSupabaseAuth";
import { supabase } from "../supabaseClient";

export function useEmailAuth() {
  const { signIn: signInBase } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await signInBase(email, password);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [signInBase]);

  return {
    signIn,
    loading,
    error,
  };
}

type GoogleSignInOptions = { redirectTo?: string };

export function useGoogleAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const signInWithGoogle = useCallback(async (opts?: GoogleSignInOptions) => {
    setError(null);
    setLoading(true);
    try {
      const res = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: opts?.redirectTo ?? `${window.location.origin}/Arausports/auth-callback.html`,
        },
      });

      try {
        localStorage.setItem("supabase_oauth_last", JSON.stringify({ ts: Date.now(), res }));
      } catch (e) { console.log("oia o erro ai menó \n" + e) }

      console.log("useGoogleAuth signInWithOAuth result:", res);

      const maybeUrl = (res as any)?.data?.url ?? (res as any)?.url ?? (res as any)?.data;
      let urlToOpen: string | null = null;
      if (typeof maybeUrl === "string" && maybeUrl.startsWith("http")) {
        urlToOpen = maybeUrl;
      } else if (maybeUrl && typeof maybeUrl === "object" && typeof (maybeUrl as any).url === "string") {
        urlToOpen = (maybeUrl as any).url;
      }

      if (urlToOpen) {
        window.location.assign(urlToOpen);
        return res;
      }

      return res;
    } catch (err) {
      setError(err);
      try { localStorage.setItem("supabase_oauth_last_error", JSON.stringify({ ts: Date.now(), err: String(err) })); } catch {}
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { signInWithGoogle, loading, error };
}
