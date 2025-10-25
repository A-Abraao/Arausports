import styled from "styled-components";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAlert } from "../Alerta/AlertProvider";
import Header from "./Header";
import { Banner } from "./MainBanner";
import { Esportes } from "./Esportes";

//container da homepage é criado pel styled-componets
const HomePageComponent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  padding-top: 5em;
  flex-direction: column;
`;

//função que renderiza ele juntamente com os componentes que ele encapsula
export default function HomePage() {
  //aqui nos temos o useLocation para recuperar o popup  que mostra quando o login deu sucesso
  const location = useLocation();
  //navegar para outras regios
  const navigate = useNavigate();
  //hooks para mostrar os alerts de aviso que tem erro
  const { showAlert } = useAlert();

  //state para permitir o usuario pesquisar no site
  const [searchTerm, setSearchTerm] = useState<string>("");

  //state que permite ele fazer a busca
  const [searchQuery, setSearchQuery] = useState<string>("");

  //useEffect que tem como principal objetivo recuperar o alert de login bem sucessedido
  useEffect(() => {
    const state = location.state as any;
    if (state?.fromLogin) {
      showAlert("salve rapax", {
        severity: "success",
        duration: 2800,
        variant: "standard",
      });

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, showAlert]);

  //permitir a busca
  const handleSearch = (query: string) => {
    setSearchQuery(query.trim());
  };

  return (
    <HomePageComponent>
      <Header />
      <Banner
        value={searchTerm}
        onChange={setSearchTerm}
        onSearch={() => handleSearch(searchTerm)}
      />
      <Esportes searchQuery={searchQuery}/>
    </HomePageComponent>
  );
}
