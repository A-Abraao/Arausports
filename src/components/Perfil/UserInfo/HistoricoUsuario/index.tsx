import styled from "styled-components";
import { CardEvento } from "./CardEvento";
import { FiltroHistorico } from "./FiltroHistorico";
import { useEventosSalvosComParticipantes } from "../../../../supabase";
import useMeusEventosComParticipantes from "../../../../supabase/eventos/useMeusEventosComparticipantes";
import { useRemoverEventoSalvo } from "../../../../supabase";
import { useDeleteEvent } from "../../../../supabase";
import { useState } from "react";
import { useAlert } from "../../../Alerta/AlertProvider";

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
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<"meusEventos" | "eventosSalvos">("meusEventos");

  //hooks que implementam as funcionalidade de salvar evento e renderizar evento em tempo real
  const { salvos, loading: loadingEventosSalvos, refresh: refreshSalvos } = useEventosSalvosComParticipantes(null);
  const { removerEvento, loadingSalvo } = useRemoverEventoSalvo();
  const { deletarEvento } = useDeleteEvent()
  const { eventos, loading:loadingEventosCriados, refreshCriados } = useMeusEventosComParticipantes()

  //importa o hook de showAlert para mostrar mensagens que alguma coisa aconteceu no durante a remoção/exclusao de evento
  const { showAlert } = useAlert()

  //efeitos de loading para fazer o componente esperar o banco de dados mandar as imagens
  const loadingSalvos = loadingEventosSalvos;
  const loadingCriados = loadingEventosCriados


  //lista que renderza se é eventos salvos ou eventos criados quando o cara seleciona as opções no filtro
  const listaParaRender = opcaoSelecionada == "eventosSalvos" ? salvos.map(s => ({
    id: s.savedId, //id do evento
    titulo: s.titulo ?? "", //titulozão
    local: s.localizacao ?? "", //localização
    data: s.data ?? "", //data
    categoria: s.categoria ?? "", //categoria pros cara ver que é real o esporte que eles quer
    capacidade: s.participantes ?? 0, //capacidade, quantidade de gente pode ir
    imageUrl: s.imageUrl ?? null, // url da imagem que vai ser renderizada e mostrar previa do evento
  })) : 
  eventos.map(e => ({
    id: e.id,
    titulo: e.titulo ?? "",
    local: e.local?? "",
    data: e.data ?? "",
    categoria: e.categoria ?? "",
    capacidade: e.participantesAtual ?? 0,
    imageUrl: e.imageUrl ?? null,
}));

  //retorna os componentes renderizados, quando for chamar a função ela vai automaticamente renderizar esses componentes na tela
  return (
    <HistoricoUsuarioComponent>
      <FiltroHistorico
        selecionado={opcaoSelecionada}
        onSelect={(op) => {
          // verifica se op esta vazio antes de passar o valor da opção sleecionada para o state, serve para impedir erros devido a ausencia de valor
          if (op) setOpcaoSelecionada(op);
        }}
      />

      {!(
        (opcaoSelecionada === "eventosSalvos" && loadingSalvos) ||
        (opcaoSelecionada === "meusEventos" && loadingCriados)
      ) && listaParaRender.length === 0 && (
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
                await refreshSalvos();
              } else {
                // fallback que força o refresh
                await refreshSalvos();
              }

          }}
          //aqui ele passa o hook de excluir o evento
          onDelete={
            //usa um operador ternário para verificar se a opção selecionada foi meus eventos, se a opção foi realmente meus eventos, ele passa o hook se não ele passa undefined
            opcaoSelecionada === "meusEventos"
              ? async () => {
                  //hook é coloando dentro de uma variavel para sabermos se ele deu certo quando for executado
                  const res = await deletarEvento(evento.id)
                  if (res.ok) {
                    // sucesso: lança refresh na UI para criar efeito de realtime (atualização em tempo real sem reaload)
                    await refreshCriados?.();
                    showAlert("Evento apagado", {
                      severity: "success",
                      duration: 3000,
                      variant: "standard",
                    })

                  } else {
                    // lidar com erro (exibir toast / console)
                    showAlert("Erro ao apagar evento :(", {
                      severity: "error",
                      duration: 3000,
                      variant: "standard",
                    })
                    console.error("Não foi possível deletar:", res.error);
                  }
                }
              : undefined
          }
        />
      ))}
    </HistoricoUsuarioComponent>
  );
}
