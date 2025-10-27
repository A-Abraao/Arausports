import styled from "styled-components";
import { Card } from "./Card";
import BasketBallEvent from '../../../../assets/img/basketball-event.jpg'
import EventoDeFut from '../../../../assets/img/evento-de-futebol.jpg'
import EventoDeTenis from '../../../../assets/img/tennis-event.jpg'
import type { Evento } from ".."; 

const EsportesGridComponent = styled.div`
  /* Centraliza o grid e garante padding lateral simétrico */
  width: 100%;
  max-width: clamp(360px, 90vw, 1200px);
  margin: 0 auto;
  padding-inline: clamp(0.75rem, 2.2vw, 2rem);
  box-sizing: border-box;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(clamp(220px, 28vw, 320px), 1fr));
  gap: clamp(0.75rem, 1.2vw, 1.65rem);
  justify-items: stretch;
  align-items: start;

  /* garante que mensagens (ex.: 'nenhum evento') fiquem centralizadas */
  p {
    width: 100%;
    text-align: center;
    margin: 0;
    padding: clamp(1rem, 1.8vw, 1.5rem);
  }
`;

type Props = {
  eventos: Evento[];
};

export function EsportesGrid({ eventos }: Props) {
  if (!eventos || eventos.length === 0) {
    return (
      <EsportesGridComponent>
        <p>Nenhum evento encontrado.</p>
      </EsportesGridComponent>
    );
  }

  const listaDeImagens = [
    EventoDeTenis,
    EventoDeFut,
    BasketBallEvent
  ];

  const sortearImagem = () => {
    const tamanhoLista = listaDeImagens.length;
    const indiceAleatorio = Math.floor(Math.random() * tamanhoLista);
    return listaDeImagens[indiceAleatorio];
  };

  return (
    <EsportesGridComponent>
      {eventos.map((evento) => {
        const capacidadeMaxima = evento.capacidade;
        const participantes = evento.participantesAtuais ?? 0;
        const eventImage = (evento as any).imageUrl ?? sortearImagem();

        return (
          <Card
            key={evento.id}
            imageUrl={eventImage}
            categoria={evento.categoria}
            titulo={evento.titulo}
            data={evento.data}
            horario={evento.horario}
            localizacao={evento.local}
            capacidadeMaxima={capacidadeMaxima}
            eventoId={evento.id}
            ownerId={evento.ownerId}
            participantesAtuais={participantes}
          />
        );
      })}
    </EsportesGridComponent>
  );
}
