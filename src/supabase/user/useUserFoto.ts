// src/hooks/useUserPhoto.ts
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // ajuste o caminho conforme seu projeto

type UseUserPhotoResult = {
  photoUrl: string | null;
  loading: boolean;
  error: Error | null;
};

//userId: id do usuário (uuid)
//maybeFoto: string|null, caminho ou URL já vindo do perfil
//bucket: nome do bucket onde guarda fotos

export function useUserFoto(
  userId?: string | null,
  maybeFoto?: string | null,
  bucket = "public-images"
): UseUserPhotoResult {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    async function resolvePhoto(foto: string | null | undefined) {
      try {
        if (!foto && !userId) {
          if (mounted) setPhotoUrl(null);
          return;
        }

        // se veio um valor explícito (prioriza maybeFoto)
        if (foto) {
          // url absoluta
          if (/^https?:\/\//i.test(foto)) {
            if (mounted) setPhotoUrl(foto);
            return;
          }
          // senao, assumimos que é path no bucket
          const { data } = supabase.storage.from(bucket).getPublicUrl(foto);
          if (mounted) setPhotoUrl(data?.publicUrl ?? null);
          return;
        }

        // se não veio maybeFoto, busca no db pelo id do usuario
        const { data: row, error: selErr } = await supabase
          .from("usuarios")
          .select("foto_url")
          .eq("id", userId)
          .maybeSingle();

        if (selErr) throw selErr;

        const fotoFromDb = (row as any)?.foto_url ?? null;
        //se a foto for nula ele não passa
        if (!fotoFromDb) {
          if (mounted) setPhotoUrl(null);
          return;
        }

        if (/^https?:\/\//i.test(fotoFromDb)) {
          if (mounted) setPhotoUrl(fotoFromDb);
          return;
        }

        //pega a foto no bucket já com URL montada
        const { data } = supabase.storage.from(bucket).getPublicUrl(fotoFromDb);
        if (mounted) setPhotoUrl(data?.publicUrl ?? null);
      } catch (err: any) {
        if (mounted) setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void resolvePhoto(maybeFoto);

    return () => {
      mounted = false;
    };
  }, [userId, maybeFoto, bucket]);

  //retorna todas as funções no final
  return { photoUrl, loading, error };
}
