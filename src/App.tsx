import styled from "styled-components"
import Login from "./components/Login"
import HomePage from "./components/HomePage"
import AuthListener from "./components/AuthListener"
import { Routes, Route } from "react-router-dom"

const AppComponent = styled.div`
  
`

function App() {
  return (
    <AppComponent>
      <AuthListener />
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/criar-conta" element={<></>}/>
        <Route path="/homepage" element={<HomePage/>}/>
      </Routes>
    </AppComponent>
  );
}

export default App
