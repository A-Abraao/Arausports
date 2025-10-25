import React, { useState } from "react";
import { Button } from "@mui/material";
import { useJoinEvent } from "../../../../../../supabase";
import { useExitEvent } from "../../../../../../supabase";
import { useEventParticipationStatus } from "../../../../../../supabase";
import { ConfirmarSaida } from "./ConfirmarSaida";

type EntrarBtProps = {
  eventoId: string;
  ownerId?: string;
};

export function EntrarBt({ eventoId, ownerId }: EntrarBtProps) {
  const { participating, loading: loadingStatus, refetch } = useEventParticipationStatus(eventoId);
  const { joinEvent, loading: loadingJoin } = useJoinEvent();
  const { leaveEvent, loading: loadingLeave } = useExitEvent();

  const [busy, setBusy] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Clique do botão: se já participa -> abrir confirm; se não -> join direto
  const handleClick = async (e?: React.MouseEvent) => {
    e?.stopPropagation?.();
    if (busy) return;

    // se está participando, apenas abrir o diálogo
    if (participating) {
      setConfirmOpen(true);
      return;
    }

    // não participa -> faz join direto
    setBusy(true);
    try {
      await joinEvent(eventoId);
      await refetch();
    } catch (err) {
      console.error("Erro ao entrar no evento:", err);
    } finally {
      setBusy(false);
    }
  };

  // confirmação de saída (quando o usuário confirma no popup)
  const handleConfirmarSaida = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await leaveEvent(eventoId);
      await refetch();
      setConfirmOpen(false);
    } catch (err) {
      console.error("Erro ao sair do evento:", err);
      // Mantemos o diálogo aberto para o usuário tentar novamente ou cancelar
    } finally {
      setBusy(false);
    }
  };

  const label = participating ? "Sair do evento" : "Se juntar";
  const isLoading = busy || loadingStatus || loadingJoin || loadingLeave;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        <Button
          onClick={(e) => handleClick(e)}
          disabled={isLoading || ownerId === undefined}
          size="small"
          sx={{
            minWidth: "auto",
            width: "auto",
            px: 2,
            color: "white",
            fontWeight: 550,
            background: participating ? "crimson" : "springgreen",
            textTransform: "none",
            whiteSpace: "nowrap",
          }}
        >
          {isLoading ? "Aguarde..." : label}
        </Button>
      </div>

      <ConfirmarSaida
        open={confirmOpen}
        loading={loadingLeave || busy}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmarSaida}
        title="Quer mesmo sair do evento?"
        description="Sua participação será removida se você confirmar a saída"
        confirmLabel="Sair"
        cancelLabel="Deixa quieto.."
      />
    </>
  );
}

export default EntrarBt;
