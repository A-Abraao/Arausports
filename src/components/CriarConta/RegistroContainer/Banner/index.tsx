import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Fundo from '../../../../assets/img/sports-hero.jpg';

//wrapper que controla o banner, ele só funciona em desktop ou tela maior
const BannerWrapper = styled.div`
  /* hidden on mobile (banner obsoleto em telas pequenas) */
  display: none;

  @media (min-width: 1024px) {
    display: block;
    position: relative;
    width: 50%;
    height: 100%;
    border-radius: 1.5em;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0,0,0,0.25);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      filter: brightness(0.65);
    }

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to top,
        rgba(0,0,0,0.7) 0%,
        rgba(0,0,0,0.4) 40%,
        rgba(0,0,0,0.0) 100%
      );
      z-index: 1;
    }
  }
`;

//conteúdo do banner
const BannerContent = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2.5em;
  text-align: center;
  color: #fff;

  h1 {
    font-size: 1.8em;
    font-weight: 700;
    line-height: 1.4em;
    text-shadow: 2px 2px 8px rgba(0,0,0,0.6);
    margin: 0 auto;
    max-width: 90%;
  }

  /* slightly smaller text on very large screens */
  @media (min-width: 1400px) {
    h1 { font-size: 2.2em; }
  }
`;

//esses slogans aqui vão passando pelo componente como se fosse um efeito da tela do estádio de futebol
const slogans = [
  "Descubra, participe e compartilhe esportes com a rapaziada!",
  "Crie seu evento e ganhe respeito na quebrada 🏆",
  "O rolê onde o esporte junta a galera de verdade 👊",
  "Chegou a hora: cola, joga e mostra tua vibe! ⚡"
];

//renderizar
export function Banner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slogans.length);
    }, 5000); // troca a cada 5s

    return () => clearInterval(timer); //retornar ao estado inicial quando ele chega no último slogan
  }, []);

  return (
    <BannerWrapper>
      <img src={Fundo} alt="Esporte e comunidade" />
      <BannerContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror"
              }}
            >
              {slogans[index]}
            </motion.h1>
          </motion.div>
        </AnimatePresence>
      </BannerContent>
    </BannerWrapper>
  );
}
