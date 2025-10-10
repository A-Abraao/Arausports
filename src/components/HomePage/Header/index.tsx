import styled from 'styled-components'
import logoUrl from '../../../assets/img/logo-icone.png'
import { AreaDoUsuario } from './AreaDoUsuario'

const HeaderComponent = styled.header`
  align-items: center;
  width: 100%;
  padding: clamp(0.5rem, 1.6vw, 0.65rem) clamp(0.75rem, 4vw, 1.75rem);
  justify-content: space-between;
  display: flex;
  position: fixed;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  background-color: rgba(255, 255, 255, 0.3);

  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  div {
    align-items: center;
    display: flex;
    justify-content: center;
    gap: clamp(0.35rem, 1.2vw, 0.5rem);

    h1 {
      background: var(--gradient-hero);
      font-weight: bold;
      font-size: clamp(1rem, 3.2vw, 1.25rem);
      -webkit-text-fill-color: transparent;
      -webkit-background-clip: text;
    }
  }
`

const LogoComponent = styled.img`
  width: clamp(2.0rem, 6.5vw, 3.5rem);
  height: clamp(2.0rem, 6.5vw, 3.5rem);
  object-fit: contain;
`

function Header() {
  return (
    <HeaderComponent>
      <div>
        <LogoComponent src={logoUrl} />
        <h1>Arausportes</h1>
      </div>

      <AreaDoUsuario />
    </HeaderComponent>
  )
}

export default Header
