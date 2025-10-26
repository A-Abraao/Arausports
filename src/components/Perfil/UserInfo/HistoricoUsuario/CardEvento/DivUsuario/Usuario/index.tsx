import styled from "styled-components";
import bolaDeBasquete from '../../../../../../../assets/img/bola-de-basquete.jpg';
import StarSvg from '../../../../../../../assets/img/trofeu.svg?react';
import { useAuth } from "../../../../../../../supabase";
import { useUserProfile } from "../../../../../../../supabase";

//criar o comonente do usuario que segura todos os elementos dentro, categoria, data, 
const UsuarioComponent = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(0.6rem, 1.4vw, 1rem);
`;

const DivImagem = styled.img`
  border-radius: 9999px;
  height: clamp(2.4rem, 7.5vw, 3.5rem); /* ligeiramente maior */
  width: clamp(2.4rem, 7.5vw, 3.5rem);
  object-fit: cover;

  /* mobile: pequeno aumento adicional para equilibrar com texto reduzido */
  @media (max-width: 420px) {
    height: clamp(2.8rem, 9.5vw, 3.8rem);
    width: clamp(2.8rem, 9.5vw, 3.8rem);
  }
`;


const EventoEData = styled.div`
  display: flex;
  flex-direction: column;
  word-break: break-all;

  span {
    color: var(--muted-foreground);
    display: flex;
    align-items: center;
    gap: clamp(0.25rem, 0.6vw, 0.4rem);
    font-weight: 400;
  }

  .data {
    font-size: clamp(0.8rem, 1.6vw, 0.85rem);
  }

  /* mobile: reduzir tipografia para ficar proporcional ao avatar aumentado */
  @media (max-width: 420px) {
    span {
      font-size: 0.82rem;
      gap: 0.28rem;
    }
    .data {
      font-size: 0.72rem;
    }
  }
`;


type UsuarioProps = {
    data: string;
    foiSalvo: boolean;
};

export function Usuario({ data, foiSalvo }: UsuarioProps) {
    const { user } = useAuth();
    const userId = user?.id ?? null;

    const { profile } = useUserProfile(userId);

    const photoSrc = profile?.photoURL || bolaDeBasquete;

    return (
        <UsuarioComponent>
            <DivImagem src={photoSrc} alt="Foto do usuário" />
            <EventoEData>
                <span>
                    <StarSvg height="0.9em" width="0.9em" />
                    {foiSalvo ? "Evento Salvado" : "Evento Criado"}
                </span>
                <span className="data">{data}</span>
            </EventoEData>
        </UsuarioComponent>
    );
}
