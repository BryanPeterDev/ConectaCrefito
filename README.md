# Conecta Crefito-11: Portal de Vagas (FisioVagas)

Este é o repositório frontend oficial do portal de vagas (FisioVagas) do Conselho Regional de Fisioterapia e Terapia Ocupacional da 11ª Região (Crefito-11). O frontend foi criado usando **React e Vite**, desenhado para proporcionar uma experiência fluida, moderna e focada na usabilidade (UX/UI).

## 🚀 Funcionalidades Já Implementadas

O projeto encontra-se em estágio avançado de Frontend, com a maioria das integrações já configuradas.

### 1. Interface Gráfica e Visual (UX/UI)
- Visual moderno com esquema de cores profissional baseado na identidade do Crefito.
- **Modo Escuro / Claro (Dark/Light Theme)** com chaveamento suave e persistência nas configurações do usuário.
- Layout de dupla-aba (Split View) para navegação ágil entre a lista de vagas e os dados de uma vaga aberta na mesma tela.
- Resumo dinâmico (tags coloridas para status da vaga, logomarca tipográfica automática).

### 2. Busca e Filtros Inteligentes
- **Barra de Pesquisa Global:** Procura por palavras-chave localizadas no Título, Descrição e Tags de uma vaga.
- **Tags de Buscas Populares:** Atalhos clicáveis na página principal (Neurofuncional, UTI, etc.).
- **Filtros Laterais Múltiplos:** Filtragem combinada por Especialidade Fixa (Ortopédica, Pediátrica, etc.) e Modalidade (Presencial, Híbrido, Home Office).
- **Ordenação Reativa:** Categoria de organizar lista por "Mais recentes" ou por "Relevância de Pesquisa".

### 3. Integração e Autenticação com a API (Recrutadores)
- Login seguro por **E-mail + Código de Acesso**, dispensando senhas longas fixas.
- Gerenciamento inteligente de sessão com validação periódica dupla (`fisio_token` no formato cookie aliado ao `fisio_refresh_token` na persistência local).
- Redirecionamento da API no ambiente local configurado transparentemente através do Proxy Reverso do Vite.

### 4. Dashboard de Minhas Vagas
- Menu lateral exclusivo para o usuário "Ofertante/Recrutador" poder administrar as suas postagens.
- **Criação de Vagas (POST):** Formulário interativo para publicar títulos, localização, detalhes flexíveis e sistema rápido de preenchimento de **Tags Livres**.
- **Edição e Deleção (PUT / DELETE):** Sistema prático com botões fantasma (ghost buttons) e visualização limpa do formulário; recurso de autoscroll ao topo ativado.

---

## 🛠️ O que Falta Implementar (Pendências & Backend)

Durante o desenvolvimento, algumas coisas foram limitadas ou necessitam de avanço no código do Servidor (Backend da Hmintranet/API) ou de novas funcionalidades do lado do cliente.

### A. Limitações Conhecidas na Atual API (Backend)
- **Atualização de Múltiplos Campos (Edição):** Atualmente as Rotas `PUT` que reciclam os dados da Vaga (edição) **não suportam ou ignoram a gravação da matriz de `tags` e modificações de `status`**. O frontend teve o envio dessas informações cancelado na rota de update para contornar um problema onde tentar atualizá-las resultava num bug silencioso vindo da API. Será necessário pedir que o setor de Backend permita a modificação das colunas de `tags` e `status` via comando `PUT`.

### B. Próximos Passos Front-end Sugeridos
- **Painel de Perfil do Ofertante:** Adicionar uma aba no Dashboard para que a clínica consiga editar a imagem da empresa, modificar telefones de contato fixo, entre outros dados cadastrais.
- **Sistema Nativo de Aplicação:** Hoje o botão "Entrar em contato" aciona um Link externo ou um E-Mail genérico em formato `mailto:`. Criar a funcionalidade de "Submeter Currículo com 1 Clique" se a API futuramente receber arquivos PDF ou dados do usuário fisioterapeuta logado.
- **Paginação / Infinite Scroll:** O sistema atual lida perfeitamente com dezenas de vagas de forma rápida, no entanto, para escalas de centenas de vagas é recomendável paginar as chamadas ao invés de buscar a lista completa (endpoint atual).
- **Notificações em Tela (Toasts):** Substituir o feedback atual de texto (embaixo dos formulários de login/dashboards) por notificações que desaparecem sozinhas em um canto da tela (react-hot-toast / react-toastify).
- **SEO Dinâmico (Busca do Google):** Implementar bibliotecas como *React Helmet* para alterar o metadado (título da aba e descrição pro Whatsapp/Google) dependendo de qual vaga individual estiver carregada pro usuário usando um roteamento avançado (uma página focada via ID).

---

## 💻 Como Rodar este Projeto
1. **Pelo Terminal**, certifique-se de estar na pasta que contém o `package.json` desse projeto React;
2. Instale dependências se necessário com o comando: `npm install`
3. Execute o servidor de desenvolvimento local: `npm run dev`
4. Acesse seu projeto através de `http://localhost:5173`

