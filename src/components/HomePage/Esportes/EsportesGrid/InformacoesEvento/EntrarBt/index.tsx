import styled from "styled-components";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { auth, db } from "../../../../../../firebase/config";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useJoinEvent } from "../../../../../../firebase";
import { useExitEvent } from "../../../../../../firebase";
import { useIcrementParticipation } from "../../../../../../firebase";

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
  const [openConfirm, setOpenConfirm] = useState(false);

  const user = auth.currentUser;

  const { joinEvent, loading: loadingJoin } = useJoinEvent();
  const { exitEvent, loading: loadingExit } = useExitEvent();
  const { incrementParticipacoes, decrementParticipacoes } = useIcrementParticipation(user?.uid);

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
        console.error("Erro ao observar evento:", err);
      }
    );

    return () => unsub();
  }, [ownerId, eventoId]);

  const handlePrimaryClick = async () => {
    if (!user || !ownerId) return;

    if (isParticipando) {
      setOpenConfirm(true);
      return;
    }

    try {
      await joinEvent(eventoId, ownerId, user.uid);
      if (incrementParticipacoes) await incrementParticipacoes(1);
      setIsParticipando(true);
    } catch (err: any) {
      console.error("Erro ao entrar no evento:", err);
      throw err;
    }
  };

  const handleConfirmExit = async () => {
    if (!user || !ownerId) return;

    try {
      await exitEvent(eventoId, ownerId, user.uid);
      if (decrementParticipacoes) await decrementParticipacoes(1);
      setIsParticipando(false);
      setOpenConfirm(false);
    } catch (err: any) {
      console.error("Erro ao sair do evento:", err);
      setOpenConfirm(false);
      throw err;
    }
  };

  const handleCancelExit = () => {
    setOpenConfirm(false);
  };

  const loadingAction = loadingJoin || loadingExit;
  const disabledBecauseFull = isFull && !isParticipando;

  return (
    <ButtonContainer>
      <Button
        disabled={disabledBecauseFull || loadingAction || !user}
        sx={{
          background: isParticipando ? "crimson" : disabledBecauseFull ? "#999" : "springgreen",
          height: "2.5em", 
          borderRadius: "0.5em", 
          textTransform: "none",
          color: "white",
          fontWeight: 500,
          "&:hover": {
            background: isParticipando ? "darkred" : disabledBecauseFull ? "#999" : "mediumseagreen",
          },
        }}
        onClick={handlePrimaryClick}
      >
        {loadingAction ? "Processando..." : isParticipando ? "Sair do evento" : disabledBecauseFull ? "Já era.." : "Se juntar"}
      </Button>

      <Dialog
        open={openConfirm}
        onClose={handleCancelExit}
        aria-labelledby="confirm-exit-title"
        aria-describedby="confirm-exit-description"
        BackdropProps={{
          sx: {
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            backgroundColor: "rgba(0,0,0,0.25)",
            transition: "all 200ms ease",
          },
        }}
        PaperProps={{
          sx: {
            width: "min(420px, 90%)",
            maxWidth: "420px",
            borderRadius: "0.65rem",
            overflow: "hidden",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 1.5, 
            "&::before": {
              content: '""',
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: "6px",
              background: "var(--gradient-hero)", 
              zIndex: 10,
            },
            boxShadow: "0 18px 50px rgba(0,0,0,0.12)",
            paddingBottom: "0.5em",
          },
        }}
      >
        <DialogTitle
          id="confirm-exit-title"
          sx={{
            pt: 3.5,
            pb: 0.5,
            fontWeight: 600,
            textAlign: "left",
          }}
          >
          Não quer ir mesmo?
        </DialogTitle>

        <DialogContent
          sx={{
            px: 3,
            py: 1,
            textAlign: "left",
            fontSize: "0.95rem",
            color: "rgba(0,0,0,0.8)",
          }}
        >
          <DialogContentText id="confirm-exit-description" sx={{ fontWeight: 520 }}>
            Sua presença vai ser muito importante nesse evento mano. Eu iria se fosse você..
          </DialogContentText>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2.2,
            pt: 1,
            gap: 0.5,
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={handleCancelExit}
            disabled={loadingExit}
            sx={{
              textTransform: "none",
              color: "white",
              background: "var(--gradient-hero)",
              "&:hover": { filter: "brightness(0.9)" },
              fontWeight: 500,
              height: "2.4em",
              fontSize: "0.9rem",
              px: 2.8,
              
            }}
          >
            Deixa quieto
          </Button>

          <Button
            onClick={handleConfirmExit}
            variant="contained"
            disabled={loadingExit}
            sx={{
              textTransform: "none",
              color: "white",
              background: "#FF4757",
              "&:hover": { background: "#e03b4c" },
              fontWeight: 700,
              height: "2.4em",
              fontSize: "0.9rem",
              px: 2.8,
            }}
            autoFocus
          >
            {loadingExit ? <CircularProgress size={20} color="inherit" /> : "Sim"}
          </Button>
        </DialogActions>
      </Dialog>

    </ButtonContainer>
  );
}
