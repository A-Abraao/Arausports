import { useEffect, useState, useCallback } from 'react';
import { supabase, BUCKET } from '../../lib/supabaseClient';

type ImageMeta = { path: string; url: string; name: string; updated_at?: string };
type ImagesByEvent = Record<string, string | undefined>;
type AllImagesByEvent = Record<string, ImageMeta[]>;

export function useEventImages(events: Array<any> | null | undefined, opts?: { fallbackToStorage?: boolean }) {
  const [imagesByEvent, setImagesByEvent] = useState<ImagesByEvent>({});
  const [allImagesByEvent, setAllImagesByEvent] = useState<AllImagesByEvent>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchForEvents = useCallback(async () => {
    if (!events) return;
    setLoading(true);
    setError(null);

    try {
      const nextMap: ImagesByEvent = {};
      const nextAll: AllImagesByEvent = {};

      await Promise.all(events.map(async (ev) => {
        const owner = ev.ownerId ?? ev.ownerUid ?? null;
        const eventId = ev.id;
        const maybeUrl = ev.imageUrl ?? null;

        if (maybeUrl) {
          nextMap[eventId] = maybeUrl;
          nextAll[eventId] = [{ path: ev.imagePath ?? '', url: maybeUrl, name: 'from-doc' }];
          return;
        }

        if (!owner || opts?.fallbackToStorage === false) {
          nextMap[eventId] = undefined;
          nextAll[eventId] = [];
          return;
        }

        const prefixes = [
          `events/${owner}/${eventId}/gallery`,
          `events/${owner}/${eventId}`,
          `events/${owner}/${eventId}/original`,
        ];

        let found = false;
        for (const p of prefixes) {
          const { data, error } = await supabase.storage.from(BUCKET).list(p, { limit: 100 });
          if (!error && data && data.length > 0) {
            const items = data.map((it: any) => {
              const itemPath = `${p}/${it.name}`;
              const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(itemPath);
              return { path: itemPath, url: pub.publicUrl, name: it.name, updated_at: it.updated_at };
            });

            items.sort((a, b) => {
              const aCover = /cover/i.test(a.name) ? -1 : 0;
              const bCover = /cover/i.test(b.name) ? -1 : 0;
              if (aCover !== bCover) return aCover - bCover;
              const at = a.updated_at ? Date.parse(a.updated_at) : 0;
              const bt = b.updated_at ? Date.parse(b.updated_at) : 0;
              return bt - at;
            });

            nextAll[eventId] = items;
            nextMap[eventId] = items[0]?.url;
            found = true;
            break;
          }
        }

        if (!found) {
          nextMap[eventId] = undefined;
          nextAll[eventId] = [];
        }
      }));

      setImagesByEvent(nextMap);
      setAllImagesByEvent(nextAll);
    } catch (err: any) {
      console.error('Erro ao buscar imagens:', err);
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }, [events, opts?.fallbackToStorage]);

  useEffect(() => {
    fetchForEvents();
  }, [fetchForEvents]);

  return { imagesByEvent, allImagesByEvent, loading, error, refresh: fetchForEvents };
}
