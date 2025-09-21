import styled from "styled-components";
import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { InformacoesEvento } from "../InformacoesEvento";

const CardComponent = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: 30%;
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
    overflow: hidden; /* crucial: mantém o container do mesmo tamanho */
    display: block;
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

const TipoDoEsporte = styled.span`
    position: absolute;
    top: 0.5em;
    left: 0.5em;
    z-index: 5;
    border-radius: 9999px;
    background: rgba(255,255,255,0.95);
    padding: 0.45em 0.95em;
    font-size: 0.75em;
    font-weight: 450;
    pointer-events: none; /* evita interferir no hover do card */

    &:hover {
        background: var(--ring);
        color: white;
    }
`;

type CardProps = {
    imageUrl: string;
    titulo: string;
    data: string;
    horario: string;
    localizacao: string;
    capacidade: string;
};

export function Card({ imageUrl, titulo, data, horario, localizacao, capacidade }: CardProps) {

  const y = useMotionValue(0);

  const imageScale = useTransform(y, [-8, 0], [1.08, 1]);

  const [hoverAtivado, setHoverAtivado] = useState(false)

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
            <TipoDoEsporte>Futebol</TipoDoEsporte>
            </ImageWrapper>

            <InformacoesEvento
                hoverTitulo={hoverAtivado}
                titulo={titulo}
                data={data}
                horario={horario}
                localizacao={localizacao}
                capacidade={capacidade}
            />
      </MotionCard>
    </CardComponent>
  );
}

export default Card;
