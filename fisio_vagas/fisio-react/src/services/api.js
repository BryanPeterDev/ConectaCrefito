// ============================================================
// Camada de serviço central – toda comunicação com a API real
// Em dev, as chamadas /api/* são interceptadas pelo proxy do Vite
// (vite.config.js) e redirecionadas para hmintranet.crefito11.gov.br
// Em produção, configure a variável de ambiente VITE_API_URL
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

// ── Helpers internos ────────────────────────────────────────

function getHeaders(withAuth = false) {
    const headers = { 'Content-Type': 'application/json' };
    if (withAuth) {
        const token = localStorage.getItem('fisio_token');
        if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

async function handleResponse(res) {
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { message: text }; }
    if (!res.ok) {
        let msg = data?.message || data?.erro;
        if (!msg && data?.detail) {
            msg = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
        }
        throw new Error(msg || `Erro ${res.status}`);
    }
    return data;
}

// ── Sessão local ────────────────────────────────────────────

export function getCurrentUser() {
    try {
        const raw = localStorage.getItem('fisio_user');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function isAuthenticated() {
    return !!localStorage.getItem('fisio_token');
}

export function logout() {
    localStorage.removeItem('fisio_token');
    localStorage.removeItem('fisio_user');
}

// ── Auth ─────────────────────────────────────────────────────

/**
 * Pede ao servidor que envie um código de 6 dígitos por e-mail.
 * Usado tanto para login quanto para confirmar cadastro.
 */
export async function requestCode(email) {
    const res = await fetch(`${BASE_URL}/api/v1/auth/ofertante/codigo`, {
        method: 'POST',
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
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, codigo }),
    });
    const data = await handleResponse(res);
    if (data.token) localStorage.setItem('fisio_token', data.token);
    // Aceita diferentes formatos de resposta da API
    const user = data.ofertante ?? data.user ?? data;
    if (user?.id) localStorage.setItem('fisio_user', JSON.stringify(user));
    return { token: data.token, user };
}

/**
 * Registra novo ofertante (recrutador/empresa).
 * Após o registro a API envia um código de confirmação por e-mail.
 */
export async function registerOfertante({ nome, documento, email, tipo }) {
    const res = await fetch(`${BASE_URL}/api/v1/ofertante`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ nome, documento, email, tipo }),
    });
    return handleResponse(res);
}

// ── Posts (Vagas) ────────────────────────────────────────────

/** Lista todas as vagas públicas */
export async function getPosts() {
    const res = await fetch(`${BASE_URL}/api/v1/posts`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(res);
}

/** Lista apenas as vagas do ofertante autenticado */
export async function getMyPosts() {
    const res = await fetch(`${BASE_URL}/api/v1/posts/me`, {
        method: 'GET',
        headers: getHeaders(true),
    });
    return handleResponse(res);
}

/** Cria uma nova vaga (requer autenticação) */
export async function createPost({ titulo, descricao, local, link, publico_alvo, status, tags }) {
    const res = await fetch(`${BASE_URL}/api/v1/posts`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({
            titulo,
            descricao,
            local,
            link,
            publico_alvo,
            status: status ?? 'ativo',
            tags: tags ?? [],
        }),
    });
    return handleResponse(res);
}

/** Atualiza campos de uma vaga existente (requer autenticação) */
export async function updatePost(id, fields) {
    const res = await fetch(`${BASE_URL}/api/v1/posts/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(fields),
    });
    return handleResponse(res);
}

/** Remove uma vaga (requer autenticação) */
export async function deletePost(id) {
    const res = await fetch(`${BASE_URL}/api/v1/posts/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
    });
    return handleResponse(res);
}
