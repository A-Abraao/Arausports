import styled from "styled-components";
import FiltroOpcao from "./FiltroOpcao";


const FiltrosComponent = styled.section`
    border-bottom: 1px solid rgba(105, 105, 105, 0.2);
    padding: 1.85em 2.15em;
    display: flex;
    align-items: center;
    gap: 1.75em;
`

export function Filtros() {
    const opcoes = [
        {
            placeholder: "Esportes",
            opcoes: [
                "Qualquer um",
                "Futebol",
                "Volêi",
                "Basquete"
            ],

        },

        {
            placeholder: "Quando",
            opcoes: [
                "Sem data",
                "Esse mês",
                "Essa semana"
            ]
        }
    ]

    return (
        <FiltrosComponent>
            {opcoes.map((item, index) => {
                return (
                    <FiltroOpcao key={index} placeholder={item.placeholder} listaDeOpcoes={item.opcoes}/>
                )
            })}
        </FiltrosComponent>
    )
}