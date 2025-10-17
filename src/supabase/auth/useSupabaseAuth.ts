import { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

async function ensureUserRow(user: SupabaseUser | null) {
  if (!user) return;
  try {
    const metadata = (user.user_metadata ?? {}) as Record<string, any>;

    const nome =
      metadata.full_name ?? metadata.name ?? user.email?.split("@")[0] ?? null;
    const foto = metadata.avatar_url ?? metadata.picture ?? null;
    const bio = metadata.bio ?? "Perfil criado automaticamente.";

    const row = {
      id: user.id,
      nome,
      email: user.email ?? null,
      senha: null,
      bio,
      foto,
      criado_em: new Date().toISOString(),
    };

    await supabase
        .from("usuarios")
        .upsert([row], { onConflict: "id", ignoreDuplicates: false });
  } catch (err) {
    console.warn("ensureUserRow erro:", err);
  }
}

export function useEmailAuth() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
        if (data.session?.user) await ensureUserRow(data.session.user);
      } catch (err) {
        console.warn("getSession erro:", err);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      const u = newSession?.user ?? null;
      setSession(newSession ?? null);
      setUser(u);
      if (u) ensureUserRow(u);
    });

    return () => {
      sub?.subscription?.unsubscribe?.();
      mounted = false;
    };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      const createdUser = data.user ?? null;
      if (createdUser) {
        await ensureUserRow(createdUser);
        setUser(createdUser);
      }

      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      const loggedUser = data.user ?? null;
      if (loggedUser) {
        await ensureUserRow(loggedUser);
        setUser(loggedUser);
      }
      setSession(data.session ?? null);

      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      setUser(null);
      setSession(null);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
  } as const;
}

export function useGoogleAuth() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
        if (data.session?.user) await ensureUserRow(data.session.user);
      } catch (err) {
        console.warn("getSession erro:", err);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      const u = newSession?.user ?? null;
      setSession(newSession ?? null);
      setUser(u);
      if (u) ensureUserRow(u);
    });

    return () => {
      sub?.subscription?.unsubscribe?.();
      mounted = false;
    };
  }, []);

  const signInWithGoogle = useCallback(async (redirectTo?: string) => {
    setLoading(true);
    setError(null);
    try {
      const options = redirectTo ? { options: { redirectTo } } : undefined;
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        ...(options ?? {}),
      } as any);

      if (oauthError) throw oauthError;

      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      setUser(null);
      setSession(null);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    session,
    loading,
    error,
    signInWithGoogle,
    signOut,
  } as const;
}
