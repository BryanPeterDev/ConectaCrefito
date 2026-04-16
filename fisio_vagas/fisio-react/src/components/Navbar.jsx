import React from 'react';
import { Moon, Sun, ListDashes, SignOut } from '@phosphor-icons/react';

export default function Navbar({
    theme,
    toggleTheme,
    isAuthenticated,
    onLoginClick,
    onDashboardClick,
    onLogout,
}) {
    return (
        <header className="navbar">
            <div className="nav-container">
                <div className="brand">
                    <img src="/logo.png" alt="Conecta Crefito-11" height="40" style={{ objectFit: 'contain' }} />
                    <span>Conecta Crefito-11</span>
                </div>
                <div className="nav-actions">
                    <button className="btn-ghost" onClick={toggleTheme} title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}>
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {!isAuthenticated ? (
                        <button className="btn-primary" onClick={onLoginClick}>Entrar</button>
                    ) : (
                        <>
                            <button className="btn-primary" onClick={onDashboardClick} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ListDashes size={20} />
                                Meu Painel
                            </button>
                            <button className="btn-ghost" onClick={onLogout} title="Sair">
                                <SignOut size={20} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
