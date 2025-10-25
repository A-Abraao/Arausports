import styled from "styled-components";
import { CardEvento } from "./CardEvento";
import { FiltroHistorico } from "./FiltroHistorico";
import { useEventosSalvosComParticipantes } from "../../../../supabase";
import { useRemoverEventoSalvo } from "../../../../supabase";
import { useState } from "react";

//componnete do historico do usuário
const HistoricoUsuarioComponent = styled.section`
  width: 100%;
  display: flex;
  min-height: calc(var(--vh, 1vh) * 50);
  flex-direction: column;
  gap: clamp(0.6rem, 1.4vw, 0.9rem);
  margin-top: clamp(0.9rem, 1.8vw, 2rem);
`;

//função que é chaamda e renderiza tudo
export function HistoricoUsuario() {
  // agora só existe a opção "eventosSalvos"
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<"eventosSalvos">("eventosSalvos");

  //hooks que implementam as funcionalidade de salvar evento e renderizar evento em tempo real
  const { salvos, loading: loadingSalvos, refresh } = useEventosSalvosComParticipantes(null);
  const { removerEvento, loadingSalvo } = useRemoverEventoSalvo();


  //efeitos de loading para fazer o componente esperar o banco de dados mandar as imagens
  const loading = loadingSalvos;

  //lista que renderza se é eventos salvos ou eventos criados quando o cara seleciona as opções no filtro
  const listaParaRender = salvos.map(s => ({
    id: s.savedId, //id do evento
    titulo: s.titulo ?? "", //titulozão
    local: s.localizacao ?? "", //localização
    data: s.data ?? "", //data
    categoria: s.categoria ?? "", //categoria pros cara ver que é real o esporte que eles quer
    capacidade: s.participantes ?? 0, //capacidade, quantidade de gente pode ir
    imageUrl: s.imageUrl ?? null, // url da imagem que vai ser renderizada e mostrar previa do evento
  }));

  //retorna os componentes renderizados, quando for chamar a função ela vai automaticamente renderizar esses componentes na tela
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
        //card evento sendo renderizado e recebendo as props para ele mostrar os dados, tipo assim, ele recebe os dados via props para mostrar no componente 
          key={evento.id} 
          titulo={evento.titulo}
          local={evento.local}
          data={evento.data}
          esporte={evento.categoria}
          capacidade={String(evento.capacidade ?? 0)}
          loadingSalvo={loadingSalvo}
          foiSalvo={true}
          imageUrl={evento.imageUrl}
          onUnsave={async () => {

            const res = await removerEvento(evento.id);
              // se removerEvento retorna okn mas como o hook já faz, apenas vamos refazer o refresh e garanti o realtime
              if ((res as any)?.ok) {
                // recarrega a lista
                await refresh();
              } else {
                // fallback que força o refresh
                await refresh();
              }

          }}
        />
      ))}
    </HistoricoUsuarioComponent>
  );
}
