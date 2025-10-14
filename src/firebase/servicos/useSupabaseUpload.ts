import { useState, useCallback } from 'react';
import { supabase, BUCKET } from '../../lib/supabaseClient';
import { doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../config';

type UploadOpts = { asCover?: boolean };

export function useSupabaseUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File, ownerUid: string, eventId: string, opts?: UploadOpts) => {
      if (!file) throw new Error('Arquivo não fornecido');
      if (!ownerUid) throw new Error('ownerUid é obrigatório');
      if (!eventId) throw new Error('eventId é obrigatório');

      setError(null);
      setUploading(true);

      try {
        const uuid = (crypto as any).randomUUID?.() ?? Math.random().toString(36).slice(2);
        const uniqueName = `${Date.now()}_${uuid}_${file.name}`;
        const path = `events/${ownerUid}/${eventId}/gallery/${uniqueName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, { upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(path);
        const publicUrl = publicData.publicUrl as string;

        const imageMeta = {
          path,
          url: publicUrl,
          name: file.name,
          size: file.size,
          uploadedAt: serverTimestamp(),
        };

        const eventRef = doc(db, 'usuarios', ownerUid, 'eventos', eventId);
        await updateDoc(eventRef, {
          images: arrayUnion(imageMeta),
        });

        if (opts?.asCover) {
          await updateDoc(eventRef, {
            imagePath: path,
            imageUrl: publicUrl,
          });
        }

        return { path, url: publicUrl, meta: imageMeta };
      } catch (err: any) {
        console.error('Erro upload supabase:', err);
        setError(err?.message ?? String(err));
        throw err;
      } finally {
        setUploading(false);
      }
    },
    []
  );

  return { upload, uploading, error };
}
