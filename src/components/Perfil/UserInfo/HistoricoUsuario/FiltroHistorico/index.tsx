import styled from "styled-components";

const FiltroHistoricoComponent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1em;
  justify-content: center;
`;

const Opcao = styled.button<{ selecionado?: boolean }>`
  padding: 0.75em;
  border-radius: 0.35em;
  cursor: pointer;
  background-color: transparent;
  border: 1px solid transparent;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 420;
  font-size: 0.85em;
  width: 100%;

  ${(props) =>
    props.selecionado &&
    `
    color: black;
    border: 1px solid rgba(105, 105, 105, 0.2);
  `}
`;

type Props = {
  selecionado: "meusEventos" | "eventosSalvos"
  onSelect: (opcao: "meusEventos" | "eventosSalvos" ) => void;
};

export function FiltroHistorico({ selecionado, onSelect }: Props) {
  return (
    <FiltroHistoricoComponent>
      <Opcao
        onClick={() => onSelect("meusEventos")}
        selecionado={selecionado === "meusEventos"}
      >
        Meus eventos
      </Opcao>

      <Opcao
        onClick={() => onSelect("eventosSalvos")}
        selecionado={selecionado === "eventosSalvos"}
      >
        Eventos salvos
      </Opcao>

    </FiltroHistoricoComponent>
  );
}
