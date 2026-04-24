import { test, expect } from '@playwright/test';

test.describe('Button Loading States', () => {
  test.beforeEach(async ({ page }) => {
    // Acessa a aplicação
    await page.goto('http://localhost:5173');
  });

  test('login button should be disabled and show loading state', async ({ page }) => {
    // Abrir modal de login
    await page.getByRole('button', { name: 'Anunciar Vaga' }).click();
    
    // Preencher e-mail
    await page.getByLabel('E-mail').fill('test@example.com');
    
    // Interceptar a chamada de API para simular delay
    await page.route('**/codigo*', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.fulfill({ status: 200, body: JSON.stringify({ message: 'Code sent' }) });
    });

    const loginBtn = page.getByRole('button', { name: 'Receber Código por E-mail' });
    
    // Clicar no botão
    await loginBtn.click();
    
    // Verificar se o botão está desabilitado
    await expect(loginBtn).toBeDisabled();
    
    // Verificar se o texto mudou para o estado de loading (esperado conforme story)
    await expect(loginBtn).toHaveText(/Enviando código.../);
    
    // Aguardar conclusão e verificar se reabilitou (ou se passou para próxima etapa)
    await expect(page.getByText('Um código foi enviado para test@example.com')).toBeVisible();
  });
});
