import styled from "styled-components";
import { CardEvento } from "./CardEvento";
import { FiltroHistorico } from "./FiltroHistorico";
import { useUserCreatedEvents } from "../../../../firebase";
import { useEventosSalvosComParticipantes } from "../../../../firebase/eventos/useEventosSalvos";
import { useRemoverEventoSalvo } from "../../../../firebase";
import { useAuth } from "../../../../contexts/AuthContext";
import { useState } from "react";

const HistoricoUsuarioComponent = styled.section`
  width: 100%;
  display: flex;
  min-height: 50vh;
  flex-direction: column;
  gap: 0.9em;
  margin-top: 2em;
`;

export function HistoricoUsuario() {
  const { firebaseUser } = useAuth();
  const userId = firebaseUser?.uid ?? null;

  const [opcaoSelecionada, setOpcaoSelecionada] = useState<"meusEventos" | "eventosSalvos">("eventosSalvos");

  const { createdEvents, loadingCreated } = useUserCreatedEvents(userId);
  const { salvos, loading: loadingSalvos } = useEventosSalvosComParticipantes();
  const { removerEvento, loadingSalvo } = useRemoverEventoSalvo();

  const loading = loadingCreated || loadingSalvos;

  const listaParaRender = opcaoSelecionada === "meusEventos"
    ? createdEvents.map(e => ({
        id: e.id,
        titulo: e.titulo ?? "",
        local: e.local ?? "",
        data: e.data ?? "",
        categoria: e.categoria ?? "",
        capacidade: e.participantesTotais ?? 0,
      }))
    : salvos.map(s => ({
      id: s.savedId, 
      titulo: s.titulo ?? "",
      local: s.localizacao ?? "",
      data: s.data ?? "",
      categoria: s.categoria ?? "",
      capacidade: s.participantesTotais ?? 0,
    }));


  return (
    <HistoricoUsuarioComponent>
      <FiltroHistorico
        selecionado={opcaoSelecionada}
        onSelect={(op) => setOpcaoSelecionada(op)}
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
          foiSalvo={opcaoSelecionada === "eventosSalvos"}
          onUnsave={async () => {
            try {
              await removerEvento(evento.id);
              console.log("evento removido" + evento.id)
            } catch (err) {
              console.error("Erro removendo evento salvo:", err);
            }
          }}
        />
      ))}
    </HistoricoUsuarioComponent>
  );
}
