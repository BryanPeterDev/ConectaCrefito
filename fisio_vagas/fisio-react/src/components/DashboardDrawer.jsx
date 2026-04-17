import React, { useState } from 'react';
import { X, Plus, PencilSimple, MapPin, Trash } from '@phosphor-icons/react';
import { createPost, deletePost, getCurrentUser } from '../services/api';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const DESCRICAO_TEMPLATE = `Sobre a vaga:


Responsabilidades:


Requisitos:
`;

const SELECT_STYLE = {
    width: '100%', padding: '12px 16px',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--bg-main)',
    color: 'var(--text-strong)',
    outline: 'none',
};

export default function DashboardDrawer({ isOpen, onClose, myJobs = [], onRefetch }) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [deleteError, setDeleteError] = useState('');

    // Form fields (controlados)
    const [titulo, setTitulo] = useState('');
    const [local, setLocal] = useState('');
    const [modalidade, setModalidade] = useState('presencial');
    const [link, setLink] = useState('');
    const [descricao, setDescricao] = useState(DESCRICAO_TEMPLATE);

    const resetForm = () => {
        setTitulo('');
        setLocal('');
        setModalidade('presencial');
        setLink('');
        setDescricao(DESCRICAO_TEMPLATE);
        setFormError('');
    };

    const handleOpenForm = () => {
        resetForm();
        setIsFormOpen(true);
    };

    const handlePublish = async () => {
        if (!titulo.trim() || !local.trim()) {
            setFormError('Título e localização são obrigatórios.');
            return;
        }
        setFormError('');
        setSubmitting(true);
        try {
            await createPost({ titulo, descricao, local, link, publico_alvo: modalidade, status: 'ativo', tags: [] });
            resetForm();
            setIsFormOpen(false);
            onRefetch?.();
        } catch (err) {
            setFormError(err.message || 'Erro ao publicar. Tente novamente.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        setDeleteError('');
        try {
            await deletePost(id);
            onRefetch?.();
        } catch (err) {
            setDeleteError(err.message || 'Erro ao remover a vaga.');
        }
    };

    const user = getCurrentUser();
    const activeCount = myJobs.filter(j => j.status === 'ativo').length;

    return (
        <aside className={`dashboard-drawer ${isOpen ? 'open' : ''}`}>
            <div className="dashboard-drawer-header">
                <h2 style={{ fontSize: '1.25rem' }}>Minhas Vagas</h2>
                <button className="modal-close" style={{ position: 'static' }} onClick={onClose}>
                    <X size={24} />
                </button>
            </div>

            <div className="dashboard-drawer-content">
                {user && (
                    <p style={{ marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Olá, <strong>{user.nome ?? user.name ?? user.email}</strong>
                    </p>
                )}

                <div className="dashboard-stats" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '24px' }}>
                    <div className="stat-card glass-panel" style={{ padding: '16px' }}>
                        <h4>Ativas</h4>
                        <span style={{ fontSize: '1.8rem' }}>{activeCount}</span>
                    </div>
                    <div className="stat-card glass-panel" style={{ padding: '16px' }}>
                        <h4>Total</h4>
                        <span style={{ fontSize: '1.8rem' }}>{myJobs.length}</span>
                    </div>
                </div>

                {deleteError && (
                    <p style={{ color: '#FE5B59', marginBottom: '12px', fontSize: '0.9rem' }}>{deleteError}</p>
                )}

                {!isFormOpen && (
                    <button
                        className="btn-primary w-100"
                        style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        onClick={handleOpenForm}
                    >
                        <Plus size={20} /> Publicar Nova Vaga
                    </button>
                )}

                {/* ── Formulário de Nova Vaga ── */}
                {isFormOpen && (
                    <div className="auth-form glass-panel active" style={{ marginBottom: '24px', padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                        <h3 style={{ marginBottom: '12px', fontSize: '1.1rem', color: 'var(--text-strong)' }}>Nova Vaga</h3>

                        {formError && <p style={{ color: '#FE5B59', marginBottom: '12px', fontSize: '0.9rem' }}>{formError}</p>}

                        <div className="form-group">
                            <label>Título *</label>
                            <input type="text" placeholder="Ex: Fisioterapeuta UTI" value={titulo} onChange={e => setTitulo(e.target.value)} maxLength={250} />
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted, #888)', display: 'block', textAlign: 'right', marginTop: '4px' }}>
                                {titulo.length}/250
                            </span>
                        </div>
                        <div className="form-group">
                            <label>Localização *</label>
                            <input type="text" placeholder="Ex: Brasília, DF" value={local} onChange={e => setLocal(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Modalidade</label>
                            <select value={modalidade} onChange={e => setModalidade(e.target.value)} style={SELECT_STYLE}>
                                <option value="presencial">Presencial</option>
                                <option value="hibrido">Híbrido</option>
                                <option value="homeoffice">Home Office</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Link de Candidatura</label>
                            <input type="url" placeholder="https://..." value={link} onChange={e => setLink(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Descrição</label>

                            <ReactQuill
                                theme="snow"
                                value={descricao}
                                onChange={setDescricao} // O Quill passa a string HTML direto para o estado
                                style={{
                                    height: '140px', // Altura da área de digitação
                                    marginBottom: '40px' // Margem extra porque a barra de ferramentas (toolbar) ocupa espaço
                                }}
                            />
                        </div>

                        <button className="btn-primary w-100" onClick={handlePublish} disabled={submitting}>
                            {submitting ? 'Publicando...' : 'Confirmar Publicação'}
                        </button>
                        <button className="btn-ghost w-100" onClick={() => setIsFormOpen(false)} style={{ marginTop: '8px' }}>
                            Cancelar
                        </button>
                    </div>
                )}

                {/* ── Lista de vagas ── */}
                <div className="dashboard-jobs-list">
                    {myJobs.length === 0 && !isFormOpen && (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '24px' }}>
                            Nenhuma vaga publicada ainda.
                        </p>
                    )}
                    {myJobs.map(job => (
                        <div key={job.id} className="dashboard-job-card glass-panel" style={{ marginBottom: 0 }}>
                            <div>
                                <h3 style={{ color: 'var(--text-strong)', fontSize: '1.05rem', marginBottom: '4px' }}>
                                    {job.titulo}
                                </h3>
                                <p className="meta-item" style={{ display: 'inline-flex', borderRadius: '4px', padding: '4px 8px', fontSize: '0.8rem', margin: 0 }}>
                                    <MapPin size={16} /> {job.local}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
                                <span className="tag" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 8px', fontSize: '0.8rem', textTransform: 'capitalize' }}>
                                    {job.status}
                                </span>
                                <button className="btn-ghost" title="Editar"><PencilSimple size={18} /></button>
                                <button className="btn-ghost" title="Remover" onClick={() => handleDelete(job.id)}>
                                    <Trash size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
