import styled from "styled-components";

const EstastisticasComponent = styled.div`
    display: flex;
    align-items: center;
    gap: 1.5em;

`

const Estastistica = styled.span`
    display: flex;
    flex-direction: column;
    align-items: center;

    .numero {
        font-size: 1.75em;
        font-weight: 550;
    }

    .acao {
        font-size: 0.85em;
        color: var(--cinza);
    }

`

const userEstastics = [
    {
        quantidade: "127",
        acao: "Eventos criados"
    },
    
    {
        quantidade: "342",
        acao: "Participações"
    },
    
    {
        quantidade: "1.27k",
        acao: "Conexões"
    },
    
]

export function Estastisticas() {
    return (
        <EstastisticasComponent>
            {userEstastics.map((item, index) => {
                return (
                    <Estastistica key={index}>
                        <span className="numero">{item.quantidade}</span>
                        <span className="acao">{item.acao}</span>
                    </Estastistica>
                )
            })}
            
        </EstastisticasComponent>
    )
}