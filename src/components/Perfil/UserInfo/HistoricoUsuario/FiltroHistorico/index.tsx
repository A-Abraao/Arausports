import styled from "styled-components";

const FiltroHistoricoComponent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: clamp(0.6rem, 1.4vw, 1rem);
  justify-content: center;
`;

const Opcao = styled.button<{ selecionado?: boolean }>`
  padding: clamp(0.45rem, 1.1vw, 0.75rem);
  border-radius: 0.35rem;
  cursor: pointer;
  background-color: transparent;
  border: 1px solid transparent;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 420;
  font-size: clamp(0.8rem, 1.6vw, 0.85rem);
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
