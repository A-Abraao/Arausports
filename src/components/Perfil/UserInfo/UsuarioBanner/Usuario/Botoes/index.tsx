import styled from "styled-components";
import { useState } from "react";
import { EditarPerfilButton } from "./editarPerfil";
import { EditarPerfilPopup } from "./popUp";
import { DeslogarBt } from "./deslogarButton";

//componente que cria e estiliza o container dos Buttons
export const ButtonContainerComponent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75em;
  flex-wrap: nowrap;

  /* Forçar os botões a ocuparem menos espaço visual sem alterar props JS */
  /* Seletores amplos para pegar botões MUI, elementos <button> ou links estilizados */
  & > button,
  & > a,
  & .MuiButton-root,
  & button[class*="MuiButton"] {
    /* tornar o botão um inline-flex centrado para garantir altura e quebra de texto correta */
    display: inline-flex;
    align-items: center;
    justify-content: center;

    /* tipografia responsiva (mantendo !important para compatibilidade com MUI) */
    font-size: clamp(0.63rem, 1.55vw, 0.8rem) !important;

    /* aumentar padding para dar mais "altura" visual aos botões */
    padding: clamp(0.31rem, 0.95vw, 0.55rem) clamp(0.75rem, 1.55vw, 0.95rem) !important;

    /* garantir altura mínima maior para evitar botões muito baixos */
    min-height: clamp(1.6rem, 3.8vw, 2.40rem) !important;
    height: auto !important;

    /* permitir que o texto quebre automaticamente em telas pequenas */
    line-height: 1.1;
    white-space: normal !important;
    word-break: break-word;
    overflow-wrap: anywhere;

    min-width: unset !important;
    box-sizing: border-box;
    text-align: center;
  }

  /* Ao reduzir a tela, reduzimos o gap entre botões */
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-top: clamp(0.42rem, 1.9vw, 0.58rem);
    gap: 0.45em;
  }

  /* Em telas muito pequenas, permitir pequena rolagem horizontal antes de empilhar */
  ${({ theme }) => theme.breakpoints.down("xs")} {
    overflow-x: auto;
    margin-top: clamp(0.42rem, 1.9vw, 0.58rem);
    -webkit-overflow-scrolling: touch;
    gap: 0.4em;
  }
`;

//função que mostra o componente, ou seja, essa função vai renderizar o ButtonComponent lá
export function ButtonContainer() {
    //Estado para gerenciar o comportamento de aparecer/sumir do popup
    const [ mostrarPopUp, setMostrarPopUp ] = useState(false)

    //Handler que permite o popup sumir e desaparecer
    const handleMostrarPopUp = () => {
        setMostrarPopUp(true)
    }

    //Renderização final do componente
    return (
        <ButtonContainerComponent>
            <EditarPerfilButton atualizarEstado={handleMostrarPopUp}/>
            <EditarPerfilPopup open={mostrarPopUp} onClose={() => setMostrarPopUp(false)} onSalvar={() => setMostrarPopUp(false)} />
            <DeslogarBt/>
        </ButtonContainerComponent>
    )
}