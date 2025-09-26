import styled from "styled-components";
import { DetalhesEventoContainer } from "../DetalhesEvento";
import ImageUpload from "../ImageUpload";

const PreviaEventoContainer = styled(DetalhesEventoContainer)`
    background: black;
`

export function PreviaEvento() {
    return (
        <PreviaEventoContainer>
            <ImageUpload/>
        </PreviaEventoContainer>
    )
}