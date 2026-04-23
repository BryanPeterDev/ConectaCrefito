import React, { useState } from "react";
import {
  X,
  Plus,
  PencilSimple,
  MapPin,
  Trash,
  SignOut,
  Warning,
} from "@phosphor-icons/react";
import { createPost, updatePost, deletePost, getCurrentUser } from "../services/api";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const formatText = (str) => {
  if (!str) return str;
  const lower = str.toLowerCase();
  const prepositions = ['de', 'da', 'do', 'das', 'dos', 'em', 'na', 'no', 'nas', 'nos', 'e', 'ou', 'com', 'por', 'para', 'a', 'o', 'as', 'os'];
  const acronyms = ['UTI', 'DF', 'GO', 'SP', 'RJ', 'MG', 'CLT', 'PJ', 'RN', 'CE', 'PE', 'PB', 'BA', 'AL', 'SE', 'PI', 'MA', 'PA', 'AP', 'AM', 'RR', 'AC', 'RO', 'TO', 'MT', 'MS', 'PR', 'SC', 'RS', 'ES'];
  return lower.split(/\s+/).map((word, index) => {
    if (!word) return '';
    if (index !== 0 && prepositions.includes(word)) {
      return word;
    }
    const upperWord = word.toUpperCase();
    if (acronyms.includes(upperWord)) {
        return upperWord;
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
};

const DESCRICAO_TEMPLATE = `<p><strong>Sobre a vaga:</strong></p><p><br></p><p><strong>Responsabilidades:</strong></p><p><br></p><p><strong>Requisitos:</strong></p>`;

const SELECT_STYLE = {
  width: "100%",
  padding: "12px 16px",
  border: "1px solid var(--border-color)",
  borderRadius: "var(--radius-sm)",
  background: "var(--bg-main)",
  color: "var(--text-strong)",
  outline: "none",
};

export default function DashboardDrawer({
  isOpen,
  onClose,
  myJobs = [],
  onRefetch,
  onLogout,
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { id, titulo }

  // Form fields (controlados)
  const [titulo, setTitulo] = useState("");
  const [local, setLocal] = useState("");
  const [modalidade, setModalidade] = useState("presencial");
  const [link, setLink] = useState("");
  const [descricao, setDescricao] = useState(DESCRICAO_TEMPLATE);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const resetForm = () => {
    setEditingId(null);
    setTitulo("");
    setLocal("");
    setModalidade("presencial");
    setLink("");
    setDescricao(DESCRICAO_TEMPLATE);
    setTags([]);
    setTagInput("");
    setFormError("");
  };

  const handleOpenForm = () => {
    resetForm();
    setSuccessMsg("");
    setIsFormOpen(true);
  };

  const handleEditClick = (job) => {
    setFormError("");
    setSuccessMsg("");
    setEditingId(job.id);
    setTitulo(job.titulo || "");
    setLocal(job.local || "");
    setModalidade(job.publico_alvo || "presencial");
    setLink(job.link || "");
    setDescricao(job.descricao || DESCRICAO_TEMPLATE);
    // Normalize tags robustly to always produce a clean string[].
    let parsedTags = [];
    if (Array.isArray(job.tags)) {
      parsedTags = job.tags
        .map((t) => (typeof t === 'string' ? t.trim() : String(t).trim()))
        .filter(Boolean);
    } else if (typeof job.tags === 'string' && job.tags.trim()) {
      parsedTags = job.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }
    setTags(parsedTags);
    setIsFormOpen(true);
    setTimeout(() => {
      const drawerContent = document.querySelector(".dashboard-drawer-content");
      if (drawerContent) {
        drawerContent.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);
  };

  const handleAddTag = (e) => {
    if (e && e.key !== "Enter") return;
    if (e) e.preventDefault();
    const val = tagInput.trim();
    if (val && !tags.includes(val)) {
      setTags((prev) => [...prev, val]);
      setTagInput("");
    }
  };

  // Use index to safely remove even if two tags share the same value.
  const handleRemoveTag = (indexToRemove) => {
    setTags((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handlePublish = async () => {
    if (!titulo.trim() || !local.trim()) {
      setFormError("Título e localização são obrigatórios.");
      return;
    }
    if (!descricao.trim() || descricao.trim() === DESCRICAO_TEMPLATE.trim() || descricao.trim() === '<p><br></p>') {
      setFormError(
        "A descrição da vaga é obrigatória e precisa ser preenchida.",
      );
      return;
    }
    if (
      !link.trim() ||
      !(link.startsWith("http://") || link.startsWith("https://"))
    ) {
      setFormError("Informe um link válido (ex: https://crefito11.gov.br).");
      return;
    }
    setFormError("");
    setSuccessMsg("");
    setSubmitting(true);
    try {
      const me = getCurrentUser();
      
      // Limpeza do HTML para o banco de dados ficar mais legível
      let htmlFormatado = descricao.replace(/&nbsp;/g, ' ');
      htmlFormatado = htmlFormatado.replace(/<\/p>/g, '</p>\n');
      htmlFormatado = htmlFormatado.replace(/<ul>/g, '<ul>\n');
      htmlFormatado = htmlFormatado.replace(/<\/ul>/g, '</ul>\n');
      htmlFormatado = htmlFormatado.replace(/<li>/g, '  <li>');
      htmlFormatado = htmlFormatado.replace(/<\/li>/g, '</li>\n');
      htmlFormatado = htmlFormatado.trim();

      if (editingId) {
        const payload = {
          titulo,
          descricao: htmlFormatado,
          local,
          link,
          publico_alvo: modalidade,
          tags: tags.map((t) => String(t).trim()).filter(Boolean).join(','),
        };
        const result = await updatePost(editingId, payload);
        setSuccessMsg("✅ Vaga atualizada com sucesso!");
      } else {
        await createPost({
          id_ofertante: me?.id,
          titulo,
          descricao: htmlFormatado,
          local,
          link,
          publico_alvo: modalidade,
          status: "ativo",
          tags,
        });
        setSuccessMsg("✅ Vaga publicada com sucesso!");
      }

      resetForm();
      setIsFormOpen(false);
      // Pequeno delay para a API processar antes de recarregar
      setTimeout(() => {
        onRefetch?.();
      }, 500);
    } catch (err) {
      setFormError(err.message || "Erro ao salvar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id, titulo) => {
    setDeleteConfirm({ id, titulo });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    setDeleteError("");
    try {
      await deletePost(deleteConfirm.id);
      onRefetch?.();
      setDeleteConfirm(null);
    } catch (err) {
      setDeleteError(err.message || "Erro ao remover a vaga.");
      setDeleteConfirm(null);
    }
  };

  const user = getCurrentUser();
  const activeCount = Array.isArray(myJobs) ? myJobs.filter((j) => j && j.status === "ativo").length : 0;

  return (
    <aside className={`dashboard-drawer ${isOpen ? "open" : ""}`}>
      <div className="dashboard-drawer-header">
        <h2 style={{ fontSize: "1.25rem" }}>Minhas Vagas</h2>
        <button
          className="modal-close"
          style={{ position: "static" }}
          onClick={onClose}
        >
          <X size={24} />
        </button>
      </div>

      <div className="dashboard-drawer-content">
        {user && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--text-muted)",
                margin: 0,
              }}
            >
              Olá, <strong>{user.nome ?? user.name ?? user.email}</strong>
            </p>
            <button
              className="btn-ghost"
              onClick={onLogout}
              style={{
                padding: "6px 12px",
                fontSize: "0.85rem",
                color: "#FE5B59",
              }}
            >
              <SignOut size={16} /> Sair
            </button>
          </div>
        )}

        <div
          className="dashboard-stats"
          style={{ gridTemplateColumns: "1fr 1fr", marginBottom: "24px" }}
        >
          <div className="stat-card glass-panel" style={{ padding: "16px" }}>
            <h4>Ativas</h4>
            <span style={{ fontSize: "1.8rem" }}>{activeCount}</span>
          </div>
          <div className="stat-card glass-panel" style={{ padding: "16px" }}>
            <h4>Total</h4>
            <span style={{ fontSize: "1.8rem" }}>{myJobs.length}</span>
          </div>
        </div>

        {deleteError && (
          <p
            style={{
              color: "#FE5B59",
              marginBottom: "12px",
              fontSize: "0.9rem",
            }}
          >
            {deleteError}
          </p>
        )}

        {successMsg && (
          <p
            style={{
              color: "#32D0B0",
              marginBottom: "12px",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            {successMsg}
          </p>
        )}

        {!isFormOpen && (
          <button
            className="btn-primary w-100"
            style={{
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onClick={handleOpenForm}
          >
            <Plus size={20} /> Publicar Nova Vaga
          </button>
        )}

        {/* ── Formulário de Nova Vaga / Edição ── */}
        {isFormOpen && (
          <div
            className="auth-form glass-panel active"
            style={{
              marginBottom: "24px",
              padding: "16px",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <h3
              style={{
                marginBottom: "12px",
                fontSize: "1.1rem",
                color: "var(--text-strong)",
              }}
            >
              {editingId ? "Editar Vaga" : "Nova Vaga"}
            </h3>

            {formError && (
              <p
                style={{
                  color: "#FE5B59",
                  marginBottom: "12px",
                  fontSize: "0.9rem",
                }}
              >
                {formError}
              </p>
            )}

            <div className="form-group">
              <label>Título *</label>
              <input
                type="text"
                placeholder="Ex: Fisioterapeuta UTI"
                value={titulo}
                onChange={(e) => setTitulo(formatText(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Localização *</label>
              <input
                type="text"
                placeholder="Ex: Brasília, DF"
                value={local}
                onChange={(e) => setLocal(formatText(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Modalidade</label>
              <select
                value={modalidade}
                onChange={(e) => setModalidade(e.target.value)}
                style={SELECT_STYLE}
              >
                <option value="presencial">Presencial</option>
                <option value="hibrido">Híbrido</option>
                <option value="homeoffice">Home Office</option>
              </select>
            </div>
            <div className="form-group">
              <label>Link de Candidatura *</label>
              <input
                type="url"
                placeholder="https://crefito11.gov.br"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <ReactQuill
                theme="snow"
                value={descricao}
                onChange={setDescricao}
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                    [{ 'align': [] }],
                    ['link'],
                    ['clean']
                  ],
                }}
              />
            </div>

            <div className="form-group">
              <label>Tags (Pressione Enter para adicionar)</label>
              <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <input
                  type="text"
                  placeholder="Ex: UTI, Home Care, Pilates..."
                  value={tagInput}
                  onChange={(e) => setTagInput(formatText(e.target.value))}
                  onKeyDown={handleAddTag}
                />
                <button
                  className="btn-primary"
                  type="button"
                  style={{ width: "auto", padding: "0 16px" }}
                  onClick={() => handleAddTag()}
                >
                  +
                </button>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  flexWrap: "wrap",
                  minHeight: "24px",
                }}
              >
                {tags.map((tag, idx) => (
                  <span
                    key={`${tag}-${idx}`}
                    className="tag"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "4px 8px",
                      fontSize: "0.75rem",
                    }}
                  >
                    {tag}
                    <X
                      size={12}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRemoveTag(idx)}
                    />
                  </span>
                ))}
              </div>
            </div>

            <button
              className="btn-primary w-100"
              onClick={handlePublish}
              disabled={submitting}
            >
              {submitting ? "Salvando..." : (editingId ? "Confirmar Edição" : "Confirmar Publicação")}
            </button>
            <button
              className="btn-ghost w-100"
              onClick={() => setIsFormOpen(false)}
              style={{ marginTop: "8px" }}
            >
              Cancelar
            </button>
          </div>
        )}

        {/* ── Lista de vagas ── */}
        <div className="dashboard-jobs-list">
          {(!Array.isArray(myJobs) || myJobs.length === 0) && !isFormOpen && (
            <p
              style={{
                color: "var(--text-muted)",
                textAlign: "center",
                marginTop: "24px",
              }}
            >
              Nenhuma vaga publicada ainda.
            </p>
          )}
          {Array.isArray(myJobs) && myJobs.map((job) => (
            <div
              key={job?.id || Math.random()}
              className="dashboard-job-card glass-panel"
              style={{ marginBottom: 0 }}
            >
              <div>
                <h3
                  style={{
                    color: "var(--text-strong)",
                    fontSize: "1.05rem",
                    marginBottom: "4px",
                  }}
                >
                  {job.titulo}
                </h3>
                <p
                  className="meta-item"
                  style={{
                    display: "inline-flex",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    fontSize: "0.8rem",
                    margin: 0,
                  }}
                >
                  <MapPin size={16} /> {job.local}
                </p>
                {Array.isArray(job.tags) && job.tags.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                      marginTop: "6px",
                      flexWrap: "wrap",
                    }}
                  >
                    {job.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--text-muted)",
                          border: "1px solid var(--border-color)",
                          padding: "1px 5px",
                          borderRadius: "4px",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  flexWrap: "wrap",
                  marginTop: "8px",
                }}
              >
                <span
                  className="tag"
                  style={{
                    backgroundColor: "var(--primary-light)",
                    color: "var(--primary)",
                    padding: "4px 8px",
                    fontSize: "0.8rem",
                    textTransform: "capitalize",
                  }}
                >
                  {job.status}
                </span>
                <button className="btn-ghost" title="Editar" onClick={() => handleEditClick(job)}>
                  <PencilSimple size={18} />
                </button>
                <button
                  className="btn-ghost"
                  title="Remover"
                  onClick={() => handleDelete(job.id, job.titulo)}
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ color: '#FE5B59', marginBottom: '16px' }}>
              <Warning size={48} weight="fill" />
            </div>
            <h3 style={{ marginBottom: '12px' }}>Excluir Vaga</h3>
            <p style={{ color: 'var(--text-base)', marginBottom: '24px', lineHeight: '1.5' }}>
              Tem certeza que deseja excluir a vaga <strong>"{deleteConfirm.titulo}"</strong>?<br/>
              Esta ação não pode ser desfeita.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn-ghost" 
                style={{ flex: 1, marginTop: 0 }} 
                onClick={() => setDeleteConfirm(null)}
              >
                Cancelar
              </button>
              <button 
                className="btn-primary" 
                style={{ flex: 1, backgroundColor: '#FE5B59', borderColor: '#FE5B59', color: 'white' }} 
                onClick={confirmDelete}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
