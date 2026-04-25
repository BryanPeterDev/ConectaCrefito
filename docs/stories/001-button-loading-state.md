# Desabilitar e mostrar loading em botões durante requisições - Brownfield Addition

## User Story

As a usuário,
I want que o botão seja desabilitado e mostre um indicador de carregamento após eu clicar para realizar uma ação,
So that eu saiba que a requisição está em processamento e evite cliques múltiplos acidentais.

## Story Context

**Existing System Integration:**
- Integrates with: `src/components/AuthModal.jsx`, `src/components/DashboardDrawer.jsx` e demais componentes com botões de ação assíncrona.
- Technology: React 19, Vanilla CSS.
- Follows pattern: Padrões de botões definidos em `src/index.css`.
- Touch points: Estilos globais de botões e gerenciamento de estado `loading` nos componentes.

## Acceptance Criteria

**Functional Requirements:**
1. Ao clicar em um botão que dispara uma ação assíncrona, o atributo `disabled` deve ser aplicado ao botão.
2. O botão deve exibir um indicador visual de carregamento (ex: texto alterado ou spinner) enquanto a requisição estiver pendente.
3. O botão deve ser reabilitado automaticamente após a conclusão da requisição (seja sucesso ou erro).

**Integration Requirements:**
4. O estado `:disabled` deve ser estilizado globalmente no `src/index.css` para todos os tipos de botões (`btn-primary`, `btn-ghost`, etc.).
5. A implementação no `AuthModal.jsx` deve garantir que cliques duplos não disparem múltiplas chamadas de API.
6. A compatibilidade com o modo escuro deve ser mantida para o estado desabilitado.

**Quality Requirements:**
7. O estado desabilitado deve ser visualmente distinto (ex: `opacity: 0.6`, `cursor: not-allowed`).
8. Verificado que a funcionalidade existente de login e cadastro continua funcionando.
9. Nenhum erro de console deve ser introduzido.

## Technical Notes

- **Integration Approach:** Atualizar `src/index.css` com estilos para `button:disabled`. Revisar componentes para garantir que todos os botões de ação usem o estado `loading` disponível.
- **Existing Pattern Reference:** Utilizar as variáveis de cor do design system (`--outline`, `--surface-variant`) para o estado desabilitado.
- **Key Constraints:** Não alterar a lógica de API existente.

## Definition of Done

- [x] Estilos globais para `button:disabled` adicionados ao `src/index.css`.
- [x] Botões no `AuthModal.jsx` validados com estado `disabled` e visual de loading.
- [x] Botões no `DashboardDrawer.jsx` validados (se houver ações assíncronas).
- [x] Teste manual realizado: clicar múltiplas vezes não dispara múltiplas requisições.
- [x] Teste manual realizado: visual consistente em Light e Dark mode.

## Completion Notes

- Implementado estado `:disabled` global no `src/index.css` com `opacity: 0.6` e `cursor: not-allowed`.
- Atualizado `AuthModal.jsx` para desabilitar botões durante o envio de código e login.
- Atualizado `DashboardDrawer.jsx` para desabilitar botões durante a publicação e exclusão de vagas.
- Adicionado feedback visual no botão "Compartilhar" do `JobBoard.jsx` (texto muda para "Copiado!" e desabilita por 2s).
- Adicionado estado de carregamento nos botões de "Buscar Vagas" (`Hero.jsx`) e "Tentar novamente" (`App.jsx`).

## Risk and Compatibility Check

- **Primary Risk:** Estilo desabilitado pode ficar ilegível em alguns temas se as cores não forem bem escolhidas.
- **Mitigation:** Utilizar `opacity` e testar em ambos os temas.
- **Rollback:** Reverter alterações no `src/index.css` e nos componentes específicos.
