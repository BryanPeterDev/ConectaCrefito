import React, { useState } from 'react';
import { X } from '@phosphor-icons/react';
import { requestCode, loginWithCode, registerOfertante } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthenticated }) {
    const [activeTab, setActiveTab] = useState('login');

    // ── Login ──
    const [loginEmail, setLoginEmail] = useState('');
    const [loginCodeSent, setLoginCodeSent] = useState(false);
    const [loginCodeInput, setLoginCodeInput] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    // ── Cadastro ──
    const [regNome, setRegNome] = useState('');
    const [regTipo, setRegTipo] = useState('pf');
    const [regDoc, setRegDoc] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regCodeSent, setRegCodeSent] = useState(false);
    const [regCodeInput, setRegCodeInput] = useState('');
    const [regLoading, setRegLoading] = useState(false);
    const [regError, setRegError] = useState('');

    if (!isOpen) return null;

    // ── Handlers: Login ──────────────────────────────────────
    const handleLoginReqCode = async () => {
        if (!loginEmail.includes('@')) {
            setLoginError('Insira um e-mail válido.');
            return;
        }
        setLoginError('');
        setLoginLoading(true);
        try {
            // Servidor gera e envia o código por e-mail
            await requestCode(loginEmail);
            setLoginCodeSent(true);
        } catch (err) {
            setLoginError(err.message || 'Não foi possível enviar o código. Tente novamente.');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleLoginSubmit = async () => {
        if (loginCodeInput.length !== 6) {
            setLoginError('Digite os 6 dígitos do código enviado para seu e-mail.');
            return;
        }
        setLoginError('');
        setLoginLoading(true);
        try {
            const { user } = await loginWithCode(loginEmail, loginCodeInput);
            onAuthenticated(user);
        } catch (err) {
            setLoginError(err.message || 'Código inválido ou expirado. Tente novamente.');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleLoginResendCode = async () => {
        setLoginError('');
        setLoginLoading(true);
        try {
            await requestCode(loginEmail);
            setLoginError('Código reenviado! Verifique seu e-mail.');
        } catch (err) {
            setLoginError(err.message || 'Erro ao reenviar código.');
        } finally {
            setLoginLoading(false);
        }
    };

    // ── Handlers: Cadastro ───────────────────────────────────
    const handleRegRegister = async () => {
        if (!regNome.trim() || !regDoc.trim() || !regEmail.includes('@')) {
            setRegError('Preencha todos os campos corretamente.');
            return;
        }
        setRegError('');
        setRegLoading(true);
        try {
            // Cria a conta; a API envia o código de confirmação por e-mail
            await registerOfertante({ nome: regNome, documento: regDoc, email: regEmail, tipo: regTipo });
            setRegCodeSent(true);
        } catch (err) {
            setRegError(err.message || 'Erro ao cadastrar. Verifique os dados e tente novamente.');
        } finally {
            setRegLoading(false);
        }
    };

    const handleRegSubmit = async () => {
        if (regCodeInput.length !== 6) {
            setRegError('Digite os 6 dígitos do código enviado para seu e-mail.');
            return;
        }
        setRegError('');
        setRegLoading(true);
        try {
            const { user } = await loginWithCode(regEmail, regCodeInput);
            onAuthenticated(user);
        } catch (err) {
            setRegError(err.message || 'Código inválido ou expirado. Tente novamente.');
        } finally {
            setRegLoading(false);
        }
    };

    const handleRegResendCode = async () => {
        setRegError('');
        setRegLoading(true);
        try {
            await requestCode(regEmail);
            setRegError('Código reenviado! Verifique seu e-mail.'); // Using error text field to show success message (could be colored differently, but it works)
        } catch (err) {
            setRegError(err.message || 'Erro ao reenviar código.');
        } finally {
            setRegLoading(false);
        }
    };

    // ── Render ────────────────────────────────────────────────
    const selectStyle = {
        width: '100%', padding: '12px 16px',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--bg-main)',
        color: 'var(--text-strong)',
        outline: 'none',
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-panel">
                <button className="modal-close" onClick={onClose}><X size={24} /></button>

                <div className="modal-header">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Acesse ou Crie sua Conta</h2>
                    <div className="auth-tabs">
                        <button className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>Login</button>
                        <button className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`} onClick={() => setActiveTab('register')}>Cadastro</button>
                    </div>
                </div>

                <div className="modal-body" style={{ marginTop: '24px' }}>

                    {/* ─── LOGIN ─── */}
                    {activeTab === 'login' && (
                        <div className="auth-form active">
                            {loginError && <p style={{ color: '#FE5B59', marginBottom: '12px', fontSize: '0.9rem' }}>{loginError}</p>}

                            <div className="form-group">
                                <label>E-mail</label>
                                <input
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={loginEmail}
                                    onChange={e => setLoginEmail(e.target.value)}
                                    disabled={loginCodeSent}
                                />
                            </div>

                            {loginCodeSent ? (
                                <>
                                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                        Um código foi enviado para <strong>{loginEmail}</strong>. Verifique sua caixa de entrada.
                                    </p>
                                    <div className="form-group">
                                        <label>Código (6 dígitos)</label>
                                        <input
                                            type="text"
                                            maxLength={6}
                                            placeholder="000000"
                                            value={loginCodeInput}
                                            onChange={e => setLoginCodeInput(e.target.value.replace(/\D/g, ''))}
                                            autoFocus
                                        />
                                    </div>
                                    <button className="btn-primary w-100" onClick={handleLoginSubmit} disabled={loginLoading}>
                                        {loginLoading ? 'Autenticando...' : 'Entrar'}
                                    </button>
                                    <button className="btn-ghost w-100" style={{ marginTop: '8px' }} onClick={handleLoginResendCode} disabled={loginLoading}>
                                        Reenviar código por e-mail
                                    </button>
                                    <button className="btn-ghost w-100" style={{ marginTop: '8px' }} onClick={() => { setLoginCodeSent(false); setLoginCodeInput(''); setLoginError(''); }}>
                                        ← Alterar e-mail
                                    </button>
                                </>
                            ) : (
                                <button className="btn-primary w-100" onClick={handleLoginReqCode} disabled={loginLoading}>
                                    {loginLoading ? 'Enviando código...' : 'Receber Código por E-mail'}
                                </button>
                            )}
                        </div>
                    )}

                    {/* ─── CADASTRO ─── */}
                    {activeTab === 'register' && (
                        <div className="auth-form active">
                            {regError && <p style={{ color: '#FE5B59', marginBottom: '12px', fontSize: '0.9rem' }}>{regError}</p>}

                            {!regCodeSent ? (
                                <>
                                    <div className="form-group">
                                        <label>Nome / Clínica *</label>
                                        <input type="text" placeholder="Seu nome ou nome da clínica" value={regNome} onChange={e => setRegNome(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Tipo de cadastro *</label>
                                        <select value={regTipo} onChange={e => setRegTipo(e.target.value)} style={selectStyle}>
                                            <option value="pf">Pessoa Física (CPF)</option>
                                            <option value="pj">Pessoa Jurídica (CNPJ)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>{regTipo === 'pf' ? 'CPF *' : 'CNPJ *'}</label>
                                        <input
                                            type="text"
                                            placeholder={regTipo === 'pf' ? '000.000.000-00' : '00.000.000/0001-00'}
                                            value={regDoc}
                                            onChange={e => setRegDoc(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>E-mail *</label>
                                        <input type="email" placeholder="seu@email.com" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                                    </div>
                                    <button className="btn-primary w-100" onClick={handleRegRegister} disabled={regLoading}>
                                        {regLoading ? 'Criando conta...' : 'Cadastrar'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                        Conta criada! Um código de confirmação foi enviado para <strong>{regEmail}</strong>.
                                    </p>
                                    <div className="form-group">
                                        <label>Código de Confirmação (6 dígitos)</label>
                                        <input
                                            type="text"
                                            maxLength={6}
                                            placeholder="000000"
                                            value={regCodeInput}
                                            onChange={e => setRegCodeInput(e.target.value.replace(/\D/g, ''))}
                                            autoFocus
                                        />
                                    </div>
                                    <button className="btn-primary w-100" onClick={handleRegSubmit} disabled={regLoading}>
                                        {regLoading ? 'Verificando...' : 'Confirmar e Entrar'}
                                    </button>
                                    <button className="btn-ghost w-100" style={{ marginTop: '8px' }} onClick={handleRegResendCode} disabled={regLoading}>
                                        Reenviar código por e-mail
                                    </button>
                                    <button className="btn-ghost w-100" style={{ marginTop: '8px' }} onClick={() => { setRegCodeSent(false); setRegCodeInput(''); setRegError(''); }}>
                                        ← Editar dados
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
