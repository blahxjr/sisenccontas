import { Page, expect } from '@playwright/test';

export class DashboardPage {
  constructor(private readonly page: Page) {}

  async fazerLogin(matricula: string) {
    await this.page.goto('http://localhost:3001/login');
    await this.page.waitForLoadState('networkidle');
    await this.page.getByLabel(/matrícula/i).fill(matricula);
    await this.page.getByLabel(/senha/i).fill('qualquer');
    await this.page.getByRole('button', { name: /entrar/i }).click();
    await this.page.waitForURL('**/dashboard', { timeout: 15_000 });
  }

  async buscarProtocoloNaTabela(protocolo: string) {
    await expect(this.page.getByText(protocolo)).toBeVisible({ timeout: 8_000 });
  }

  async abrirDetalhe(protocolo: string) {
    await this.page.getByText(protocolo).click();
    await this.page.waitForURL('**/solicitacoes/**');
  }

  async gerarTermo() {
    await this.page.getByRole('button', { name: /gerar termo/i }).click();
    await expect(this.page.getByText(/termo gerado|baixar termo/i)).toBeVisible({ timeout: 15_000 });
  }

  async confirmarDocumentoNaLista(tipo: 'TERMO_GERADO' | 'TERMO_ASSINADO') {
    await expect(this.page.getByText(tipo)).toBeVisible();
  }
}
