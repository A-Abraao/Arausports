import { useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../config";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export function useSupabaseUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (
    file: File,
    ownerUid: string,
    eventId: string,
    opts?: { asCover?: boolean }
  ) => {
    if (!file) throw new Error("Arquivo não fornecido");
    if (!ownerUid) throw new Error("ownerUid é obrigatório");
    if (!eventId) throw new Error("eventId é obrigatório");

    setError(null);
    setUploading(true);

    try {
      const bucket = "uploads"; // ajuste pro seu bucket
      const filename = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const path = `${ownerUid}/${eventId}/${filename}`;

      
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        throw uploadError;
      }

      // obter URL pública (se bucket for público)
      const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);
      const url = (publicData as any)?.publicUrl ?? null;

      // se bucket for privado, use createSignedUrl:
      // const { data: signed } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60);
      // const url = signed?.signedUrl;

      const imageMeta = {
        path,
        url,
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      };

      // atualizar o documento do evento no Firestore (como você já fazia)
      const eventRef = doc(db, "usuarios", ownerUid, "eventos", eventId);
      await updateDoc(eventRef, {
        images: arrayUnion(imageMeta),
      });

      if (opts?.asCover) {
        await updateDoc(eventRef, {
          imagePath: path,
          imageUrl: url,
        });
      }

      return { path, url, meta: imageMeta };
    } catch (err: any) {
      console.error("Erro no upload:", err);
      setError(err.message ?? String(err));
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, uploading, error };
}
