import styled from "styled-components";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { InformacoesEvento } from "../InformacoesEvento";
import { IconButton } from "@mui/material";
import SalvarSvg from '../../../../../assets/img/salvar.svg?react'
import { onAuth } from "../../../../../firebase"; 
import {
  saveEventForUser,
  removeSavedEventForUser,
  isEventSavedForUser,
} from "../../../../../servicos/eventosSalvos"

const CardComponent = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 31%;
  overflow: visible;
  position: relative;

  p, h2, span {
    overflow-wrap: break-word;
  }
`;

const MotionCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 0.5em;
  overflow: visible;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
  will-change: transform;
  transform-origin: center;
  cursor: pointer;
  user-select: none;
`;

const ImageWrapper = styled.div`
  position: relative;
  border-top-right-radius: 0.5em;
  border-top-left-radius: 0.5em;
  height: 40vh;
  width: 100%;
  overflow: hidden;
`;

const MotionImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform-origin: center center; 
  will-change: transform;
  user-select: none;
`;

const SecaoSuperiorDiv = styled.span`
  position: absolute;
  top: 0.5em;
  left: 0.5em;
  z-index: 5;
  display: flex;
  padding-right: 0.5em;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  font-size: 0.75em;
  font-weight: 450;

  .tipo-esporte {
    border-radius: 9999px;
    background: rgba(255,255,255,0.95);
    padding: 0.45em 0.95em;
    transition: background-color 0.5s ease-in-out;

    &: hover {
      background: var(--ring);
      color: white;
    }
  }
`;

export const BlurButton = styled(IconButton)<{ ativo: boolean }>`
  backdrop-filter: blur(6px);
  background-color: ${({ ativo }) => (ativo ? "white" : "transparent")};
  border-radius: 4px;
  padding: 4px;
  transition: background-color 0.2s ease-in-out;

  svg {
    width: 0.9em;
    height: 0.9em;
    color: ${({ ativo }) => (ativo ? "#000" : "#080341")}; /* usa currentColor */
    transition: color 0.2s ease-in-out;
  }
`;

type CardProps = {
  imageUrl: string;
  titulo: string;
  data: string;
  horario: string;
  localizacao: string;
  capacidadeMaxima: number;
  participantesAtuais: number;
  categoria?: string;
  eventoId: string;
  ownerId?: string;
};

export function Card({
  imageUrl,
  titulo,
  data,
  horario,
  localizacao,
  capacidadeMaxima,
  participantesAtuais,
  eventoId,
  ownerId,
  categoria = "Evento",
}: CardProps) {
  const y = useMotionValue(0);
  const imageScale = useTransform(y, [-8, 0], [1.08, 1]);
  const [hoverAtivado, setHoverAtivado] = useState(false);

  const [ativo, setAtivo] = useState(false);
  const [loadingSalvar, setLoadingSalvar] = useState(false);

  const [currentUserUid, setCurrentUserUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubAuth = onAuth((user) => {
      setCurrentUserUid(user?.uid ?? null);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    let mounted = true;
    const checkSaved = async () => {
      if (!currentUserUid) {
        if (mounted) setAtivo(false);
        return;
      }
      try {
        const saved = await isEventSavedForUser(currentUserUid, eventoId);
        if (mounted) setAtivo(saved);
      } catch (err) {
        console.error("Erro checando saved:", err);
      }
    };
    checkSaved();
    return () => {
      mounted = false;
    };
  }, [currentUserUid, eventoId]);

  const handleSaveToggle = async () => {
    if (!currentUserUid) {
      console.warn("Faça login para salvar eventos");
      return;
    }

    setLoadingSalvar(true);
    try {
      if (!ativo) {
        await saveEventForUser(currentUserUid, {
          id: eventoId,
          ownerId: ownerId ?? "",
          titulo,
          categoria,
          local: localizacao,
          data,
          capacidade: capacidadeMaxima,
        });
        setAtivo(true);
      } else {
        await removeSavedEventForUser(currentUserUid, eventoId);
        setAtivo(false);
      }
    } catch (err) {
      console.error("Erro ao salvar/desalvar evento:", err);
    } finally {
      setLoadingSalvar(false);
    }
  };

  return (
    <CardComponent>
      <MotionCard
        style={{ y }}
        initial={{ y: 0 }}
        whileHover={{
          y: -4,
          boxShadow: "0 18px 50px rgba(0,0,0,0.15)",
          zIndex: 20,
        }}
        whileFocus={{
          y: -4,
          boxShadow: "0 18px 50px rgba(0,0,0,0.15)",
          zIndex: 20,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        tabIndex={0}
        role="button"
        aria-label={titulo}
        onHoverStart={() => setHoverAtivado(true)}
        onHoverEnd={() => setHoverAtivado(false)}
      >
        <ImageWrapper>
          <MotionImage
            src={imageUrl}
            alt={titulo}
            style={{ scale: imageScale }}
            draggable={false}
          />
          <SecaoSuperiorDiv>
            <span className="tipo-esporte">{categoria}</span>  
            <BlurButton
              ativo={ativo}
              onClick={handleSaveToggle}
              disabled={loadingSalvar}
            >
              <SalvarSvg height="0.9em" width="0.9em"/> 
            </BlurButton>
          </SecaoSuperiorDiv>
        </ImageWrapper>

        <InformacoesEvento
          hoverTitulo={hoverAtivado}
          titulo={titulo}
          data={data}
          horario={horario}
          localizacao={localizacao}
          capacidadeMaxima={capacidadeMaxima}
          participantesAtuais={participantesAtuais}
          eventoId={eventoId}
          ownerId={ownerId}
        />
      </MotionCard>
    </CardComponent>
  );
}

export default Card;
