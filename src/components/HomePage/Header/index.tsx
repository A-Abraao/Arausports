import styled from 'styled-components'
import logoUrl from '../../../assets/img/logo-icone.png'
import { AreaDoUsuario } from './AreaDoUsuario'

const HeaderComponent = styled.header`
    align-items: center;
    width: 100%;
    padding: 0.65em 1.75em;
    justify-content: space-between;
    display: flex;
    position: sticky;
    top: 0;
    z-index: 50;
    width: 100%;
    border-bottom: 1px solid #e5e7eb; 
     background-color: rgba(255, 255, 255, 0.3);
    
    
    backdrop-filter: blur(8px); 
    
    -webkit-backdrop-filter: blur(8px);

    div {
        align-items: center;
        display: flex;
        justify-content: center;
        gap: 0.5em;

        h1 {
            background: var(--gradient-hero);
            font-weight: bold;
            font-size: 1.25em;
            -webkit-text-fill-color: transparent;
            -webkit-background-clip: text;
        }
    }
`

const LogoComponent = styled.img`
    width: 3.5em;
    height: 3.5em;
`

function Header() {
    return (
        <HeaderComponent>
            <div>
                <LogoComponent src={logoUrl}/>
                <h1>Arausportes</h1>
            </div>
            
            <AreaDoUsuario/>
        </HeaderComponent>
    )
}

export default Header