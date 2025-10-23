import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../auth/useSupabaseAuth";
import { ensureUserProfileExists } from "../helpers/ensureUserProfileExists";

export type UserProfile = {
  id: string;
  displayName: string | null;
  bio: string | null;
  photoURL: string | null;
  email: string | null;
};

export function useUserProfile(userIdParam: string | null) {
  const { user: authUser, session, initializing } = useAuth(); // pega user direto do provider
  const userId = userIdParam ?? authUser?.id ?? session?.user?.id ?? null;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(!!userId);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (initializing) return;

    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    const mapRowToProfile = (row: any): UserProfile => ({
      id: row.id,
      displayName: row.nome ?? null,
      bio: row.bio ?? null,
      photoURL: row.foto_url ?? null,
      email: row.email ?? null,
    });

    (async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("usuarios")
          .select("id, nome, bio, foto_url, email")
          .eq("id", userId)
          .maybeSingle();

        if (process.env.NODE_ENV !== "production") {
          console.debug("[useUserProfile] fetch", { userId, data, fetchError });
        }

        if (fetchError) throw fetchError;

        if (!mounted) return;

        if (data) {
          setProfile(mapRowToProfile(data));
        } else {
          // fallback: se for o próprio usuário autenticado, tenta criar/upsert o perfil mínimo
          const current = authUser ?? session?.user ?? null;
          if (current && current.id === userId) {
            try {
              const created = await ensureUserProfileExists(current);
              if (created) {
                setProfile(mapRowToProfile(created));
                return;
              }
            } catch (e) {
              console.warn("[useUserProfile] ensureUserProfileExists falhou:", e);
            }
          }
          setProfile(null);
        }
      } catch (err: any) {
        if (mounted) {
          console.error("[useUserProfile] erro:", err);
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    // realtime subscription
    const filter = `id=eq.${userId}`;
    const channel = supabase
      .channel(`public:usuarios:${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "usuarios", filter },
        (payload: any) => {
          try {
            if (payload.eventType === "DELETE" || payload.event === "DELETE") {
              setProfile(null);
            } else {
              const newRow = payload.new ?? payload.record ?? payload;
              if (newRow) setProfile(mapRowToProfile(newRow));
            }
          } catch (e) {
            console.warn("useUserProfile realtime handler erro:", e);
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      try {
        supabase.removeChannel(channel);
      } catch {
        try {
          channel.unsubscribe?.();
          // @ts-ignore
          channel.subscription?.unsubscribe?.();
        } catch (e) {
          console.warn("useUserProfile: unsubscribe fallback erro:", e);
        }
      }
    };
  }, [userId, initializing, authUser, session]);

  return { profile, loading, error };
}
