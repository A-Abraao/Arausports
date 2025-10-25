import { useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";

export function useEventRealtime(onUpdate: (payload: any) => void) {
  const channelRef = useRef<any | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel("public:eventos:realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "eventos" },
        (payload: any) => {
          try {
            onUpdate(payload);
          } catch (e) {
            console.error("onUpdate error", e);
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current?.unsubscribe) {
        channelRef.current.unsubscribe().catch(() => {});
      } else if (channelRef.current) {
        try {
          channelRef.current.remove?.();
        } catch {}
      }
    };
  }, [onUpdate]);
}
