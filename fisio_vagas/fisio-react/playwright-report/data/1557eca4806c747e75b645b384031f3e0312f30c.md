# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: button-loading.spec.js >> Button Loading States >> login button should be disabled and show loading state
- Location: tests\button-loading.spec.js:9:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Anunciar Vaga' })

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - banner [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - img "Conecta Crefito-11" [ref=e6]
        - generic [ref=e7]: Conecta Crefito-11
      - generic [ref=e8]:
        - button "Modo escuro" [ref=e9] [cursor=pointer]:
          - img [ref=e10]
        - button "Entrar" [ref=e12] [cursor=pointer]
  - generic [ref=e15]:
    - heading "Sua próxima grande oportunidade em Fisioterapia e Terapia Ocupacional" [level=1] [ref=e16]
    - paragraph [ref=e17]: A maior plataforma de oportunidade para fisioterapeutas e terapeutas ocupacionais. Encontre vagas em clínicas, hospitais e home care alinhadas com seu perfil profissional no DF e GO.
    - generic [ref=e18]:
      - generic [ref=e19]:
        - img [ref=e20]
        - textbox "Cargo, especialidade..." [ref=e22]
      - generic [ref=e24]:
        - img [ref=e25]
        - textbox "Localização" [ref=e27]
      - button "Buscar Vagas" [ref=e28] [cursor=pointer]
  - main [ref=e29]:
    - complementary [ref=e30]:
      - generic [ref=e31]:
        - heading "Filtros" [level=2] [ref=e32]
        - button "Limpar" [ref=e33] [cursor=pointer]
      - generic [ref=e34]:
        - heading "Especialidade" [level=3] [ref=e35]
        - generic [ref=e36] [cursor=pointer]:
          - checkbox "Ortopédica"
          - text: Ortopédica
        - generic [ref=e38] [cursor=pointer]:
          - checkbox "Neurológica"
          - text: Neurológica
        - generic [ref=e40] [cursor=pointer]:
          - checkbox "Respiratória"
          - text: Respiratória
        - generic [ref=e42] [cursor=pointer]:
          - checkbox "Esportiva"
          - text: Esportiva
        - generic [ref=e44] [cursor=pointer]:
          - checkbox "Geriátrica"
          - text: Geriátrica
      - generic [ref=e46]:
        - heading "Modalidade" [level=3] [ref=e47]
        - generic [ref=e48] [cursor=pointer]:
          - checkbox "Presencial"
          - text: Presencial
        - generic [ref=e50] [cursor=pointer]:
          - checkbox "Híbrido"
          - text: Híbrido
        - generic [ref=e52] [cursor=pointer]:
          - checkbox "Home Office"
          - text: Home Office
    - generic [ref=e54]:
      - generic [ref=e55]:
        - paragraph [ref=e56]:
          - text: Mostrando
          - strong [ref=e57]: "8"
          - text: vagas
        - generic [ref=e58]:
          - generic [ref=e59]: "Ordenar por:"
          - combobox [ref=e60] [cursor=pointer]:
            - option "Mais recentes" [selected]
            - option "Relevância"
      - generic [ref=e61]:
        - generic [ref=e62]:
          - generic [ref=e63] [cursor=pointer]:
            - generic [ref=e65]:
              - generic [ref=e66]: C
              - generic [ref=e67]:
                - heading "Inventore Cumque Ass" [level=3] [ref=e68]
                - paragraph [ref=e69]: Clínica/Empresa
            - generic [ref=e70]:
              - generic [ref=e71]:
                - img [ref=e72]
                - text: Non Itaque Enim Debi
              - generic [ref=e74]:
                - img [ref=e75]
                - text: Presencial
            - generic [ref=e77]:
              - generic [ref=e78]: Debitis Proident Fu
              - generic [ref=e79]: Teste
            - generic [ref=e80]: 24/04/2026
          - generic [ref=e81] [cursor=pointer]:
            - generic [ref=e83]:
              - generic [ref=e84]: C
              - generic [ref=e85]:
                - heading "Fisioterapia Respiratoria" [level=3] [ref=e86]
                - paragraph [ref=e87]: Clínica/Empresa
            - generic [ref=e88]:
              - generic [ref=e89]:
                - img [ref=e90]
                - text: Goiais
              - generic [ref=e92]:
                - img [ref=e93]
                - text: Presencial
            - generic [ref=e95]:
              - generic [ref=e96]: Homecare
              - generic [ref=e97]: Respiratoria
            - generic [ref=e98]: 23/04/2026
          - generic [ref=e99] [cursor=pointer]:
            - generic [ref=e101]:
              - generic [ref=e102]: C
              - generic [ref=e103]:
                - heading "Fisioterapeuta Geriátrico" [level=3] [ref=e104]
                - paragraph [ref=e105]: Clínica/Empresa
            - generic [ref=e106]:
              - generic [ref=e107]:
                - img [ref=e108]
                - text: Brasilia
              - generic [ref=e110]:
                - img [ref=e111]
                - text: Presencial
            - generic [ref=e115]: 22/04/2026
          - generic [ref=e116] [cursor=pointer]:
            - generic [ref=e118]:
              - generic [ref=e119]: C
              - generic [ref=e120]:
                - heading "Fisio" [level=3] [ref=e121]
                - paragraph [ref=e122]: Clínica/Empresa
            - generic [ref=e123]:
              - generic [ref=e124]:
                - img [ref=e125]
                - text: guara
              - generic [ref=e127]:
                - img [ref=e128]
                - text: Híbrido
            - generic [ref=e131]: homeoffice
            - generic [ref=e132]: 17/04/2026
          - generic [ref=e133] [cursor=pointer]:
            - generic [ref=e135]:
              - generic [ref=e136]: C
              - generic [ref=e137]:
                - heading "Fisioterapeuta Respiratória" [level=3] [ref=e138]
                - paragraph [ref=e139]: Clínica/Empresa
            - generic [ref=e140]:
              - generic [ref=e141]:
                - img [ref=e142]
                - text: Ceilandia
              - generic [ref=e144]:
                - img [ref=e145]
                - text: Híbrido
            - generic [ref=e147]:
              - generic [ref=e148]: Respiratoria
              - generic [ref=e149]: domiciliar
            - generic [ref=e150]: 17/04/2026
          - generic [ref=e151] [cursor=pointer]:
            - generic [ref=e153]:
              - generic [ref=e154]: C
              - generic [ref=e155]:
                - heading "pediatrica" [level=3] [ref=e156]
                - paragraph [ref=e157]: Clínica/Empresa
            - generic [ref=e158]:
              - generic [ref=e159]:
                - img [ref=e160]
                - text: bra
              - generic [ref=e162]:
                - img [ref=e163]
                - text: Home Office
            - generic [ref=e166]: aa
            - generic [ref=e167]: 17/04/2026
          - generic [ref=e168] [cursor=pointer]:
            - generic [ref=e170]:
              - generic [ref=e171]: C
              - generic [ref=e172]:
                - heading "Cardiorrespiratoria" [level=3] [ref=e173]
                - paragraph [ref=e174]: Clínica/Empresa
            - generic [ref=e175]:
              - generic [ref=e176]:
                - img [ref=e177]
                - text: minas
              - generic [ref=e179]:
                - img [ref=e180]
                - text: Híbrido
            - generic [ref=e183]: esportiva
            - generic [ref=e184]: 17/04/2026
          - generic [ref=e185] [cursor=pointer]:
            - generic [ref=e187]:
              - generic [ref=e188]: C
              - generic [ref=e189]:
                - heading "bryan" [level=3] [ref=e190]
                - paragraph [ref=e191]: Clínica/Empresa
            - generic [ref=e192]:
              - generic [ref=e193]:
                - img [ref=e194]
                - text: brasil
              - generic [ref=e196]:
                - img [ref=e197]
                - text: Presencial
            - generic [ref=e201]: 16/04/2026
        - generic [ref=e202]:
          - generic [ref=e203]:
            - heading "Inventore Cumque Ass" [level=2] [ref=e204]
            - generic [ref=e205]: Clínica/Empresa • Non Itaque Enim Debi
            - generic [ref=e206]:
              - generic [ref=e207]:
                - img [ref=e208]
                - text: Presencial
              - generic [ref=e210]: "Publicado em: 24/04/2026"
            - generic [ref=e211]:
              - paragraph [ref=e212]: "Tags:"
              - generic [ref=e213]:
                - generic [ref=e214]: Debitis Proident Fu
                - generic [ref=e215]: Teste
            - generic [ref=e216]:
              - link "Entrar em contato" [ref=e217] [cursor=pointer]:
                - /url: https://www.lujeho.co
              - button "Compartilhar" [ref=e218] [cursor=pointer]:
                - img [ref=e219]
                - text: Compartilhar
          - generic [ref=e221]:
            - heading "Sobre a vaga" [level=3] [ref=e222]
            - paragraph [ref=e224]: Sint eligendi in cup.
  - contentinfo [ref=e225]:
    - generic [ref=e226]:
      - generic [ref=e227]:
        - img "Crefito-11 Logo" [ref=e228]
        - paragraph [ref=e229]:
          - text: CONSELHO REGIONAL DE
          - text: FISIOTERAPIA E TERAPIA
          - text: OCUPACIONAL DA 11ª REGIÃO
      - generic [ref=e231]:
        - generic [ref=e232]:
          - text: SCS Quadra 8, Venâncio Shopping,
          - text: Bloco B60, 4º andar, sala 440
          - strong [ref=e233]: Brasília - DF | CEP 70333-900
        - generic [ref=e234]:
          - link "contato@crefito11.gov.br" [ref=e235] [cursor=pointer]:
            - /url: mailto:contato@crefito11.gov.br
            - img [ref=e236]
            - text: contato@crefito11.gov.br
          - link "+55 61 3225-1111" [ref=e238] [cursor=pointer]:
            - /url: tel:+556132251111
            - img [ref=e239]
            - text: +55 61 3225-1111
          - link "www.crefito11.gov.br" [ref=e241] [cursor=pointer]:
            - /url: https://www.crefito11.gov.br
            - img [ref=e242]
            - text: www.crefito11.gov.br
          - link "Instagram" [ref=e244] [cursor=pointer]:
            - /url: https://www.instagram.com/crefito11/
            - img [ref=e245]
            - text: Instagram
      - paragraph [ref=e247]: © Copyright 2021 Conselho Regional de Fisioterapia e Terapia Ocupacional da 11ª Região- DF/GO | Direitos Reservados.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Button Loading States', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Acessa a aplicação
  6  |     await page.goto('http://localhost:5173');
  7  |   });
  8  | 
  9  |   test('login button should be disabled and show loading state', async ({ page }) => {
  10 |     // Abrir modal de login
> 11 |     await page.getByRole('button', { name: 'Anunciar Vaga' }).click();
     |                                                               ^ Error: locator.click: Test timeout of 30000ms exceeded.
  12 |     
  13 |     // Preencher e-mail
  14 |     await page.getByLabel('E-mail').fill('test@example.com');
  15 |     
  16 |     // Interceptar a chamada de API para simular delay
  17 |     await page.route('**/codigo*', async route => {
  18 |       await new Promise(resolve => setTimeout(resolve, 2000));
  19 |       await route.fulfill({ status: 200, body: JSON.stringify({ message: 'Code sent' }) });
  20 |     });
  21 | 
  22 |     const loginBtn = page.getByRole('button', { name: 'Receber Código por E-mail' });
  23 |     
  24 |     // Clicar no botão
  25 |     await loginBtn.click();
  26 |     
  27 |     // Verificar se o botão está desabilitado
  28 |     await expect(loginBtn).toBeDisabled();
  29 |     
  30 |     // Verificar se o texto mudou para o estado de loading (esperado conforme story)
  31 |     await expect(loginBtn).toHaveText(/Enviando código.../);
  32 |     
  33 |     // Aguardar conclusão e verificar se reabilitou (ou se passou para próxima etapa)
  34 |     await expect(page.getByText('Um código foi enviado para test@example.com')).toBeVisible();
  35 |   });
  36 | });
  37 | 
```