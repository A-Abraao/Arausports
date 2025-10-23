import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { supabase } from "../supabaseClient";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { safeAuthInit, cleanupLocalSessionKeys } from "../safeSession";

type UseSupabaseAuthReturn = {
  user: SupabaseUser | null;
  session: Session | null;
  loading: boolean;
  initializing: boolean; 
  error: Error | null;
  signUp: (email: string, password: string) => Promise<{ user: SupabaseUser | null; session: Session | null }>;
  signIn: (email: string, password: string) => Promise<{ user: SupabaseUser | null; session: Session | null }>;
  signInWithGoogle: (redirectTo?: string) => Promise<any>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  updateProfile: (profile: { bio?: string; username?: string }) => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<string>;
};

const upsertLocks = new Set<string>();

async function ensureUserRow(user: SupabaseUser | null) {
  if (!user) return;
  if (upsertLocks.has(user.id)) return;
  upsertLocks.add(user.id);

  try {
    const metadata = (user.user_metadata ?? {}) as Record<string, any>;
    const nome = metadata.full_name ?? metadata.name ?? user.email?.split("@")[0] ?? null;
    const candidate = {
      id: user.id,
      nome,
      email: user.email ?? null,
      senha: null,
      bio: metadata.bio ?? "Perfil criado automaticamente.",
      foto_url: "", 
      criado_em: new Date().toISOString(),
    };

    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const { error } = await supabase.from("usuarios").upsert([candidate], { onConflict: "id" });
        if (!error) return;

        if (error.code === "42501") {
          await new Promise(r => setTimeout(r, 250 * (attempt + 1)));
          continue;
        }

        if (error.code === "23505") {
          try {
            const { data: existing } = await supabase
              .from("usuarios")
              .select("id,email")
              .eq("email", candidate.email)
              .maybeSingle();

            if (existing) {
              if (existing.id === user.id) return; 
              console.warn("[ensureUserRow] email já pertence a outro id:", existing);
              return;
            } else {
              console.warn("[ensureUserRow] unique violation, mas select não retornou row");
              return;
            }
          } catch (e) {
            console.warn("[ensureUserRow] erro ao tratar 23505:", e);
            return;
          }
        }

        console.warn("ensureUserRow upsert falhou:", error);
        return;
      } catch (err) {
        console.warn("ensureUserRow erro inesperado (tentativa):", err);
        await new Promise(r => setTimeout(r, 250 * (attempt + 1)));
      }
    }

    console.warn("ensureUserRow: todas as tentativas falharam.");
  } finally {

    upsertLocks.delete(user.id);
  }
}



export function useProvideAuth(): UseSupabaseAuthReturn {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshingRef = useRef(false);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    let watchdogTimer: number | undefined;

    (async () => {
      try {
        const sess = await safeAuthInit();
        if (!mounted) return;

        setSession(sess ?? null);
        setUser(sess?.user ?? null);

        if (sess?.user) {
          void ensureUserRow(sess.user).then(() => {
            console.log("[AUTH] ensureUserRow completed (bg) for init");
          }).catch(e => console.warn("[AUTH] ensureUserRow bg erro:", e));
        }
      } catch (err) {
        console.warn("[AUTH] safeAuthInit erro:", err);
        try { cleanupLocalSessionKeys(); } catch {}
        if (!mounted) return;
        setSession(null);
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }

      try {
        const { data: subscription } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          try {
            setSession(newSession ?? null);
            setUser(newSession?.user ?? null);

            if (newSession?.user) {
              void ensureUserRow(newSession.user).then(() => {
                console.log("[AUTH] ensureUserRow completed (bg) onAuthStateChange");
              }).catch(e => console.warn("[AUTH] ensureUserRow onAuthStateChange erro:", e));
            }
          } catch (e) {
            console.warn("[AUTH] error in onAuthStateChange callback:", e);
          }
        });
        subscriptionRef.current = subscription;
      } catch (e) {
        console.warn("[AUTH] subscribe failed:", e);
      }

      watchdogTimer = window.setTimeout(() => {
        if (mounted && loading) {
          console.warn("[AUTH] WATCHDOG: loading still true after timeout. Forçando loading=false.");
          setLoading(false);
          try {
            const keys = Object.keys(localStorage).filter(k => k.startsWith("sb-"));
            console.warn("[AUTH] local sb- keys:", keys);
            keys.forEach(k => console.log(k, "preview:", (localStorage.getItem(k) ?? "").slice(0,160)));
          } catch (e) { console.warn(e); }
        }
      }, 7000);
    })();

    return () => {
      mounted = false;
      try { if (typeof watchdogTimer !== "undefined") clearTimeout(watchdogTimer); } catch {}
      try {
        if (subscriptionRef.current?.unsubscribe) subscriptionRef.current.unsubscribe();
        else (subscriptionRef.current as any)?.subscription?.unsubscribe?.();
      } catch (e) { console.warn("[AUTH] error unsubscribing:", e); }
    };
  }, []);

  const refreshSession = useCallback(async () => {
    if (refreshingRef.current) return;
    refreshingRef.current = true;
    setLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      if (data.session?.user) void ensureUserRow(data.session.user).catch(() => {});
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      refreshingRef.current = false;
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) throw signUpError;
      const createdUser = data.user ?? null;
      if (createdUser) {
        
        void ensureUserRow(createdUser).catch(e => console.warn("ensureUserRow signUp erro:", e));
        setUser(createdUser);
      }
      setSession(data.session ?? null);
      return { user: createdUser, session: data.session ?? null };
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      const loggedUser = data.user ?? null;
      if (loggedUser) {
        void ensureUserRow(loggedUser).catch(e => console.warn("ensureUserRow signIn erro:", e));
        setUser(loggedUser);
      }
      setSession(data.session ?? null);
      return { user: loggedUser, session: data.session ?? null };
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setLoading(false);
    }
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
      setError(err instanceof Error ? err : new Error(String(err)));
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
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadProfilePicture = useCallback(async (file: File) => {
    if (!user) throw new Error("Usuário não autenticado");
    const BUCKET = "usuario-fotos";
    const path = `${user.id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });
    if (uploadError) throw uploadError;
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return urlData.publicUrl as string;
  }, [user]);

  const updateProfile = useCallback(async (profile: { bio?: string; username?: string }) => {
    if (!user) throw new Error("Usuário não autenticado");
    setLoading(true);
    setError(null);
    try {
      const updates: Record<string, any> = {};
      if (profile.username !== undefined) updates.nome = profile.username;
      if (profile.bio !== undefined) updates.bio = profile.bio;
      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase.from("usuarios").update(updates).eq("id", user.id);
        if (updateError) throw updateError;
      }
      if (profile.username !== undefined) {
        try { await supabase.auth.updateUser({ data: { full_name: profile.username } }); } catch {}
      }
      await refreshSession();
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, refreshSession]);

  return useMemo(
    () => ({
      user, session,
      loading,
      initializing: loading, 
      error, signUp, signIn, signInWithGoogle, signOut, refreshSession, updateProfile, uploadProfilePicture
    }),
    [user, session, loading, error, signUp, signIn, signInWithGoogle, signOut, refreshSession, updateProfile, uploadProfilePicture]
  );
}

const AuthContext = createContext<UseSupabaseAuthReturn | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useProvideAuth();
  return React.createElement(AuthContext.Provider, { value: auth }, children);
}

export function useAuth(): UseSupabaseAuthReturn {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
