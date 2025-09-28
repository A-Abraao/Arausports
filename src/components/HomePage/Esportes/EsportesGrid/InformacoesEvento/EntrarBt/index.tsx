import styled from "styled-components";
import { Button } from "@mui/material";
import { entrarNoEvento, sairDoEvento, auth, db } from "../../../../../../firebase";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const ButtonContainer = styled.div`
  margin-top: 0.75em;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

type EntrarBtProps = {
  eventoId: string;
  ownerId?: string;
};

export function EntrarBt({ eventoId, ownerId }: EntrarBtProps) {
  const [isParticipando, setIsParticipando] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    let unsubParticipante: () => void = () => {};
    if (!ownerId || !user) return;

    const participanteRef = doc(db, "users", ownerId, "eventos", eventoId, "participantes", user.uid);
    getDoc(participanteRef).then((snap) => setIsParticipando(snap.exists())).catch(() => {});

    return () => {
      try { unsubParticipante(); } catch {}
    };
  }, [user, ownerId, eventoId]);

  useEffect(() => {
    if (!ownerId) return;
    const eventoRef = doc(db, "users", ownerId, "eventos", eventoId);

    const unsub = onSnapshot(eventoRef, (snap) => {
      if (!snap.exists()) {
        setIsFull(false);
        return;
      }
      const data = snap.data() as any;
      const capacidade = Number(data.capacidade ?? 0);
      const atuais = Number(data.participantesAtuais ?? 0);
      setIsFull(atuais >= capacidade);
    }, (err) => {
      console.error("Erro ao observar evento:", err);
    });

    return () => unsub();
  }, [ownerId, eventoId]);

  const handleClick = async () => {
    if (!user || !ownerId) return;

    try {
      setLoadingAction(true);
      if (isParticipando) {
        await sairDoEvento(eventoId, ownerId, user.uid);
        setIsParticipando(false);
      } else {
        await entrarNoEvento(eventoId, ownerId, user.uid);
        setIsParticipando(true);
      }
    } catch (err: any) {
      if (err?.message) {
        alert(err.message);
      } else {
        console.error("Erro:", err);
        alert("Erro ao processar sua requisição.");
      }
    } finally {
      setLoadingAction(false);
    }
  };

  const disabledBecauseFull = isFull && !isParticipando;

  return (
    <ButtonContainer>
      <Button
        disabled={disabledBecauseFull || loadingAction || !user}
        sx={{
          background: isParticipando ? "crimson" : (disabledBecauseFull ? "#999" : "springgreen"),
          height: "2.5em",
          borderRadius: "0.5em",
          textTransform: "none",
          color: "white",
          "&:hover": {
            background: isParticipando ? "darkred" : (disabledBecauseFull ? "#999" : "mediumseagreen"),
          },
        }}
        onClick={handleClick}
      >
        {loadingAction ? "Processando..." : (isParticipando ? "Sair do evento" : (disabledBecauseFull ? "Já era.." : "Se juntar"))}
      </Button>
    </ButtonContainer>
  );
}
