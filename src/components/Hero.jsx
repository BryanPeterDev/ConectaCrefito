import React from "react";
import { MagnifyingGlass, MapPin } from "@phosphor-icons/react";
import FundoSite from "../assets/FundoSite.png";

export default function Hero({ searchQuery, setSearchQuery, locationQuery, setLocationQuery, loading }) {
  const [localQuery, setLocalQuery] = React.useState(searchQuery || "");
  const [localLocation, setLocalLocation] = React.useState(locationQuery || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    if (setLocationQuery) setLocationQuery(localLocation);
  };

  return (
    <section 
      className="hero"
      style={{ "--hero-bg-img": `url(${FundoSite})` }}
    >
      <div className="hero-bg-shapes"></div>
      <div className="hero-content">
        <h1>
          Sua próxima grande oportunidade em{" "}
          <span className="highlight">Fisioterapia e Terapia Ocupacional</span>
        </h1>
        <p>
          A maior plataforma de oportunidade para fisioterapeutas e terapeutas
          ocupacionais. Encontre vagas em clínicas, hospitais e home care alinhadas com seu perfil profissional no DF e GO.
        </p>

        <form className="search-box glass-panel" onSubmit={handleSubmit}>
          <div className="search-input-group">
            <MagnifyingGlass size={24} color="var(--primary)" />
            <input
              type="text"
              placeholder="Cargo, especialidade..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
            />
          </div>
          <div className="divider"></div>
          <div className="search-input-group">
            <MapPin size={24} color="var(--primary)" />
            <input
              type="text"
              placeholder="Localização"
              value={localLocation}
              onChange={(e) => setLocalLocation(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-search" disabled={loading}>
            {loading ? "Buscando..." : "Buscar Vagas"}
          </button>
        </form>

      </div>
    </section>
  );
}
