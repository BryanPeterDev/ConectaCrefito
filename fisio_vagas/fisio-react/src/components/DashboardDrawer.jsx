import React, { useState } from "react";
import {
  X,
  Plus,
  PencilSimple,
  MapPin,
  Trash,
  SignOut,
} from "@phosphor-icons/react";
import { createPost, deletePost, getCurrentUser } from "../services/api";

const DESCRICAO_TEMPLATE = `Sobre a vaga:


Responsabilidades:


Requisitos:
`;

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

  // Form fields (controlados)
  const [titulo, setTitulo] = useState("");
  const [local, setLocal] = useState("");
  const [modalidade, setModalidade] = useState("presencial");
  const [link, setLink] = useState("");
  const [descricao, setDescricao] = useState(DESCRICAO_TEMPLATE);

  const resetForm = () => {
    setTitulo("");
    setLocal("");
    setModalidade("presencial");
    setLink("");
    setDescricao(DESCRICAO_TEMPLATE);
    setFormError("");
  };

  const handleOpenForm = () => {
    resetForm();
    setSuccessMsg("");
    setIsFormOpen(true);
  };

  const handlePublish = async () => {
    if (!titulo.trim() || !local.trim()) {
      setFormError("Título e localização são obrigatórios.");
      return;
    }
    if (!descricao.trim() || descricao.trim() === DESCRICAO_TEMPLATE.trim()) {
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
      await createPost({
        id_ofertante: me?.id,
        titulo,
        descricao,
        local,
        link,
        publico_alvo: modalidade,
        status: "ativo",
        tags: [],
      });
      resetForm();
      setIsFormOpen(false);
      setSuccessMsg("✅ Vaga publicada com sucesso!");
      // Pequeno delay para a API processar antes de recarregar
      setTimeout(() => {
        onRefetch?.();
      }, 500);
    } catch (err) {
      setFormError(err.message || "Erro ao publicar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteError("");
    try {
      await deletePost(id);
      onRefetch?.();
    } catch (err) {
      setDeleteError(err.message || "Erro ao remover a vaga.");
    }
  };

  const user = getCurrentUser();
  const activeCount = myJobs.filter((j) => j.status === "ativo").length;

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

        {/* ── Formulário de Nova Vaga ── */}
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
              Nova Vaga
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
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Localização *</label>
              <input
                type="text"
                placeholder="Ex: Brasília, DF"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
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
              <textarea
                className="form-group-textarea"
                style={{ height: "180px" }}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>

            <button
              className="btn-primary w-100"
              onClick={handlePublish}
              disabled={submitting}
            >
              {submitting ? "Publicando..." : "Confirmar Publicação"}
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
          {myJobs.length === 0 && !isFormOpen && (
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
          {myJobs.map((job) => (
            <div
              key={job.id}
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
                <button className="btn-ghost" title="Editar">
                  <PencilSimple size={18} />
                </button>
                <button
                  className="btn-ghost"
                  title="Remover"
                  onClick={() => handleDelete(job.id)}
                >
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
