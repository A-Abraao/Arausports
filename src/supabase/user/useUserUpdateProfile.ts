import { useCallback, useState } from "react";
import { supabase } from "../supabaseClient";

export type ProfileUpdateData = {
  username?: string;
  bio?: string;
};

export function useUpdateUserProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateProfile = useCallback(
    async (userId: string | null, data: ProfileUpdateData, onSuccess?: () => void) => {
      if (!userId) {
        const err = new Error("Usuário não autenticado.");
        setError(err);
        throw err;
      }

      if ((!data.username || !data.username.trim()) && (!data.bio || !data.bio.trim())) {
        const err = new Error("Nenhum campo para atualizar.");
        setError(err);
        throw err;
      }

      setIsLoading(true);
      setError(null);

      try {
        const row: any = {
          id: userId,
          ...(data.username ? { nome: data.username.trim() } : {}),
          ...(data.bio ? { bio: data.bio.trim() } : {}),
          updated_at: new Date().toISOString(),
        };

        const { error: upsertError } = await supabase
          .from("usuarios")
          .upsert([row], { onConflict: "id" });

        if (upsertError) throw upsertError;

        if (data.username) {
          try {
            await supabase.auth.updateUser({
              data: { full_name: data.username.trim() },
            });
          } catch (err) {
            console.warn("Falha ao atualizar metadata auth:", err);
          }
        }

        if (onSuccess) onSuccess();
      } catch (err: any) {
        console.error("useUpdateUserProfile erro:", err);
        setError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { isLoading, error, updateProfile };
}
