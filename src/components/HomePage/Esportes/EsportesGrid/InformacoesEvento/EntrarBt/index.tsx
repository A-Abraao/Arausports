import styled from "styled-components";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { auth, db } from "../../../../../../firebase/config";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useJoinEvent } from "../../../../../../firebase";
import { useExitEvent } from "../../../../../../firebase";

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

  const user = auth.currentUser;

  const { joinEvent, loading: loadingJoin, error: errorJoin } = useJoinEvent();
  const { exitEvent, loading: loadingExit, error: errorExit } = useExitEvent();

  useEffect(() => {
    if (!ownerId || !user) return;

    const participanteRef = doc(db, "usuarios", ownerId, "eventos", eventoId, "participantes", user.uid);
    getDoc(participanteRef)
      .then((snap) => setIsParticipando(snap.exists()))
      .catch(() => {});
  }, [user, ownerId, eventoId]);

  useEffect(() => {
    if (!ownerId) return;

    const eventoRef = doc(db, "usuarios", ownerId, "eventos", eventoId);

    const unsub = onSnapshot(
      eventoRef,
      (snap) => {
        if (!snap.exists()) {
          setIsFull(false);
          return;
        }
        const data = snap.data() as any;
        const capacidade = Number(data.capacidade ?? 0);
        const atuais = Number(data.participantesAtuais ?? 0);
        setIsFull(atuais >= capacidade);
      },
      (err) => {
        console.error("Erro ao observar evento cara:", err);
      }
    );

    return () => unsub();
  }, [ownerId, eventoId]);

  const handleClick = async () => {
    if (!user || !ownerId) return;

    try {
      if (isParticipando) {
        await exitEvent(eventoId, ownerId, user.uid);
        setIsParticipando(false);
      } else {
        await joinEvent(eventoId, ownerId, user.uid);
        setIsParticipando(true);
      }
    } catch (err: any) {
      alert(err.message ?? "Deu erro na requisição do firebase");
    }
  };

  const loadingAction = loadingJoin || loadingExit;
  const disabledBecauseFull = isFull && !isParticipando;

  return (
    <ButtonContainer>
      <Button
        disabled={disabledBecauseFull || loadingAction || !user}
        sx={{
          background: isParticipando
            ? "crimson"
            : disabledBecauseFull
            ? "#999"
            : "springgreen",
          height: "2.5em",
          borderRadius: "0.5em",
          textTransform: "none",
          color: "white",
          "&:hover": {
            background: isParticipando
              ? "darkred"
              : disabledBecauseFull
              ? "#999"
              : "mediumseagreen",
          },
        }}
        onClick={handleClick}
      >
        {loadingAction
          ? "Processando..."
          : isParticipando
          ? "Sair do evento"
          : disabledBecauseFull
          ? "Já era.."
          : "Se juntar"}
      </Button>
    </ButtonContainer>
  );
}
