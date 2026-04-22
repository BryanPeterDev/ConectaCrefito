import React from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import FundoSite from "../assets/FundoSite.png";

export default function Hero({ searchQuery, setSearchQuery }) {
  const [localQuery, setLocalQuery] = React.useState(searchQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localQuery);
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
          ocupacionai. Encontre vagas em hospitais, clínicas, clubes esportivos
          e home care.
        </p>

        <form className="search-box glass-panel" onSubmit={handleSubmit}>
          <div className="search-input-group">
            <MagnifyingGlass size={24} color="var(--primary)" />
            <input
              type="text"
              placeholder="Cargo, especialidade ou palavra-chave..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-search">
            Buscar
          </button>
        </form>

      </div>
    </section>
  );
}
