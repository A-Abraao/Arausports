import styled from "styled-components";
import { Card } from "./Card";
import type { Evento } from ".."; 

const EsportesGridComponent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.75em;
  flex-wrap: wrap;
`;


function imageForCategory(cat?: string) {
  if (!cat) return "/assets/img/evento-de-futebol.jpg";
  const c = cat.toLowerCase();
  if (c.includes("fut") || c.includes("futsal") || c.includes("futebol")) return "/assets/img/evento-de-futebol.jpg";
  if (c.includes("volei") || c.includes("vôlei")) return "/assets/img/evento-de-volei.jpg";
  if (c.includes("basquete")) return "/assets/img/evento-de-basquete.jpg";
  return "/assets/img/evento-de-futebol.jpg";
}

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

  return (
    <EsportesGridComponent>
      {eventos.map((evento) => {
        const capacidadeMaxima = evento.capacidade;
        const participantes = evento.participantesAtuais ?? 0;

        return (
          <Card
            key={evento.id}
            imageUrl={imageForCategory(evento.categoria)}
            categoria={evento.categoria}
            titulo={evento.titulo}
            data={evento.data}
            horario={evento.horario}
            localizacao={evento.local}
            capacidadeMaxima={capacidadeMaxima}
            participantesAtuais={participantes}
          />
        );
      })}
    </EsportesGridComponent>
  );
}
