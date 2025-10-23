import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { cleanupLocalSessionKeys } from "../safeSession";

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    (async () => {
      console.log("[AuthCallback] mounted. location:", location);
      console.log("[AuthCallback] window.location.href:", window.location.href);
      console.log("[AuthCallback] window.location.hash:", window.location.hash);
      console.log("[AuthCallback] window.location.search:", window.location.search);

      try {
        let params = new URLSearchParams(location.search || window.location.search || "");
        let access_token = params.get("access_token");
        let refresh_token = params.get("refresh_token");

        if (!access_token && window.location.hash) {
          const rawHash = window.location.hash.startsWith("#/") ? window.location.hash.split("?")[1] ?? "" : window.location.hash.substring(1);
          const hashParams = new URLSearchParams(rawHash);
          access_token = hashParams.get("access_token") || access_token;
          refresh_token = hashParams.get("refresh_token") || refresh_token;
          console.log("[AuthCallback] parsed from hash:", { access_token: !!access_token, refresh_token: !!refresh_token });
        }

        if (access_token) {
          console.log("[AuthCallback] access_token encontrada — chamando setSession...");
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          } as any);
          console.log("[AuthCallback] setSession result:", { data, error });
          if (error) {
            console.warn("[AuthCallback] setSession retornou erro — limpando chaves locais e tentando fallback", error);
            cleanupLocalSessionKeys();
            try {
              await (supabase.auth as any).getSessionFromUrl?.({ storeSession: true });
              console.log("[AuthCallback] getSessionFromUrl executado (fallback).");
            } catch (e) {
              console.error("[AuthCallback] getSessionFromUrl falhou:", e);
            }
          }
          
          try {
            window.history.replaceState({}, "", window.location.pathname.replace(/\/auth-callback\.html$/, "") + "/#/"); // keep base route
          } catch (e) { console.log(e) }
          navigate("/homepage", { replace: true });
          return;
        }

        const current = await supabase.auth.getSession();
        console.log("[AuthCallback] supabase.auth.getSession():", current);

        if (current?.data?.session) {
          console.log("[AuthCallback] Sessão já presente — navegando pra /homepage");
          navigate("/homepage", { replace: true });
          return;
        }

        try {
          const keys = Object.keys(localStorage || {});
          const sbKey = keys.find(k => k.startsWith("sb-") && k.includes("-auth-token"));
          console.log("[AuthCallback] localStorage sbKey:", sbKey);
          if (sbKey) {
            const raw = localStorage.getItem(sbKey);
            console.log("[AuthCallback] localStorage token preview:", raw ? raw.slice(0, 120) + "..." : null);
            const maybe = await supabase.auth.getSession();
            if (maybe?.data?.session) {
              navigate("/homepage", { replace: true });
              return;
            }
          }
        } catch (e) {
          console.warn("[AuthCallback] erro lendo localStorage:", e);
        }

        console.warn("[AuthCallback] Nenhum token encontrado nem sessão atual — redirecionando para login");
        navigate("/", { replace: true });
      } catch (err) {
        console.error("[AuthCallback] erro geral:", err);
        navigate("/", { replace: true });
      } finally {
        setBusy(false);
      }
    })();
  }, [location, navigate]);

  return <div>{busy ? "Finalizando autenticação..." : "Redirecionando..."}</div>;
}
