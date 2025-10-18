import styled from "styled-components";
import bolaDeBasquete from '../../../../../../../assets/img/bola-de-basquete.jpg';
import StarSvg from '../../../../../../../assets/img/trofeu.svg?react';
import { useAuth } from "../../../../../../../supabase";
import { useUserProfile } from "../../../../../../../supabase";

const UsuarioComponent = styled.div`
    display: flex;
    align-items: center;
    gap: clamp(0.6rem, 1.4vw, 1rem);
`;

const DivImagem = styled.img`
    border-radius: 9999px;
    height: clamp(2rem, 6.5vw, 3rem);
    width: clamp(2rem, 6.5vw, 3rem);
    object-fit: cover;
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
