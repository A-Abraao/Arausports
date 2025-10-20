import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0.5rem, 1vw, 0.75rem);
  width: 100%;
  margin: clamp(1rem, 3vw, 2rem) auto; 
  padding: clamp(0.75rem, 2vw, 1.5rem) 0;
`;

const ShimmerBox = styled.div`
  width: clamp(40%, 60%, 70%);
  height: clamp(0.6rem, 1vw, 1rem);
  border-radius: clamp(0.25rem, 0.4vw, 0.4rem);
  background: linear-gradient(
    110deg,
    rgba(255, 255, 255, 0.05) 10%,
    rgba(255, 255, 255, 0.2) 30%,
    rgba(255, 255, 255, 0.05) 50%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite linear;
`;

const TextoComPontos = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(0.2rem, 0.4vw, 0.4rem);
  margin-top: clamp(0.5rem, 1vw, 0.75rem);
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  font-weight: 500;
  color: transparent;
  
background-image: linear-gradient(
    110deg,
    rgba(43, 43, 43, 0.4) 0%,
    rgba(43, 43, 43, 0.8) 25%,
    rgba(43, 43, 43, 0.3) 50%,
    rgba(43, 43, 43, 0.8) 75%,
    rgba(43, 43, 43, 0.4) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 2.4s infinite linear;
  animation-delay: 0.6s;

  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;

  &[data-fallback="true"] {
    -webkit-text-fill-color: initial;
    color: #2b2b2b;
    background: none;
    -webkit-background-clip: unset;
    background-clip: unset;
    animation: none;
  }
`;



export default function DivDeCarregamento() {

  const [dots, setDots] = useState<number>(0);
  const [supportsClip, setSupportsClip] = useState<boolean | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d + 1) % 4);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const el = document.createElement("span");
    el.style.webkitBackgroundClip = "text";
    const supported = Boolean(el.style.webkitBackgroundClip);
    setSupportsClip(supported);
  }, []);

  const pontos = ".".repeat(dots);

  return (
    <LoaderWrapper>
      <ShimmerBox />
      <ShimmerBox style={{ width: "80%" }} />
      <ShimmerBox style={{ width: "50%" }} />

      <TextoComPontos data-fallback={supportsClip === false}>
        {`Procurando${pontos}`}
      </TextoComPontos>
    </LoaderWrapper>
  );
}
