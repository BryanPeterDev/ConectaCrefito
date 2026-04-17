import React, { useState, useEffect } from 'react';
import { MapPin, Briefcase, FileText, HandPointing } from '@phosphor-icons/react';
import "react-quill-new/dist/quill.snow.css";

// Mapeia os campos da API real para o formato de exibição
function normalizeJob(job) {
    return {
        id: job.id,
        title: job.titulo,
        company: job.ofertante?.nome || 'Clínica/Empresa',
        location: job.local || 'Brasília, DF',
        type: job.publico_alvo || 'Presencial',
        postedAt: job.createdAt ? new Date(job.createdAt).toLocaleDateString('pt-BR') : '',
        description: job.descricao || '',
        link: job.link || '',
        status: job.status,
        tags: job.tags || [],
    };
}

export default function JobBoard({ jobs, loading }) {
    const [activeJob, setActiveJob] = useState(null);
    const [activeFilters, setActiveFilters] = useState({ especialidades: [], modalidades: [] });

    const normalized = jobs.map(normalizeJob);

    // Filtragem local por modalidade/especialidade via tags
    const filtered = normalized.filter(job => {
        if (activeFilters.modalidades.length > 0 &&
            !activeFilters.modalidades.some(m => job.type?.toLowerCase().includes(m.toLowerCase()))) {
            return false;
        }
        return true;
    });

    useEffect(() => {
        if (filtered.length > 0) {
            setActiveJob(prev => filtered.find(j => j.id === prev?.id) || filtered[0]);
        }
    }, [jobs]);

    const handleClearFilters = () => {
        setActiveFilters({ especialidades: [], modalidades: [] });
        document.querySelectorAll('.filters-sidebar input[type="checkbox"]').forEach(el => el.checked = false);
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
                Carregando vagas...
            </div>
        );
    }

    const especialidades = ['Neurofuncional', 'Traumato-Ortopédica', 'Cardiorrespiratória', 'Esportiva'];
    const modalidades = ['Presencial', 'Híbrido', 'Home Office'];

    return (
        <main className="job-board-container">

            {/* ─── Sidebar Filtros ─── */}
            <aside className="filters-sidebar glass-panel">
                <div className="filter-header">
                    <h2>Filtros</h2>
                    <button className="btn-link" onClick={handleClearFilters}>Limpar</button>
                </div>

                <div className="filter-group">
                    <h3>Especialidade</h3>
                    {especialidades.map((esp, i) => (
                        <label className="custom-checkbox" key={esp}>
                            <input type="checkbox" defaultChecked={i === 0} />
                            <span className="checkmark"></span>
                            {esp}
                        </label>
                    ))}
                </div>

                <div className="filter-group">
                    <h3>Modalidade</h3>
                    {modalidades.map((mod) => (
                        <label className="custom-checkbox" key={mod}>
                            <input type="checkbox" />
                            <span className="checkmark"></span>
                            {mod}
                        </label>
                    ))}
                </div>
            </aside>

            {/* ─── Painel Direito ─── */}
            <section className="job-listings-panel">

                <div className="listings-header">
                    <p>Mostrando <strong>{filtered.length}</strong> {filtered.length === 1 ? 'vaga' : 'vagas'}</p>
                    <div className="sort-by">
                        <label>Ordenar por:</label>
                        <select defaultValue="recent">
                            <option value="recent">Mais recentes</option>
                            <option value="relevant">Relevância</option>
                        </select>
                    </div>
                </div>

                <div className="split-view">

                    {/* Lista de cards */}
                    <div className="cards-list">
                        {filtered.length === 0 && (
                            <p style={{ color: 'var(--text-muted)', padding: '24px', textAlign: 'center' }}>
                                Nenhuma vaga encontrada.
                            </p>
                        )}
                        {filtered.map(job => (
                            <div
                                key={job.id}
                                className={`job-card ${activeJob?.id === job.id ? 'active' : ''}`}
                                onClick={() => setActiveJob(job)}
                            >
                                <div className="card-header">
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <div className="company-logo">{job.company.charAt(0)}</div>
                                        <div className="card-title-group">
                                            <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>{job.title}</h3>
                                            <p>{job.company}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-meta">
                                    <span className="meta-item"><MapPin size={16} color="var(--primary)" /> {job.location}</span>
                                    <span className="meta-item"><Briefcase size={16} color="var(--primary)" /> {job.type}</span>
                                </div>
                                {job.postedAt && <span className="time-posted">{job.postedAt}</span>}
                            </div>
                        ))}
                    </div>

                    {/* Painel de Detalhes */}
                    <div className="job-details-pane glass-panel">
                        {activeJob ? (
                            <>
                                <div className="detail-header">
                                    <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{activeJob.title}</h2>
                                    <div style={{ marginBottom: '16px', color: 'var(--primary)', fontWeight: 500 }}>
                                        {activeJob.company} &bull; {activeJob.location}
                                    </div>

                                    <div className="card-meta">
                                        <span className="meta-item glass-panel"><Briefcase size={16} /> {activeJob.type}</span>
                                        {activeJob.tags?.length > 0 && activeJob.tags.map(tag => (
                                            <span key={tag} className="tag">{tag}</span>
                                        ))}
                                    </div>

                                    <div className="detail-actions" style={{ marginTop: '16px' }}>
                                        <a
                                            href={activeJob.link || `mailto:contato@crefito11.gov.br?subject=Candidatura - ${activeJob.title}`}
                                            className="btn-primary"
                                            style={{ textDecoration: 'none', display: 'inline-block' }}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Entrar em contato
                                        </a>
                                    </div>
                                </div>

                                <div
                                    className="ql-editor" // <-- Adiciona essa classe mágica
                                    style={{ lineHeight: '1.6', color: 'var(--text-body)', padding: 0 }} // padding: 0 para tirar a borda padrão do editor
                                    dangerouslySetInnerHTML={{ __html: activeJob.description }}
                                />
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
