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
        const normalized = email.trim().toLowerCase();
        return await signInBase(normalized, password);
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

      const normalized = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signUp({ email: normalized, password });

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
          queryParams: { prompt: "select_account" }
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
        let bc: BroadcastChannel | null = null;

        const cleanup = () => {
          try { if (bc) { bc.onmessage = null; bc.close(); bc = null; } } catch {}
          try { window.removeEventListener("message", fallbackMessageHandler as any); } catch {}
          try { if (!popup.closed) popup.close(); } catch {}
          try { clearInterval(closeWatcher); } catch {}
        };

        // handler que processa o payload (string) e tenta setSession
        const processPayload = async (payloadRaw: unknown) => {
          try {
            const payload = String(payloadRaw || "");
            const qp = new URLSearchParams(payload.replace(/^#/, ""));
            const access_token = qp.get("access_token");
            const refresh_token = qp.get("refresh_token");

            if (!access_token) {
              // payload pode não conter tokens (ex: code flow). Rejeita aqui.
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

        // --- BroadcastChannel approach (preferred) ---
        try {
          if ("BroadcastChannel" in window) {
            bc = new BroadcastChannel("supabase-auth-popup");
            bc.onmessage = (ev) => {
              processPayload(ev.data);
            };
          } else {
            bc = null;
          }
        } catch (e) {
          bc = null;
        }

        // --- fallback para window.postMessage caso BroadcastChannel não exista ---
        const fallbackMessageHandler = (ev: MessageEvent) => {
          try {
            // se o popup enviar um objeto, tenta extrair; se enviar string, usa direto
            if (!ev.data) return;
            // aceitar tanto string (payload) quanto objeto com .payload
            const maybePayload = typeof ev.data === "string" ? ev.data : (ev.data.payload ?? ev.data);
            processPayload(maybePayload);
          } catch (err) {
            // ignore
          }
        };

        if (!bc) {
          window.addEventListener("message", fallbackMessageHandler);
        }

        // --- watcher: se popup fechar, tenta getSession() antes de rejeitar ---
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
