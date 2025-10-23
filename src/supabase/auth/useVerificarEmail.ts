import { useCallback, useState } from "react";
import { supabase } from "../supabaseClient";

export default function useVerificarEmail() {
  //criação dos estados de loading e de error do hook
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  //função assincrona para evitar montagens desnecessárias, recebe email e token como arugmento para funcionar
  const verify = useCallback(async (email: string, token: string) => {
    setError(null);
    setLoading(true);
    try {
      //aqui ele chama um bagulho do supabase que confirma o token e o email
        const { data, error } = await supabase.auth.verifyOtp({
            email: email.trim(),
            token,
            type: "email",
        } as any);
        
        if (error) throw error;

      // tenta obter a sessão — polling curto para garantir persistência
      let session = null;
      for (let i = 0; i < 5; i++) {
        const res = await supabase.auth.getSession();
        session = res?.data?.session ?? null;
        if (session) break;
        // espera um pouco antes da próxima tentativa 
        await new Promise((r) => setTimeout(r, 200));
      }

      return { data, session };
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  //retornar as paradinhas para serem usadas
  return { verify, loading, error };
}
