import React from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";

export default function Hero() {
  return (
    <section className="hero">
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

        <form
          className="search-box glass-panel"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="search-input-group">
            <MagnifyingGlass size={24} color="var(--primary)" />
            <input
              type="text"
              placeholder="Cargo, especialidade ou palavra-chave..."
            />
          </div>
          <button type="submit" className="btn-search">
            Buscar
          </button>
        </form>

        <div className="trending-searches">
          <span>Populares:</span>
          <span className="tag">Neurofuncional</span>
          <span className="tag">Traumato-Ortopédica</span>
          <span className="tag">Home Care</span>
          <span className="tag">UTI</span>
        </div>
      </div>
    </section>
  );
}
