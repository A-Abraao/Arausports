import { useCallback, useState } from "react";
import { supabase } from "../supabaseClient";
import { cleanupLocalSessionKeys } from "../safeSession";
import { useNavigate } from "react-router-dom";

type UseSignOutResult = {
  signOut: (opts?: { redirectTo?: string }) => Promise<void>;
  loading: boolean;
  error: Error | null;
};

export function useSignOut(): UseSignOutResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  const signOut = useCallback(
    async (opts?: { redirectTo?: string }) => {
      setLoading(true);
      setError(null);

      try {
        const { error: signOutError } = await supabase.auth.signOut();

        // limpando chaves locais (não falhar o fluxo por isso)
        try {
          cleanupLocalSessionKeys();
        } catch (e) {
          console.warn("cleanupLocalSessionKeys falhou:", e);
        }

        if (signOutError) {
          const e = signOutError instanceof Error ? signOutError : new Error(String(signOutError));
          setError(e);
          throw e;
        }

        // redireciona (se foi passado redirectTo usa ele, senao vai pra raiz '/')
        const to = opts?.redirectTo ?? "/";
        navigate(to, { replace: true });
      } catch (err: any) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  return { signOut, loading, error };
}

export default useSignOut;
