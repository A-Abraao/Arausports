import styled from "styled-components";
import futebolImage from '../../../../assets/img/evento-de-futebol.jpg'
import { Card } from "./Card";

const EsportesGridComponent = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    flex-wrap: wrap;
`

const informacoesCard = [
    {
        imagem: futebolImage,
        tituloCard: "aquela partida de fut",
        data: "23 de Março, 2025",
        horario: "12:50",
        localizacao: "Parque cachoeira",
        capacidade: "12 nego",
    }
]

export function EsportesGrid() {
    return (
        <EsportesGridComponent>
            {informacoesCard.map((item, index) => {
                return (
                    <Card 
                        key={index}
                        imageUrl={item.imagem}
                        titulo={item.tituloCard}
                        data={item.data}
                        horario={item.horario}
                        localizacao={item.localizacao}
                        capacidade={item.capacidade}
                    />
                )
            })}
        </EsportesGridComponent>
    )
}