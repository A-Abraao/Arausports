import styled from "styled-components";
import { CardEvento } from "./CardEvento";
import { FiltroHistorico } from "./FiltroHistorico";
import { useEventosSalvosComParticipantes } from "../../../../supabase";
import { useRemoverEventoSalvo } from "../../../../supabase";
import { useState } from "react";

const HistoricoUsuarioComponent = styled.section`
  width: 100%;
  display: flex;
  min-height: calc(var(--vh, 1vh) * 50);
  flex-direction: column;
  gap: clamp(0.6rem, 1.4vw, 0.9rem);
  margin-top: clamp(0.9rem, 1.8vw, 2rem);
`;

export function HistoricoUsuario() {
  // agora só existe a opção "eventosSalvos"
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<"eventosSalvos">("eventosSalvos");

  const { salvos, loading: loadingSalvos } = useEventosSalvosComParticipantes(null);
  const { removerEvento, loadingSalvo } = useRemoverEventoSalvo();

  const loading = loadingSalvos;

  const listaParaRender = salvos.map(s => ({
    id: s.savedId,
    titulo: s.titulo ?? "",
    local: s.localizacao ?? "",
    data: s.data ?? "",
    categoria: s.categoria ?? "",
    capacidade: s.participantes ?? 0,
  }));

  return (
    <HistoricoUsuarioComponent>
      <FiltroHistorico
        selecionado={opcaoSelecionada}
        onSelect={(op) => {
          // ainda aceita onSelect, mas só há "eventosSalvos"
          if (op === "eventosSalvos") setOpcaoSelecionada(op);
        }}
      />

      {loading && <p>Peraí, peraí...</p>}

      {!loading && listaParaRender.length === 0 && (
        <p style={{ textAlign: "center", color: "rgba(0,0,0,0.6)", marginTop: "1em" }}>
          Sem eventos mano :(
        </p>
      )}

      {listaParaRender.map((evento) => (
        <CardEvento
          key={evento.id}
          titulo={evento.titulo}
          local={evento.local}
          data={evento.data}
          esporte={evento.categoria}
          capacidade={String(evento.capacidade ?? 0)}
          loadingSalvo={loadingSalvo}
          foiSalvo={true}
          onUnsave={async () => {
            try {
              await removerEvento(evento.id);
            } catch (err) {
              console.error("Erro ao remover salvo:", err);
            }
          }}
        />
      ))}
    </HistoricoUsuarioComponent>
  );
}
