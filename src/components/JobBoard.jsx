import React, { useState, useMemo } from "react";
import {
  MapPin,
  Briefcase,
  HandPointing,
  ShareNetwork,
} from "@phosphor-icons/react";

// Mapeia os campos da API real para o formato de exibição
function formatType(val) {
  if (!val) return "Presencial";
  const str = val.toLowerCase().replace(/\s+/g, "");
  if (str === "homeoffice") return "Home Office";
  if (str === "hibrido" || str === "h\u00edbrido") return "H\u00edbrido";
  return "Presencial";
}

// Remove acentos para busca insensível a diacríticos
function norm(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalizeJob(job) {
  if (!job) return { id: Math.random() };
  return {
    id: job.id,
    title: job.titulo || "Sem título",
    company: job.ofertante?.nome || job.empresa || "Clínica/Empresa",
    location: job.local || "Local não informado",
    type: formatType(job.publico_alvo),
    postedAt: (job.createdAt || job.created_at || job.data_criacao)
      ? new Date(job.createdAt || job.created_at || job.data_criacao).toLocaleDateString("pt-BR")
      : "",
    description: job.descricao || "",
    link: job.link || "",
    status: job.status || "ativo",
    tags: Array.isArray(job.tags) 
      ? job.tags 
      : (typeof job.tags === 'string' ? job.tags.split(',').map(t => t.trim()) : []),
  };
}

export default function JobBoard({ jobs, loading, searchQuery, locationQuery }) {
  const [activeJobId, setActiveJobId] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    especialidades: [],
    modalidades: [],
  });
  const [sortBy, setSortBy] = useState("recent");

  const normalized = useMemo(() => jobs.map(normalizeJob), [jobs]);


  // Filtragem e Ordenação
  const filteredAndSorted = useMemo(() => {
    let result = normalized.filter((job) => {
      // 1. Pesquisa por texto (se houver searchQuery)
      if (searchQuery) {
        const query = norm(searchQuery);
        const matchesText =
          norm(job.title).includes(query) ||
          norm(job.description).includes(query) ||
          job.tags?.some((t) => norm(t).includes(query));
        if (!matchesText) return false;
      }

      if (locationQuery) {
        const locQuery = norm(locationQuery);
        const matchesLocation = norm(job.location).includes(locQuery);
        if (!matchesLocation) return false;
      }

      // 2. Filtro de Modalidade
      if (activeFilters.modalidades.length > 0) {
        const matchesModalidade = activeFilters.modalidades.includes(job.type);
        if (!matchesModalidade) return false;
      }

      // 3. Filtro de Especialidade — busca em título, tags e descrição (sem acento)
      if (activeFilters.especialidades.length > 0) {
        const matchesEspecialidade = activeFilters.especialidades.some((esp) => {
          const q = norm(esp);
          return (
            norm(job.title).includes(q) ||
            norm(job.description).includes(q) ||
            job.tags?.some((t) => norm(t).includes(q))
          );
        });
        if (!matchesEspecialidade) return false;
      }

      return true;
    });

    // 4. Ordenação
    result.sort((a, b) => {
      if (sortBy === "recent") {
        // Na falta de um timestamp real confiável em todos os objetos, usaremos o createdAt se disponível
        const timeA = jobs.find(j => j.id === a.id)?.createdAt || 0;
        const timeB = jobs.find(j => j.id === b.id)?.createdAt || 0;
        return new Date(timeB).getTime() - new Date(timeA).getTime();
      }
      
      if (sortBy === "relevant" && searchQuery) {
        const query = searchQuery.toLowerCase();
        const aTitleMatch = a.title?.toLowerCase().includes(query);
        const bTitleMatch = b.title?.toLowerCase().includes(query);
        if (aTitleMatch && !bTitleMatch) return -1;
        if (!aTitleMatch && bTitleMatch) return 1;
      }
      return 0;
    });

    return result;
  }, [normalized, searchQuery, locationQuery, activeFilters, sortBy, jobs]);

  const filtered = filteredAndSorted;

  const activeJob = useMemo(() => {
    if (filtered.length === 0) return null;
    const selected = filtered.find(j => j.id === activeJobId);
    return selected || filtered[0];
  }, [filtered, activeJobId]);

  const handleToggleFilter = (type, value) => {
    setActiveFilters((prev) => {
      const current = prev[type];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [type]: next };
    });
  };

  const handleClearFilters = () => {
    setActiveFilters({ especialidades: [], modalidades: [] });
  };

  const [sharing, setSharing] = useState(false);

  const handleShare = (e, jobId) => {
    e.stopPropagation();
    if (sharing) return;
    
    setSharing(true);
    const shareUrl = `${window.location.origin}${window.location.pathname}?vaga=${jobId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setTimeout(() => setSharing(false), 2000);
    }).catch(() => {
      setSharing(false);
    });
  };

  const modalidades = ["Presencial", "Híbrido", "Home Office"];

  // Especialidades fixas solicitadas
  const especialidades = [
    "Ortopédica",
    "Neurológica",
    "Respiratória",
    "Esportiva",
    "Geriátrica",
    
  ];

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px",
          color: "var(--text-muted)",
        }}
      >
        <div
          className="loading-spinner"
          style={{ margin: "0 auto 16px" }}
        ></div>
        Carregando vagas...
      </div>
    );
  }

  return (
    <main className="job-board-container">
      {/* ─── Sidebar Filtros ─── */}
      <aside className="filters-sidebar glass-panel">
        <div className="filter-header">
          <h2>Filtros</h2>
          <button className="btn-link" onClick={handleClearFilters}>
            Limpar
          </button>
        </div>

        <div className="filter-group">
          <h3>Especialidade</h3>
          {especialidades.map((esp) => (
            <label className="custom-checkbox" key={esp}>
              <input
                type="checkbox"
                checked={activeFilters.especialidades.includes(esp)}
                onChange={() => handleToggleFilter("especialidades", esp)}
              />
              <span className="checkmark"></span>
              {esp}
            </label>
          ))}
        </div>

        <div className="filter-group">
          <h3>Modalidade</h3>
          {modalidades.map((mod) => (
            <label className="custom-checkbox" key={mod}>
              <input
                type="checkbox"
                checked={activeFilters.modalidades.includes(mod)}
                onChange={() => handleToggleFilter("modalidades", mod)}
              />
              <span className="checkmark"></span>
              {mod}
            </label>
          ))}
        </div>
      </aside>

      {/* ─── Painel Direito ─── */}
      <section className="job-listings-panel">
        <div className="listings-header">
          <p>
            Mostrando <strong>{filtered.length}</strong>{" "}
            {filtered.length === 1 ? "vaga" : "vagas"}
          </p>
          <div className="sort-by">
            <label>Ordenar por:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Mais recentes</option>
              <option value="relevant">Relevância</option>
            </select>
          </div>
        </div>

        <div className="split-view">
          {/* Lista de cards */}
          <div className="cards-list">
            {filtered.length === 0 && (
              <p
                style={{
                  color: "var(--text-muted)",
                  padding: "24px",
                  textAlign: "center",
                }}
              >
                Nenhuma vaga encontrada.
              </p>
            )}
            {filtered.map((job) => (
              <div
                key={job.id}
                className={`job-card ${activeJob?.id === job.id ? "active" : ""}`}
                onClick={() => setActiveJobId(job.id)}
              >
                <div className="card-header">
                  <div style={{ display: "flex", gap: "16px" }}>
                    <div className="company-logo">{job.company.charAt(0)}</div>
                    <div className="card-title-group">
                      <h3 style={{ fontSize: "1.05rem", marginBottom: "4px" }}>
                        {job.title}
                      </h3>
                      <p>{job.company}</p>
                    </div>
                  </div>
                </div>
                <div className="card-meta">
                  <span className="meta-item">
                    <MapPin size={16} color="var(--primary)" /> {job.location}
                  </span>
                  <span className="meta-item">
                    <Briefcase size={16} color="var(--primary)" /> {job.type}
                  </span>
                </div>
                {Array.isArray(job.tags) && job.tags.length > 0 && (
                  <div className="card-tags-row" style={{ marginTop: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {job.tags.map((tag, idx) => (
                      <span key={`${job.id}-tag-${idx}`} className="tag" style={{ fontSize: '0.75rem', padding: '3px 8px' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {job.postedAt && (
                  <span className="time-posted">{job.postedAt}</span>
                )}
              </div>
            ))}
          </div>

          {/* Painel de Detalhes */}
          <div className="job-details-pane glass-panel">
            {activeJob ? (
              <>
                <div className="detail-header">
                  <h2 style={{ fontSize: "1.6rem", marginBottom: "8px" }}>
                    {activeJob.title}
                  </h2>
                  <div
                    style={{
                      marginBottom: "16px",
                      color: "var(--primary)",
                      fontWeight: 500,
                    }}
                  >
                    {activeJob.company} &bull; {activeJob.location}
                  </div>

                  <div className="card-meta" style={{ marginBottom: '16px' }}>
                    <span className="meta-item glass-panel">
                      <Briefcase size={16} /> {activeJob.type}
                    </span>
                    {activeJob.postedAt && (
                      <span className="meta-item glass-panel">
                        Publicado em: {activeJob.postedAt}
                      </span>
                    )}
                  </div>
                  
                  {Array.isArray(activeJob.tags) && activeJob.tags.length > 0 && (
                    <div className="detail-tags-section" style={{ marginBottom: '24px' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>Tags:</p>
                      <div className="detail-tags-row" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {activeJob.tags.map((tag, idx) => (
                          <span key={`${activeJob.id}-detail-tag-${idx}`} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="detail-actions" style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <a
                      href={
                        activeJob.link ||
                        `mailto:contato@crefito11.gov.br?subject=Candidatura - ${activeJob.title}`
                      }
                      className="btn-primary"
                      style={{
                        textDecoration: "none",
                        display: "inline-block",
                      }}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Entrar em contato
                    </a>
                    <button 
                      className="btn-outline-small" 
                      onClick={(e) => handleShare(e, activeJob.id)}
                      disabled={sharing}
                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px", fontSize: "1rem" }}
                    >
                      <ShareNetwork size={20} /> {sharing ? "Copiado!" : "Compartilhar"}
                    </button>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Sobre a vaga</h3>
                  <div
                    className="job-description-content"
                    style={{
                      fontFamily: "inherit",
                      lineHeight: "1.6",
                      color: "var(--text-body)",
                    }}
                    dangerouslySetInnerHTML={{ __html: activeJob.description }}
                  />
                </div>
              </>
            ) : (
              <div className="empty-state">
                <HandPointing size={48} />
                <p>Selecione uma vaga para ver os detalhes</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
