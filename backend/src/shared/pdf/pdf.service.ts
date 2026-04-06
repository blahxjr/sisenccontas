import { Injectable } from '@nestjs/common';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/** Dados necessários para gerar o Termo de Encerramento em PDF. */
export interface DadosTermoEncerramento {
  protocolo: string;
  agencia: string;
  nomeAgencia: string;
  numeroConta: string; // descriptografado — passado pelo service interno
  titularNome: string; // descriptografado
  motivoDescricao: string;
  dataAceite: Date;
  versaoTermos: string;
  // Novos campos — conformidade normativa 3303-03-11
  enderecoCliente?: string;
  emailCliente?: string;
  possuiCheque?: boolean;
  numeroChequeDevolvido?: string;
  possuiSaldoPositivo?: boolean;
  bancoTransferencia?: string;
  agenciaTransferencia?: string;
  contaTransferencia?: string;
}

/**
 * Serviço responsável pela geração de documentos PDF.
 * Utiliza pdf-lib para criar documentos no servidor sem dependências nativas.
 */
@Injectable()
export class PdfService {
  /**
   * Gera o Termo de Encerramento de Conta Corrente conforme modelo oficial BNB 3303-40-64.
   * 14 seções obrigatórias, cabeçalho vermelho BNB, faixa laranja, recibo e rodapé.
   * Suporta múltiplas páginas com quebra de linha baseada em largura real de pixel.
   * @param dados - Dados descriptografados da solicitação
   * @returns Buffer contendo o PDF gerado
   */
  async gerarTermoEncerramento(dados: DadosTermoEncerramento): Promise<Buffer> {
    const doc = await PDFDocument.create();
    const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

    const PAGE_W = 595;
    const PAGE_H = 842;
    const MARGIN_L = 45;
    const CONTENT_W = PAGE_W - MARGIN_L - 40; // 510px utilizáveis

    // Cores BNB oficiais
    const corVermelho = rgb(0.651, 0.098, 0.235);  // #A6193C
    const corLaranja  = rgb(0.965, 0.545, 0.122);  // #F68B1F
    const corCinza    = rgb(0.392, 0.392, 0.392);  // #646464
    const corPreto    = rgb(0, 0, 0);

    let page = doc.addPage([PAGE_W, PAGE_H]);
    let y = PAGE_H;

    // ── Rodapé em todas as páginas ────────────────────────────────────────────
    const aplicarRodape = (pg: typeof page): void => {
      pg.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: 18, color: corVermelho });
      pg.drawText(
        `Documento gerado eletronicamente em ${new Date().toLocaleString('pt-BR')} | Protocolo: ${dados.protocolo} | 3303-40-64 v.020`,
        { x: 40, y: 5, font: fontRegular, size: 7, color: rgb(1, 1, 1) },
      );
    };

    // ── Cabeçalho da primeira página ──────────────────────────────────────────
    page.drawRectangle({ x: 0, y: PAGE_H - 70, width: PAGE_W, height: 70, color: corVermelho });
    page.drawRectangle({ x: 0, y: PAGE_H - 78, width: PAGE_W, height: 8,  color: corLaranja });
    page.drawText('BANCO DO NORDESTE DO BRASIL S/A', {
      x: 40, y: PAGE_H - 35, font: fontBold, size: 14, color: rgb(1, 1, 1),
    });
    page.drawText('CNPJ: 07.237.373/0001-20', {
      x: 40, y: PAGE_H - 55, font: fontRegular, size: 9, color: rgb(1, 0.9, 0.9),
    });
    page.drawText('TERMO DE ENCERRAMENTO DE CONTA', {
      x: 280, y: PAGE_H - 42, font: fontBold, size: 11, color: rgb(1, 1, 1),
    });
    page.drawText(`Protocolo: ${dados.protocolo}`, {
      x: 280, y: PAGE_H - 58, font: fontRegular, size: 9, color: rgb(1, 0.9, 0.9),
    });
    y = PAGE_H - 92;

    // ── Helper: verificar espaço e criar nova página se necessário ────────────
    // alturaNeeded = px que serão consumidos abaixo do y atual
    // Mantém margem de 75px para o rodapé + espaço de segurança
    const verificarEspaco = (alturaNeeded: number): void => {
      if (y - alturaNeeded < 75) {
        aplicarRodape(page);
        page = doc.addPage([PAGE_W, PAGE_H]);
        page.drawRectangle({ x: 0, y: PAGE_H - 28, width: PAGE_W, height: 28, color: corVermelho });
        page.drawRectangle({ x: 0, y: PAGE_H - 36, width: PAGE_W, height: 8,  color: corLaranja });
        page.drawText('BANCO DO NORDESTE DO BRASIL S/A — TERMO DE ENCERRAMENTO (continuação)', {
          x: 40, y: PAGE_H - 19, font: fontBold, size: 8, color: rgb(1, 1, 1),
        });
        y = PAGE_H - 52;
      }
    };

    // ── Helper: quebrar texto por largura real de pixel (não contagem de chars) ─
    const quebraTexto = (
      texto: string,
      font: typeof fontRegular,
      size: number,
      maxW: number,
    ): string[] => {
      const palavras = texto.split(' ');
      const linhas: string[] = [];
      let linha = '';
      for (const palavra of palavras) {
        const candidato = linha ? `${linha} ${palavra}` : palavra;
        if (font.widthOfTextAtSize(candidato, size) > maxW) {
          if (linha) linhas.push(linha);
          linha = palavra;
        } else {
          linha = candidato;
        }
      }
      if (linha) linhas.push(linha);
      return linhas;
    };

    // ── Helper: renderizar texto com quebra automática e paginação ─────────────
    const renderTexto = (
      texto: string,
      font: typeof fontRegular,
      size: number,
      lineHeight: number,
      x = MARGIN_L,
      maxW = CONTENT_W,
    ): void => {
      const linhas = quebraTexto(texto, font, size, maxW);
      for (const linha of linhas) {
        verificarEspaco(lineHeight + 4);
        page.drawText(linha, { x, y, font, size, color: corPreto });
        y -= lineHeight;
      }
    };

    // ── Helper: cabeçalho de seção com fundo cinza ────────────────────────────
    const secao = (titulo: string): void => {
      verificarEspaco(32);
      page.drawRectangle({ x: 40, y: y - 4, width: CONTENT_W + 5, height: 16, color: rgb(0.95, 0.95, 0.95) });
      page.drawText(titulo, { x: MARGIN_L, y, font: fontBold, size: 9, color: corVermelho });
      y -= 22;
    };

    // ── SEÇÃO 1 — Identificação do Destinatário ───────────────────────────────
    secao('1  IDENTIFICAÇÃO DO DESTINATÁRIO');
    page.drawText('1.1  Nome da Instituição Financeira Signatária:', {
      x: MARGIN_L, y, font: fontBold, size: 8, color: corCinza,
    });
    y -= 13;
    page.drawText('BANCO DO NORDESTE DO BRASIL S/A', {
      x: MARGIN_L, y, font: fontBold, size: 9, color: corVermelho,
    });
    y -= 16;
    page.drawText('1.2  Nome e número da agência:', {
      x: MARGIN_L, y, font: fontBold, size: 8, color: corCinza,
    });
    y -= 13;
    page.drawText(`${dados.agencia} — ${dados.nomeAgencia}`, {
      x: MARGIN_L, y, font: fontRegular, size: 9, color: corPreto,
    });
    y -= 18;

    // ── SEÇÃO 2 — Identificação da Conta ─────────────────────────────────────
    secao('2  IDENTIFICAÇÃO DA CONTA CORRENTE');
    page.drawText('2.1  Número com DV:', { x: MARGIN_L, y, font: fontBold, size: 8, color: corCinza });
    page.drawText('2.2  Nome do(s) titular(es):', { x: 250, y, font: fontBold, size: 8, color: corCinza });
    y -= 13;
    page.drawText(dados.numeroConta, { x: MARGIN_L, y, font: fontRegular, size: 9, color: corPreto });
    page.drawText(dados.titularNome, { x: 250, y, font: fontRegular, size: 9, color: corPreto });
    y -= 18;

    // ── SEÇÃO 3 — Motivo ──────────────────────────────────────────────────────
    secao('3  MOTIVO DO ENCERRAMENTO DA CONTA CORRENTE (facultativo)');
    renderTexto(dados.motivoDescricao, fontRegular, 9, 13);
    y -= 5;

    // ── SEÇÕES 4-13 — Cláusulas legais ───────────────────────────────────────
    const clausulas: [string, string][] = [
      ['4  EFEITOS DO PEDIDO DE ENCERRAMENTO',
        '4.1  Estou ciente de que o pedido de encerramento da conta corrente produz imediatamente os seus efeitos, sendo permitido, nos casos de tarifas pendentes relativas a eventual pacote de serviços incidentes, sua cobrança pro rata.'],
      ['5  FOLHAS DE CHEQUES NÃO UTILIZADAS',
        `5.1  Declaro que o(s) cheque(s) sob meu poder foi(ram) devolvido(s) à Instituição Financeira Signatária ou inutilizado(s).${dados.numeroChequeDevolvido ? ` Número(s): ${dados.numeroChequeDevolvido}.` : ''}`],
      ['6  CARTÕES MAGNÉTICOS DE MOVIMENTAÇÃO',
        '6.1  Declaro que o(s) cartão(ões) magnéticos utilizados para a movimentação da conta corrente foram devolvidos ou inutilizados.'],
      ['7  DA MANUTENÇÃO DE FUNDOS',
        '7.1  Estou ciente que devo manter fundos suficientes para a liquidação de compromissos assumidos, decorrentes de: I - Tributos; II - Contratos de prestação de serviços, empréstimos e limites de crédito; III - Convênios para débitos automáticos; IV - Outras obrigações vinculadas à conta.'],
      ['8  SALDO CREDOR (SE HOUVER)',
        `8.1  Estou ciente de que se o saldo credor não for retirado antes do encerramento, será colocado à minha disposição para saque, transferência ou ordem de pagamento. 8.1.1 Estou ciente da cobrança de tarifa para transferências para outra(s) instituição(ões).${dados.bancoTransferencia ? ` Banco de destino: ${dados.bancoTransferencia} — Ag: ${dados.agenciaTransferencia ?? ''} — Conta: ${dados.contaTransferencia ?? ''}.` : ''}`],
      ['9  DÉBITOS AUTOMÁTICOS (SE HOUVER)',
        '9.1  Estou ciente de que a Instituição Financeira Signatária poderá cancelar as autorizações para débito automático. 9.2  A suspensão dos débitos programados pode ser feita por mim, observado prazo mínimo de 5 dias úteis anteriores à data programada.'],
      ['10  TRANSAÇÕES',
        '10.1  Estou ciente que os débitos das transações que efetuei serão pagos normalmente, desde que existam fundos, durante o período entre o pedido e a efetivação do encerramento.'],
      ['11  CHEQUES SUSTADOS, REVOGADOS OU CANCELADOS',
        '11.1  Estou ciente de que, na hipótese de apresentação dentro do prazo de prescrição, eventuais cheques sustados, revogados ou cancelados serão devolvidos pelos respectivos motivos, mesmo após o encerramento da conta.'],
      ['12  CHEQUES PRÉ-DATADOS OU PENDENTES',
        '12.1  Estou ciente de que referidos cheques serão devolvidos, mesmo após o encerramento, não me eximindo de obrigações legais, inclusive com possibilidade de inclusão no CCF do Banco Central do Brasil.'],
      ['13  PRAZO PARA ENCERRAMENTO DE CONTA',
        '13.1  Estou ciente de que o encerramento ocorrerá em até 30 (trinta) dias corridos, com data final indicada mediante notificação por meio eficaz ou correspondência.'],
    ];

    for (const [titulo, texto] of clausulas) {
      secao(titulo);
      renderTexto(texto, fontRegular, 8, 11);
      y -= 5;
    }

    // ── SEÇÃO 14 — Assinatura ────────────────────────────────────────────────
    // Reserva ~210px para seção 14 + assinatura + recibo, evitando sobreposição
    verificarEspaco(210);
    secao('14  ASSINATURA(S) E ENDEREÇO(S) ATUALIZADO(S) DO(S) TITULAR(ES)');
    renderTexto(
      '14.1  É indispensável a apresentação da assinatura, ou do(s) procurador(es) legalmente habilitado(s), bem como o fornecimento do endereço atualizado.',
      fontRegular, 8, 11,
    );
    y -= 8;

    page.drawText(
      `Local e data: ${dados.dataAceite.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`,
      { x: MARGIN_L, y, font: fontRegular, size: 9, color: corPreto },
    );
    y -= 16;

    renderTexto(
      `Endereço atualizado: ${dados.enderecoCliente ?? '______________________________________'}`,
      fontRegular, 9, 14,
    );
    renderTexto(
      `E-mail: ${dados.emailCliente ?? '________________________________________'}`,
      fontRegular, 9, 14,
    );
    y -= 20;

    // Linha de assinatura do titular
    page.drawLine({ start: { x: MARGIN_L, y }, end: { x: 285, y }, thickness: 0.8, color: corPreto });
    y -= 13;
    page.drawText('(Nome/assinatura do titular)', { x: MARGIN_L, y, font: fontRegular, size: 8, color: corCinza });
    y -= 22;

    // ── RECIBO DO BANCO ──────────────────────────────────────────────────────
    verificarEspaco(55);
    const reciboY = y - 44;
    page.drawRectangle({ x: 40, y: reciboY, width: CONTENT_W + 5, height: 44, borderColor: corVermelho, borderWidth: 1 });
    page.drawText('Banco do Nordeste do Brasil S/A', {
      x: 50, y: reciboY + 29, font: fontBold, size: 9, color: corVermelho,
    });
    page.drawText('Recebido em: ____/____/____', {
      x: 50, y: reciboY + 14, font: fontRegular, size: 9, color: corPreto,
    });
    page.drawText('Carimbo e assinatura', {
      x: 350, y: reciboY + 14, font: fontRegular, size: 9, color: corPreto,
    });

    // ── RODAPÉ da última página ───────────────────────────────────────────────
    aplicarRodape(page);

    return Buffer.from(await doc.save());
  }
}
