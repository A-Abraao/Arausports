import styled from "styled-components";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAlert } from "../Alerta/AlertProvider";
import Header from "./Header";
import { Banner } from "./MainBanner";
import { Esportes } from "./Esportes";

const HomePageComponent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [searchTerm, setSearchTerm] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState<string>("");

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
