import styled from "styled-components";
import ImagemEvento from '../../../../../../assets/img/evento-de-futebol.jpg'

const ImagemCardComponent = styled.div`
    background-image: url(${ImagemEvento});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 0.5rem;
    width: 100%;
    height: calc(var(--vh, 1vh) * 95);
    will-change: transform;
`;

export function CardImagem() {
    return (
        <ImagemCardComponent/>
    )
}
