import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export type Evento = {
  id: string;
  ownerId?: string | null;
  titulo: string;
  categoria: string;
  data: string | null; 
  horario: string | null;
  local: string;
  capacidade: number;
  participantesAtuais?: number;
  imageUrl?: string | null;
};

export function useEventData() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: supError } = await supabase
          .from("eventos") 
          .select("*")
          .order("created_at", { ascending: false }); 

        if (supError) throw supError;

        if (!mounted) return;

        const mapped: Evento[] = (data ?? []).map((row: any) => {
          const ownerId =
            row.owner_id ??
            row.owner_uid ??
            row.user_id ??
            row.ownerId ??
            row.ownerUid ??
            row.owner ??
            null;

          const titulo = row.titulo ?? row.title ?? row.nome ?? row.name ?? "Sem título";
          const categoria = row.categoria ?? row.category ?? "Evento";
          const rawDate = row.data ?? row.date ?? row.event_date ?? row.data_evento ?? null;
          const dataISO = rawDate ? new Date(rawDate).toISOString() : null;
          const horario = row.horario ?? row.time ?? row.hora ?? null;
          const local = row.local ?? row.localizacao ?? row.location ?? "Local não informado";
          const capacidade = Number(row.capacidade ?? row.capacity ?? 0) || 0;
          const participantesAtuais = Number(
            row.participantes_atuais ??
              row.participantesAtuais ??
              row.participants ??
              row.current_participants ??
              0
          );
          const imageUrl =
            row.image_url ??
            row.imageUrl ??
            row.imagePath ??
            row.image_path ??
            row.foto ??
            null;

          return {
            id: String(row.id ?? row.event_id ?? row.uuid ?? ""),
            ownerId,
            titulo,
            categoria,
            data: dataISO,
            horario,
            local,
            capacidade,
            participantesAtuais,
            imageUrl,
          } as Evento;
        });

        setEventos(mapped);
      } catch (err: any) {
        console.error("useEventData supabase error:", err);
        if (!mounted) return;
        setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return { eventos, loading, error };
}
