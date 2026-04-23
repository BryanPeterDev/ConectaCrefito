// ============================================================
// Camada de serviço central – toda comunicação com a API real
// Em dev, as chamadas /api/* são interceptadas pelo proxy do Vite
// (vite.config.js) e redirecionadas para hmintranet.crefito11.gov.br
// Em produção, configure a variável de ambiente VITE_API_URL
// ============================================================

// ── Helpers internos ────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL ?? "";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function setCookie(name, value, maxAgeSeconds) {
  document.cookie = `${name}=${value}; max-age=${maxAgeSeconds}; path=/; samesite=strict`;
}

function deleteCookie(name) {
  document.cookie = `${name}=; max-age=0; path=/`;
}

function getHeaders(withAuth = false) {
  const headers = { "Content-Type": "application/json" };
  if (withAuth) {
    const token = getCookie("fisio_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function ensureSession() {
  if (getCookie("fisio_token")) return; // Token atual ainda é válido
  const refreshToken = localStorage.getItem("fisio_refresh_token");
  if (!refreshToken) throw new Error("Não autenticado");

  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/ofertante/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) throw new Error("Refresh negado");
    const data = await res.json();
    if (data.token) setCookie("fisio_token", data.token, 900);
    if (data.refresh_token)
      localStorage.setItem("fisio_refresh_token", data.refresh_token);
  } catch (e) {
    logout();
    throw new Error("Sessão expirada. Faça login novamente.");
  }
}

async function handleResponse(res) {
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text };
  }
  if (!res.ok) {
    let msg = data?.message || data?.erro;
    if (!msg && data?.detail) {
      msg =
        typeof data.detail === "string"
          ? data.detail
          : JSON.stringify(data.detail);
    }
    throw new Error(msg || `Erro ${res.status}`);
  }
  return data;
}

// ── Sessão local ────────────────────────────────────────────

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem("fisio_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return (
    !!getCookie("fisio_token") || !!localStorage.getItem("fisio_refresh_token")
  );
}

export function logout() {
  const token = getCookie("fisio_token");
  const refreshToken = localStorage.getItem("fisio_refresh_token");
  // Invalida o refresh token no backend (API exige body + Authorization)
  if (refreshToken) {
    fetch(`${BASE_URL}/api/v1/auth/ofertante/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    }).catch(() => {});
  }
  // Limpa tudo localmente
  deleteCookie("fisio_token");
  localStorage.removeItem("fisio_refresh_token");
  localStorage.removeItem("fisio_user");
}

// ── Auth ─────────────────────────────────────────────────────

/**
 * Pede ao servidor que envie um código de 6 dígitos por e-mail.
 * Usado tanto para login quanto para confirmar cadastro.
 */
export async function requestCode(email) {
  const res = await fetch(`${BASE_URL}/api/v1/auth/ofertante/codigo`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ email }),
  });
  return handleResponse(res);
}

/**
 * Autentica com e-mail + código recebido por e-mail.
 * Persiste token e dados do usuário no localStorage.
 */
export async function loginWithCode(email, codigo) {
  const res = await fetch(`${BASE_URL}/api/v1/auth/ofertante/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ email, codigo }),
  });
  const data = await handleResponse(res);

  if (data.token) {
    // Salva no cookie. 900 segundos = 15 minutos
    setCookie("fisio_token", data.token, 900);
  }
  if (data.refresh_token) {
    localStorage.setItem("fisio_refresh_token", data.refresh_token);
  }

  // Aceita diferentes formatos de resposta da API
  const user = data.ofertante ?? data.user ?? data;
  if (user?.id) localStorage.setItem("fisio_user", JSON.stringify(user));
  return { token: data.token, user };
}

/**
 * Registra novo ofertante (recrutador/empresa).
 * Após o registro a API envia um código de confirmação por e-mail.
 */
export async function registerOfertante({ nome, documento, email, tipo }) {
  const res = await fetch(`${BASE_URL}/api/v1/ofertante`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ nome, documento, email, tipo }),
  });
  return handleResponse(res);
}

// ── Posts (Vagas) ────────────────────────────────────────────

/** Lista todas as vagas públicas */
export async function getPosts() {
  const res = await fetch(`${BASE_URL}/api/v1/posts`, {
    method: "GET",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

/** Lista apenas as vagas do ofertante autenticado */
export async function getMyPosts() {
  await ensureSession();
  const user = getCurrentUser();
  const id = user?.id;
  if (!id) return { dados: [] };
  const res = await fetch(`${BASE_URL}/api/v1/posts?id_ofertante=${id}`, {
    method: "GET",
    headers: getHeaders(true),
  });
  return handleResponse(res);
}

/** Cria uma nova vaga (requer autenticação) */
export async function createPost({
  id_ofertante,
  titulo,
  descricao,
  local,
  link,
  publico_alvo,
  status,
  tags,
}) {
  await ensureSession();
  const res = await fetch(`${BASE_URL}/api/v1/posts`, {
    method: "POST",
    headers: getHeaders(true), //Para autenticar o usuario, para funções que sao usadas apenas para quem esta logado
    body: JSON.stringify({
      id_ofertante: Number(id_ofertante),
      titulo,
      descricao,
      local,
      link: link || "",
      publico_alvo,
      status: status ?? "ativo",
      tags: Array.isArray(tags) ? tags : [],
    }),
  });
  return handleResponse(res);
}

/** Atualiza campos de uma vaga existente (requer autenticação) */
export async function updatePost(id, fields) {
  await ensureSession();
  const res = await fetch(`${BASE_URL}/api/v1/posts/${id}`, {
    method: "PUT",
    headers: getHeaders(true),
    body: JSON.stringify(fields),
  });
  return handleResponse(res);
}

/** Remove uma vaga (requer autenticação) */
export async function deletePost(id) {
  await ensureSession();
  const res = await fetch(`${BASE_URL}/api/v1/posts/${id}`, {
    method: "DELETE",
    headers: getHeaders(true),
  });
  return handleResponse(res);
}
