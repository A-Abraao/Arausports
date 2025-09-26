import styled from "styled-components";
import { useState } from "react";
import { EditarPerfilButton } from "./editarPerfil";
import { EditarPerfilPopup } from "./popUp";

const ButtonContainerComponent = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75em;
`

export function ButtonContainer() {
    const [ mostrarPopUp, setMostrarPopUp ] = useState(false)

    const handleMostrarPopUp = () => {
        setMostrarPopUp(true)
    }

    return (
        <ButtonContainerComponent>
            <EditarPerfilButton atualizarEstado={handleMostrarPopUp}/>
            <EditarPerfilPopup open={mostrarPopUp} onClose={() => setMostrarPopUp(false)} onSalvar={() => setMostrarPopUp(false)}/>
        </ButtonContainerComponent>
    )
}