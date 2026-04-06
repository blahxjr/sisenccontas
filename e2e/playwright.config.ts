import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  fullyParallel: false, // rodar em sequência para preservar estado do banco
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 60_000, // 60s por teste — dev server Next.js pode ser lento
  reporter: [['html', { outputFolder: 'e2e-report' }], ['line']],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 20_000, // 20s para cada ação (clique, preenchimento)
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Garantir que os serviços estão rodando antes dos testes
  // Em CI: usar webServer para iniciar automaticamente
});
