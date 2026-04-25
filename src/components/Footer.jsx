import React from "react";
import {
  InstagramLogo,
  EnvelopeSimple,
  Phone,
  Globe,
} from "@phosphor-icons/react";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#27296D",
        color: "#FFFFFF",
        padding: "60px 20px",
        marginTop: "60px",
        width: "100%",
        fontFamily: "var(--font-heading)",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "40px",
        }}
      >
        {/* Lado Esquerdo - Logo e Nome */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "300px",
            textAlign: "center",
          }}
        >
          <img
            src="/logo.png"
            alt="Crefito-11 Logo"
            style={{
              height: "60px",
              marginBottom: "16px",
              objectFit: "contain",
            }}
          />
          <p
            style={{
              fontSize: "0.75rem",
              lineHeight: "1.4",
              opacity: 0.8,
              fontWeight: 300,
            }}
          >
            CONSELHO REGIONAL DE
            <br />
            FISIOTERAPIA E TERAPIA
            <br />
            OCUPACIONAL DA 11ª REGIÃO
          </p>
        </div>

        {/* Divisória Vertical (escondida no mobile) */}
        <div
          className="footer-divider"
          style={{
            width: "1px",
            height: "140px",
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            display: "none", // Controlled by CSS
          }}
        ></div>
        <style>{`
                    @media (min-width: 768px) {
                        .footer-divider { display: block !important; }
                        .footer-col-right { align-items: flex-start !important; text-align: left !important; }
                    }
                    @media (max-width: 767px) {
                        .footer-col-right { text-align: center; align-items: center; }
                    }
                    .footer-link:hover { color: #32D0B0 !important; cursor: pointer; }
                `}</style>

        {/* Lado Direito - Contatos */}
        <div
          className="footer-col-right"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            fontSize: "0.95rem",
          }}
        >
          <div style={{ lineHeight: "1.5" }}>
            SCS Quadra 8, Venâncio Shopping,
            <br />
            Bloco B60, 4º andar, sala 440
            <br />
            <strong style={{ display: "block", marginTop: "8px" }}>
              Brasília - DF | CEP 70333-900
            </strong>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <a
              href="mailto:contato@crefito11.gov.br"
              className="footer-link"
              style={{
                color: "#FFFFFF",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "color 0.2s",
                width: "fit-content",
              }}
            >
              <EnvelopeSimple size={20} /> contato@crefito11.gov.br
            </a>
            <a
              href="tel:+556132251111"
              className="footer-link"
              style={{
                color: "#FFFFFF",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "color 0.2s",
                width: "fit-content",
              }}
            >
              <Phone size={20} /> +55 61 3225-1111
            </a>
            <a
              href="https://www.crefito11.gov.br"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
              style={{
                color: "#FF5733",
                textDecoration: "none",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "color 0.2s",
                width: "fit-content",
              }}
            >
              <Globe size={20} /> www.crefito11.gov.br
            </a>
            <a
              href="https://www.instagram.com/crefito11/"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
              style={{
                color: "#FFFFFF",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "color 0.2s",
                width: "fit-content",
              }}
            >
              <InstagramLogo size={20} /> Instagram
            </a>
          </div>
        </div>
        <p>
          © Copyright 2021 Conselho Regional de Fisioterapia e Terapia
          Ocupacional da 11ª Região- DF/GO | Direitos Reservados.
        </p>
      </div>
    </footer>
  );
}
