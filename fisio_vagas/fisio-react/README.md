# Conecta Crefito-11 (Job Board)

Uma plataforma online moderna focada na conexão entre profissionais de fisioterapia e clínicas/empresas da região de Brasília-DF, gerenciada pelo Crefito-11.

## 🚀 Tecnologias Utilizadas

Este projeto foi migrado de Vanilla JS/HTML puro para uma Single Page Application (SPA) reativa e foi construído com as melhores e mais flexíveis tecnologias modernas:

* **React + Vite**: Engine ultrarrápido para desenvolvimento frontend reativo e build otimizada.
* **Vanilla CSS**: Estilo desenhado com CSS moderno usando propriedades customizadas (variáveis), flexbox e grid layout para maior controle e flexibilidade, dispensando dependências lentas.
* **Sistema de Tema Nativo**: Modo Escuro (Dark Mode) integrado fluído usando atributos `data-theme`.
* **Phosphor Icons**: Biblioteca de vetores ultraleve para consistência visual do painel.
* **Integração Real de API (REST)**: Totalmente conectado via Fetch a uma API real rodando Python/FastAPI (CORS nativamente contornado com Proxy do Vite + variáveis de ambiente).

## 🌟 Funcionalidades

### Para Profissionais
*   **Vitrine Rápida**: Listagem de todas as vagas publicadas num layout com visualização dividida (lista + detalhes em tempo real).
*   **Filtros Customizados**: Filtragem instantânea baseada em tipo de vaga (*Presencial, Híbrido, Home Office*) e especialidade.

### Para Empregadores e Recrutadores
*   **Autenticação Serverless via Código (E-mail)**: Esqueceu senha? Não tem problema, o fluxo envia diretamente um código de 6 dígitos ao E-mail, garantindo um funil de cadastro eficiente.
*   **Painel Oculto Integrado (Drawer)**: O Dashboard desliza automaticamente sobre a tela sem necessidade de carregar páginas pesadas, focando no desempenho (SPA Navigation).
*   **CRUD de Vagas (Integração Total)**: O recrutador pode gerenciar (criar, listar e remover) vagas de forma instantânea na API da Crefito-11. As descrições embutem um *template limpo* (Sobre, Responsabilidades e Requisitos).

## 🗂 Estrutura do Projeto

*   `src/components/`: Todas as páginas isoladas da interface: `AuthModal` (Modais interativos de login), `DashboardDrawer` (Dashboard em gaveta flutuante), `JobBoard` (Container de Listagem) e Layouts (`Hero`, `Navbar`).
*   `src/services/api.js`: Camada autônoma de rede responsável pelo sistema de persistência com chamadas assíncronas para a API oficial.
*   `src/hooks/useJobs.js`: Custom Hook em React para abstração e injeção do gerenciamento de estado das vagas (*fetch, loading, error mappings*).
*   `index.css`: Design System completo via CSS (reset clássico e escopo focado em performance nativa).

## 💻 Como Rodar o Projeto (Desenvolvimento)

1. Clone o repositório na sua máquina:
   ```bash
   git clone https://github.com/SEU-USUARIO/conecta-crefito.git
   ```
2. Acesse a pasta raiz do frontend (React):
   ```bash
   cd conecta-crefito
   ```
3. Instale as dependências com npm:
   ```bash
   npm install
   ```
4. Inicie o servidor ultra-rápido do Vite:
   ```bash
   npm run dev
   ```

*Nota: Por questões de ambiente, o Vite está roteando internamente (`/api/*`) as chamadas para a API externa via seu mecanismo próprio de Proxy (`vite.config.js`) para contornar qualquer barreira de CORS entre localhost e o servidor de Homologação.*

## 📈 Compilando para Produção

Quando for hospedar (Vercel, Netlify, cPanel, Servidor Apache/Nginx ou similares):
```bash
npm run build
```
O Vite irá gerar uma pasta `dist/` englobando todo o código ofuscado e minificado pronto para produção.
