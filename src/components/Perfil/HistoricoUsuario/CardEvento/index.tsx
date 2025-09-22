import styled from "styled-components";

const CardEventoComponent = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding: 2em;
    color: black;
    border-radius: 0.5em;
    overflow: visible;
    overflow-wrap: break-word;
    border: 1px solid rgba(0, 0, 0, 0.08); 
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); 
    will-change: transform;
    transform-origin: center;
    user-select: none;
`

export function CardEvento() {
    return (
        <CardEventoComponent>
                <p>cucu</p>
        </CardEventoComponent>
        
    )
}