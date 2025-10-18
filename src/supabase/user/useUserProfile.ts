import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export type UserProfile = {
  id: string;
  displayName: string | null; 
  bio: string | null;
  photoURL: string | null; 
  email: string | null;
};

export function useUserProfile(userId: string | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(!!userId);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
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
          .single();

        if (fetchError) throw fetchError;

        if (!mounted) return;
        if (data) setProfile(mapRowToProfile(data));
        else setProfile(null);
      } catch (err: any) {
        console.error("useUserProfile fetch erro:", err);
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

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
          } catch (err) {
            console.warn("useUserProfile realtime handler erro:", err);
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
        } catch(erro) {
          console.log("operação deu erro capitão...\n" + erro)
        }
      }
    };
  }, [userId]);

  return { profile, loading, error };
}
