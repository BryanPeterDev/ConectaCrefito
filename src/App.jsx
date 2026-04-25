import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import JobBoard from "./components/JobBoard";
import AuthModal from "./components/AuthModal";
import DashboardDrawer from "./components/DashboardDrawer";
import Footer from "./components/Footer";
import { useJobs, useMyJobs } from "./hooks/useJobs";
import {
  isAuthenticated as checkAuth,
  getCurrentUser,
  logout,
} from "./services/api";

function App() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "light",
  );
  const [user, setUser] = useState(() =>
    checkAuth() ? getCurrentUser() : null,
  );
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  // Vagas públicas
  const { jobs, loading, error, refetch } = useJobs();

  // Vagas do recrutador logado — via API /posts/me
  const { myJobs, refetchMy } = useMyJobs();

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    if (next === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  };

  const handleAuthenticated = (ofertante) => {
    setUser(ofertante);
    setIsAuthModalOpen(false);
    setIsDashboardOpen(true);
    refetchMy(); // Carrega as vagas do usuário após login
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsDashboardOpen(false);
  };

  const handleRefetch = () => {
    refetch(); // Atualiza lista pública
    refetchMy(); // Atualiza lista do recrutador
  };

  return (
    <>
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        isAuthenticated={!!user}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onDashboardClick={() => setIsDashboardOpen(true)}
      />

      <Hero 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        locationQuery={locationQuery}
        setLocationQuery={setLocationQuery}
        loading={loading}
      />

      {error && (
        <div style={{ textAlign: "center", padding: "24px", color: "#FE5B59" }}>
          Erro ao carregar vagas: {error}.{" "}
          <button onClick={refetch} className="btn-link" disabled={loading}>
            {loading ? "Tentando novamente..." : "Tentar novamente"}
          </button>
        </div>
      )}

      <JobBoard jobs={jobs} loading={loading} searchQuery={searchQuery} locationQuery={locationQuery} />

      {!user && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthenticated={handleAuthenticated}
        />
      )}

      {user && (
        <DashboardDrawer
          isOpen={isDashboardOpen}
          onClose={() => setIsDashboardOpen(false)}
          myJobs={myJobs}
          onRefetch={handleRefetch}
          onLogout={handleLogout}
        />
      )}

      <Footer />
    </>
  );
}

export default App;
