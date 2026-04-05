import { Page, expect } from '@playwright/test';

export class FormularioPage {
  constructor(private readonly page: Page) {}

  async abrirFormulario() {
    await this.page.goto('http://localhost:3000/encerramento/formulario');
    // Aguardar hidratação do React e carregamento dos catálogos
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Preenche o formulário único de encerramento (não há etapas).
   * A agência usa o código do CSV sem padding (ex: '81' para Imperatriz/MA).
   */
  async preencherFormulario(
    uf: string,
    codigoAgencia: string,
    numeroConta: string,
    titularNome: string,
  ) {
    // Selecionar UF e aguardar carga das agências
    await this.page.getByLabel(/estado/i).selectOption(uf);
    await this.page.waitForResponse((r) => r.url().includes('/agencias'));
    // Selecionar agência
    await this.page.getByLabel(/agência/i).selectOption({ value: codigoAgencia });
    // Preencher dados bancários
    await this.page.getByLabel(/número da conta/i).fill(numeroConta);
    await this.page.getByLabel(/nome do titular/i).fill(titularNome);
  }

  async aceitarTermosESubmeter() {
    await this.page.getByRole('checkbox').check();
    await this.page.getByRole('button', { name: /solicitar/i }).click();
  }

  async obterProtocolo(): Promise<string> {
    const el = this.page.getByTestId('protocolo');
    await expect(el).toBeVisible({ timeout: 15_000 });
    return (await el.textContent()) ?? '';
  }
}
