import { useCallback, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "./useSupabaseAuth";

export default function useVerifyEmail() {
  const { refreshSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  const verify = useCallback(async (email: string, token: string) => {
    setError(null);
    setLoading(true);
    try {
      // tipo 'email' é o recomendado para OTP por e-mail (6 dígitos). 
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token,
        type: "email",
      } as any);

      if (error) throw error;

      // atauliza a sessão no provider se tiver
      try {
        await refreshSession();
      } catch (e) {
        //da um log quando o refresh falha
        console.warn("refreshSession falhou após verifyOtp:", e);
      }

      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshSession]);

  return { verify, loading, error };
}
