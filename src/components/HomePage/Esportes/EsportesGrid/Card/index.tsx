import styled from "styled-components";

const CardComponent = styled.div`

`

type imageDivProps = {
    imagem:string
}

const ImageDiv = styled.div<imageDivProps>`
    background-image: url(${props => props.imagem});
    border-top-right-radius: ;
    border-top-left-radius: ;
    height: 35%;
    width: 100%;
`

type CardProps = {
    imageUrl: string,
    titulo: string,
    data:string,
    horario: string,
    localizacao: string,
    capacidade: string
}

export function Card({imageUrl}:CardProps) {
    return (
        <CardComponent>
            <ImageDiv imagem={imageUrl}/>
        </CardComponent>
    )
}