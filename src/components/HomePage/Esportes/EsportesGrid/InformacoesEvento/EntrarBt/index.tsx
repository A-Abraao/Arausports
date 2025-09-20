import styled from "styled-components";
import { Button } from "@mui/material";

const ButtonContainer = styled.div`
    margin-top: 0.75em;
    display: flex;
    align-items: cemter;
    justify-content: flex-end;
`

export function EntrarBt() {
    return (
        <ButtonContainer>
            <Button
                sx={{
                    background: "springgreen",
                    height: "2.5em",
                    borderRadius: "0.5em",
                    textTransform: "none",
                    color: "white",
                }}
            >
                Se juntar
            </Button>
        </ButtonContainer>
    )
}