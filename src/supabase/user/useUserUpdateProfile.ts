import { useCallback, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../auth/useSupabaseAuth";

export type ProfileUpdateData = {
  username?: string | null;
  bio?: string | null;
};

export function useUpdateUserProfile() {
  const { user: authUser, session } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const updateProfile = useCallback(
    async (data: ProfileUpdateData, onSuccess?: (updatedRow: any | null) => void) => {
      setError(null);

      // Resolve userId from auth provider/session
      const currentUser = authUser ?? session?.user ?? null;
      const userId = currentUser?.id ?? null;
      if (!userId) {
        const err = new Error("Usuário não autenticado.");
        setError(err);
        throw err;
      }

      const hasUsername = typeof data.username === "string" && data.username.trim().length > 0;
      const hasBio = typeof data.bio === "string" && data.bio.trim().length > 0;
      if (!hasUsername && !hasBio) {
        const err = new Error("Nenhum campo para atualizar.");
        setError(err);
        throw err;
      }

      // Sanitização / limites (ajuste se quer outros limites)
      const payload: Record<string, any> = {};
      if (hasUsername) payload.nome = String(data.username).trim().slice(0, 60);
      if (hasBio) payload.bio = String(data.bio).trim().slice(0, 1000);

      setIsLoading(true);
      try {
        // tenta UPDATE (mais seguro para não sobrescrever)
        const { data: updatedRow, error: updateError } = await supabase
          .from("usuarios")
          .update(payload)
          .eq("id", userId)
          .select()
          .maybeSingle();

        if (updateError) {
          // mapear erro de constraint para mensagem amigável
          if ((updateError as any)?.code === "23505" || (updateError as any)?.message?.includes("duplicate")) {
            const e = new Error("Nome de usuário já existe.");
            setError(e);
            throw e;
          }
          throw updateError;
        }

        // se update não retornou linha (perfil não existia), cria via upsert
        let finalRow = updatedRow ?? null;
        if (!updatedRow) {
          const upsertPayload = { id: userId, ...payload };
          const { data: upsertData, error: upsertError } = await supabase
            .from("usuarios")
            .upsert(upsertPayload, { onConflict: "id" })
            .select()
            .maybeSingle();

          if (upsertError) {
            if ((upsertError as any)?.code === "23505") {
              const e = new Error("Nome de usuário já existe.");
              setError(e);
              throw e;
            }
            throw upsertError;
          }
          finalRow = upsertData ?? null;
        }

        // Atualizar metadata do Auth (não bloqueante — falhas apenas logadas)
        if (hasUsername) {
          try {
            await supabase.auth.updateUser({ data: { full_name: payload.nome } } as any);
          } catch (authErr) {
            // apenas log
            // eslint-disable-next-line no-console
            console.warn("useUpdateUserProfile: supabase.auth.updateUser falhou:", authErr);
          }
        }

        // calback ipcional
        if (typeof onSuccess === "function") onSuccess(finalRow);

        return finalRow;
      } catch (err: any) {
        const normalized = err instanceof Error ? err : new Error(String(err));
        setError(normalized);
        throw normalized;
      } finally {
        setIsLoading(false);
      }
    },
    [authUser, session]
  );

  return { isLoading, error, updateProfile };
}

export default useUpdateUserProfile;
