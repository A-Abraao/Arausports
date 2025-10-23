import styled from "styled-components";
import { useState } from "react";
import { EditarPerfilButton } from "./editarPerfil";
import { EditarPerfilPopup } from "./popUp";

//componente que cria e estiliza o container dos Buttons
const ButtonContainerComponent = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75em;
`

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
        </ButtonContainerComponent>
    )
}