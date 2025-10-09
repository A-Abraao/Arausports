import styled from "styled-components"
import useVhConfig from "./useVhConfig"
import { Routes, Route } from "react-router-dom"
import Login from "./components/Login"
import HomePage from "./components/HomePage"
import { Perfil } from "./components/Perfil"
import { CriarEvento } from "./components/CriarEvento"
import { CriarConta } from "./components/CriarConta"

const AppComponent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100%;

  ${({ theme }) => theme.breakpoints.down("md")} {
    padding: 1rem;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 0.5rem;
  }
`

function App() {
  useVhConfig()
  return (
    <AppComponent>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/criar-evento" element={<CriarEvento />} />
        <Route path="/criar-conta" element={<CriarConta />} />
      </Routes>
    </AppComponent>
  );
}

export default App;
