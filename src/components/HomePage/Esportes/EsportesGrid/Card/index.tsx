import styled from "styled-components";
import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { InformacoesEvento } from "../InformacoesEvento";
import { useSalvarEvento } from "../../../../../firebase"; 
import { IconButton } from "@mui/material";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark'; 

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

    &:hover {
      background: var(--ring);
      color: white;
    }
  }
`;

type SalvarButtonProps = {
  ativo:boolean,
  loading: boolean,
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

export const SalvarButton = ({ativo, loading, onClick}: SalvarButtonProps) => {
  const bgcolor = ativo ? "#e91e63" : "white";
  const bgcoloractived = "rgba(194, 24, 91, 1)"
  return (
    <IconButton
      onClick={onClick}
      disabled={loading}
      sx={{
        background: bgcolor,
        borderRadius: "9999px",
        marginRight: "0.45em",
        padding: "6px",

         '&:hover': {
           background: ativo ? bgcoloractived : 'rgba(255, 255, 255, 0.6)',
         }
      }}
    >
      {ativo ? <BookmarkIcon sx={{ fontSize: '1.2rem', color: "white" }}/> : <BookmarkBorderIcon sx={{ fontSize: '1.2rem' }}/>}
      
    </IconButton>
  )
}

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

  
  const { salvo: ativo, salvarEvento, loading } = useSalvarEvento(eventoId);

  const handleSaveClick = async () => {
  if (!eventoId) return;
  
  try {
    await salvarEvento({
      titulo,
      localizacao,
      data: data,
      participantesAtuais,
      categoria,
      ownerId: ownerId ?? null,
    });
    } catch (error) {
      console.error("Erro ao salvar o evento:", error);
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
              ativo={ativo}
              loading={loading}
              onClick={() => handleSaveClick()}
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
