import styled from "styled-components";
import { Card } from "./Card";
import BasketBallEvent from '../../../../assets/img/basketball-event.jpg'
import EventoDeFut from '../../../../assets/img/evento-de-futebol.jpg'
import EventoDeTenis from '../../../../assets/img/tennis-event.jpg'
import type { Evento } from ".."; 

const EsportesGridComponent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.65em;
  flex-wrap: wrap;
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
  ]

  const sortearImagem = () => {
    const tamanhoLista = listaDeImagens.length

    const indiceAleatorio = Math.floor(Math.random() * tamanhoLista)

    return listaDeImagens[indiceAleatorio]
  }


  return (
    <EsportesGridComponent>
      {eventos.map((evento) => {
        const capacidadeMaxima = evento.capacidade;
        const participantes = evento.participantesAtuais ?? 0;

        return (
          <Card
            key={evento.id}
            imageUrl={sortearImagem()}
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
