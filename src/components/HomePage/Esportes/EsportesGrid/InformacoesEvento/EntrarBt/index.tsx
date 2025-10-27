import React, { useState } from "react";
import { Button } from "@mui/material";
import { useJoinEvent } from "../../../../../../supabase";
import { useExitEvent } from "../../../../../../supabase";
import { useEventParticipationStatus } from "../../../../../../supabase";
import { useEventProgress } from "../../../../../../supabase";
import { ConfirmarSaida } from "./ConfirmarSaida";

type EntrarBtProps = {
  eventoId: string;
  ownerId?: string;
};

export function EntrarBt({ eventoId, ownerId }: EntrarBtProps) {
  const { participating, loading: loadingStatus, refetch } = useEventParticipationStatus(eventoId);
  const { joinEvent, loading: loadingJoin } = useJoinEvent();
  const { leaveEvent, loading: loadingLeave } = useExitEvent();

  // hook para saber capacidade / participantes em realtime
  const { participantesAtuais, capacidade, loading: loadingProg } = useEventProgress(eventoId);

  const [busy, setBusy] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // determina se o evento está cheio
  const isFull =
    typeof capacidade === "number" &&
    typeof participantesAtuais === "number" &&
    participantesAtuais >= capacidade;

  // se o usuário já participa, não bloqueamos o botão (ele pode sair)
  const disabledBecauseFull = Boolean(isFull && !participating);

  const isLoading = busy || loadingStatus || loadingJoin || loadingLeave || loadingProg;

  const disabled = Boolean(isLoading || ownerId === undefined || disabledBecauseFull);

  // Clique do botão verifica se ele não esta ou o evento esta cheio
  const handleClick = async (e?: React.MouseEvent) => {
    e?.stopPropagation?.();
    if (busy) return;

    // se está participando, abre o diálogo de confirmação
    if (participating) {
      setConfirmOpen(true);
      return;
    }

    // segurança: impedir tentativa de join quando cheio
    if (disabledBecauseFull) {
      console.warn("Tentativa de entrar em evento cheio");
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

  // Se o evento estiver cheio e o usuário não participa, mostra "Já era.."
  const displayLabel = disabledBecauseFull ? "Já era.." : isLoading ? "Aguarde..." : label;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        <Button
          onClick={(e) => handleClick(e)}
          disabled={disabled}
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
            // quando desabilitado por capacidade cheia, aplicar cinza
            "&.Mui-disabled": {
              backgroundColor: disabledBecauseFull ? "rgba(0,0,0,0.6)" : undefined,
              color: disabledBecauseFull ? "lightgray" : "#ffffff",
              fontStyle: disabledBecauseFull ? "italic" : "none",
              opacity: 1, // manter cor sólida 
            },
          }}
        >
          {displayLabel}
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
