import styled from "styled-components";
import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { InformacoesEvento } from "../InformacoesEvento";
import { useSalvarEvento } from "../../../../../supabase";
import { useRemoverEventoSalvo } from "../../../../../supabase";
import { IconButton } from "@mui/material";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark'; 

const CardComponent = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: clamp(14rem, 31%, 22rem);
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
  border-radius: 0.5rem;
  overflow: visible;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
  will-change: transform;
  transform-origin: center;
  cursor: pointer;
  user-select: none;
`;

const ImageWrapper = styled.div`
  position: relative;
  border-top-right-radius: 0.5rem;
  border-top-left-radius: 0.5rem;
  height: clamp(12rem, calc(var(--vh, 1vh) * 40), 22rem);
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
  top: clamp(0.35rem, 1.2vh, 0.6rem);
  left: clamp(0.35rem, 1.2vw, 0.6rem);
  z-index: 5;
  display: flex;
  padding-right: clamp(0.35rem, 0.9vw, 0.5rem);
  align-items: center;
  width: 100%;
  justify-content: space-between;
  font-size: clamp(0.65rem, 0.9vw, 0.9rem);
  font-weight: 450;

  .tipo-esporte {
    border-radius: 9999px;
    background: rgba(255,255,255,0.95);
    padding: clamp(0.25rem, 0.6vw, 0.45rem) clamp(0.55rem, 1.8vw, 0.95rem);
    transition: background-color 0.5s ease-in-out;

    &:hover {
      background: var(--ring);
      color: white;
    }
  }
`;

type SalvarButtonProps = {
  ativo: boolean;
  loading: boolean;
  onClick: () => Promise<void> | void;
  ariaLabel?: string;
};

export const SalvarButton = ({ ativo, loading, onClick, ariaLabel }: SalvarButtonProps) => {
  const bgcolor = ativo ? "#e91e63" : "white";
  const bgcoloractived = "rgba(194, 24, 91, 1)";
  return (
    <IconButton
      onClick={async (e) => {
        e.stopPropagation();
        if (loading) return;
        await onClick();
      }}
      disabled={loading}
      aria-label={ariaLabel ?? (ativo ? "Remover dos salvos" : "Salvar evento")}
      sx={{
        background: bgcolor,
        borderRadius: "9999px",
        mr: "0.45rem",
        p: "0.375rem",
        '&:hover': {
          background: ativo ? bgcoloractived : 'rgba(255, 255, 255, 0.6)',
        }
      }}
    >
      {ativo ? <BookmarkIcon sx={{ fontSize: '1.2rem', color: "white" }}/> : <BookmarkBorderIcon sx={{ fontSize: '1.2rem' }}/>}
    </IconButton>
  );
};

type CardProps = {
  imageUrl: string;
  titulo: string;
  data: string | Date | null;
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

  const { salvo: ativo, setSalvo, salvarEvento, loading: loadingSalvar } = useSalvarEvento(eventoId);
  const { removerPorEventoId, loadingSalvo: loadingRemover } = useRemoverEventoSalvo();

  const isBusy = Boolean(loadingSalvar || loadingRemover);

  const toISO = (d: string | Date | null) => {
    if (!d) return null;
    if (d instanceof Date) return d.toISOString();
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? String(d) : parsed.toISOString();
  };

  const handleSaveClick = async () => {
    if (!eventoId) return;

    try {
      if (ativo) {
        const ok = await removerPorEventoId(eventoId);
        if (ok) {

          setSalvo(false);
        } else {
          console.error("Falha ao remover evento salvo");
        }
      } else {
        setSalvo(true);
        const ok = await salvarEvento({
          titulo,
          localizacao,
          data: toISO(data),
          participantesAtuais,
          categoria,
          ownerId: ownerId ?? null,
        } as any);
        if (!ok) {
          setSalvo(false);
          console.error("Falha ao salvar evento");
        }
      }
    } catch (error) {
      console.error("Erro ao (des)salvar evento:", error);
      if (!ativo) setSalvo(false);
      if (ativo) setSalvo(true); 
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
            <SalvarButton
              ativo={Boolean(ativo)}
              loading={isBusy}
              onClick={handleSaveClick}
            />
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
