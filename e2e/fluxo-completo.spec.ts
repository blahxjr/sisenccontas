import { test, expect } from '@playwright/test';
import { FormularioPage } from './pages/FormularioPage';
import { DashboardPage } from './pages/DashboardPage';

let protocoloCriado = '';

test.describe('Fluxo completo — EncerraDigital', () => {
  test('01 — Cliente preenche formulário e recebe protocolo', async ({ page }) => {
    const formulario = new FormularioPage(page);
    await formulario.abrirFormulario();
    // UF: MA, Agência: 81 (Imperatriz/MA — código sem padding conforme CSV)
    await formulario.preencherFormulario('MA', '81', '55555-1', 'Cliente Playwright Teste');
    await formulario.aceitarTermosESubmeter();
    protocoloCriado = await formulario.obterProtocolo();
    expect(protocoloCriado).toMatch(/^ENC-\d{4}-\d{6}$/);
    console.log(`✅ Protocolo criado: ${protocoloCriado}`);
  });

  test('02 — Cliente consulta status do protocolo', async ({ page }) => {
    test.skip(!protocoloCriado, 'Depende do teste anterior');
    await page.goto(`http://localhost:3000/encerramento/status?protocolo=${protocoloCriado}`);
    await expect(page.getByText(protocoloCriado)).toBeVisible();
    await expect(page.getByText(/pendente/i)).toBeVisible();
  });

  test('03 — Operador faz login no painel interno', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.fazerLogin('BRF0001');
    await expect(page).toHaveURL(/dashboard/);
    // Confirmar que o dashboard carregou com o título principal
    await expect(page.getByText('Solicitações de Encerramento')).toBeVisible();
  });

  test('04 — Operador vê a solicitação criada no dashboard', async ({ page }) => {
    test.skip(!protocoloCriado, 'Depende do teste 01');
    const dashboard = new DashboardPage(page);
    await dashboard.fazerLogin('BRF0001');
    await dashboard.buscarProtocoloNaTabela(protocoloCriado);
  });

  test('05 — Operador abre detalhe e gera o Termo de Encerramento', async ({ page }) => {
    test.skip(!protocoloCriado, 'Depende do teste 01');
    const dashboard = new DashboardPage(page);
    await dashboard.fazerLogin('BRF0001');
    await dashboard.buscarProtocoloNaTabela(protocoloCriado);
    await dashboard.abrirDetalhe(protocoloCriado);
    await dashboard.gerarTermo();
    await dashboard.confirmarDocumentoNaLista('TERMO_GERADO');
  });

  test('06 — Dados sensíveis não aparecem na página pública de status', async ({ page }) => {
    test.skip(!protocoloCriado, 'Depende do teste 01');
    await page.goto(`http://localhost:3000/encerramento/status?protocolo=${protocoloCriado}`);
    const conteudo = await page.content();
    // LGPD: dados pessoais não devem aparecer na tela pública
    expect(conteudo).not.toContain('55555-1');            // número da conta
    expect(conteudo).not.toContain('Cliente Playwright'); // nome do titular
  });
});
