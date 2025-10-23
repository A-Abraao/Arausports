import { useState, useCallback } from "react";
import { useAuth } from "./useSupabaseAuth";
import { supabase } from "../supabaseClient";
import { cleanupLocalSessionKeys } from "../safeSession";

export function useEmailAuth() {
  
  const { signIn: signInBase, signUp: signUpBase } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      if (typeof signInBase === "function") {
        return await signInBase(email, password);
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [signInBase]);

  const signUp = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      if (typeof signUpBase === "function") {
        return await signUpBase(email, password);
      }

      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [signUpBase]);

  return {
    signIn,
    signUp,
    loading,
    error,
  };
}

export function useGoogleAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const callbackPath = "/Arausports/auth-callback.html";
      const redirectTo = `${window.location.origin}${callbackPath}`;
      const res = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
          queryParams: {
            prompt: "select_account"
          }
        }
      });

      const authUrl = (res as any)?.data?.url ?? (res as any)?.url;
      if (!authUrl) throw new Error("Falha ao obter a URL de autenticação do Google.");

      return await new Promise(async (resolve, reject) => {
        const popup = window.open(authUrl, "googleLoginPopup", "width=500,height=600");
        if (!popup) {
          reject(new Error("Falha ao abrir popup de login."));
          return;
        }

        let settled = false;

        const cleanup = () => {
          try { window.removeEventListener("message", messageHandler); } catch {}
          try { if (!popup.closed) popup.close(); } catch {}
          try { clearInterval(closeWatcher); } catch {}
        };

        const messageHandler = async (ev: MessageEvent) => {
          try {
            const okOrigin = ev.origin === window.location.origin || (ev.data && ev.data.origin === window.location.origin);
            if (!okOrigin) return;
            const data = ev.data;
            if (!data || data.type !== "supabase_auth_callback") return;
            const payload = String(data.payload || "");
            const qp = new URLSearchParams(payload.replace(/^#/, ""));
            const access_token = qp.get("access_token");
            const refresh_token = qp.get("refresh_token");

            if (!access_token) {
              if (!settled) {
                settled = true;
                cleanup();
                reject(new Error("Nenhum token recebido no callback."));
              }
              return;
            }

            try {
              const { data: setData, error: setError } = await supabase.auth.setSession({
                access_token,
                refresh_token
              } as any);
              if (setError) {
                console.warn("useGoogleAuth: setSession erro:", setError);
                cleanupLocalSessionKeys();
                if (!settled) {
                  settled = true;
                  cleanup();
                  reject(setError);
                }
                return;
              }


              if (!settled) {
                settled = true;
                cleanup();
                resolve(setData);
              }
            } catch (e) {
              if (!settled) {
                settled = true;
                cleanup();
                reject(e);
              }
            }
          } catch (e) {
            if (!settled) {
              settled = true;
              cleanup();
              reject(e);
            }
          }
        };

        window.addEventListener("message", messageHandler);

        const closeWatcher = setInterval(async () => {
          try {
            let isClosed = false;
            try { isClosed = Boolean(popup.closed); } catch (e) { isClosed = true; }
            if (isClosed) {
              try {
                const { data } = await supabase.auth.getSession();
                if (data?.session) {
                  if (!settled) {
                    settled = true;
                    cleanup();
                    resolve(data);
                    return;
                  }
                }
              } catch {}
              if (!settled) {
                settled = true;
                cleanup();
                reject(new Error("Popup fechado antes de completar autenticação."));
              }
            }
          } catch (e) {
            try {
              const { data } = await supabase.auth.getSession();
              if (data?.session) {
                if (!settled) {
                  settled = true;
                  cleanup();
                  resolve(data);
                  return;
                }
              }
            } catch {}
            if (!settled) {
              settled = true;
              cleanup();
              reject(new Error("Erro no watcher do popup."));
            }
          }
        }, 500);
      });
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { signInWithGoogle, loading, error };
}
