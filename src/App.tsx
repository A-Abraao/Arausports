import styled from "styled-components"
import Login from "./components/Login"
import HomePage from "./components/HomePage"
import { Routes, Route } from "react-router-dom"
import { Perfil } from "./components/Perfil"
import { CriarEvento } from "./components/CriarEvento"
import { CriarConta } from "./components/CriarConta"

const AppComponent = styled.div`
  
`

function App() {

  return (

    <AppComponent>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/homepage" element={<HomePage/>}/>
        <Route path="/perfil" element={<Perfil/>}/>
        <Route path="/criar-evento" element={<CriarEvento/>}/>
        <Route path="/criar-conta" element={<CriarConta/>}/>
      </Routes>
    </AppComponent>
  );
}

export default App
