import styled from "styled-components"
import Login from "./components/Login"
import { Routes, Route } from "react-router-dom"

const AppComponent = styled.div`
  
`

function App() {
  
  return (
    <AppComponent>
      <Routes>
        <Route path="/homepage" element={<></>}/>
        <Route path="/" element={<Login/>}/>
      </Routes>

    </AppComponent>
  )
}

export default App
