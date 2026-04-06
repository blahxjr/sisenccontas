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
   * @param dados - Dados descriptografados da solicitação
   * @returns Buffer contendo o PDF gerado
   */
  async gerarTermoEncerramento(dados: DadosTermoEncerramento): Promise<Buffer> {
    const doc = await PDFDocument.create();
    const page = doc.addPage([595, 842]); // A4
    const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
    const { height } = page.getSize();

    // Cores BNB oficiais (RGB normalizado 0-1)
    const vermelhoBnb = rgb(0.651, 0.098, 0.235);   // #A6193C
    const laranjaBnb = rgb(0.965, 0.545, 0.122);    // #F68B1F
    const cinzaTexto = rgb(0.392, 0.392, 0.392);    // #646464
    const preto = rgb(0, 0, 0);

    // ── CABEÇALHO ──────────────────────────────────────────────────────────────
    page.drawRectangle({ x: 0, y: height - 70, width: 595, height: 70, color: vermelhoBnb });
    page.drawRectangle({ x: 0, y: height - 78, width: 595, height: 8, color: laranjaBnb });

    page.drawText('BANCO DO NORDESTE DO BRASIL S/A', {
      x: 40, y: height - 35, font: fontBold, size: 14, color: rgb(1, 1, 1),
    });
    page.drawText('CNPJ: 07.237.373/0001-20', {
      x: 40, y: height - 55, font: fontRegular, size: 9, color: rgb(1, 0.9, 0.9),
    });
    page.drawText('TERMO DE ENCERRAMENTO DE CONTA', {
      x: 280, y: height - 42, font: fontBold, size: 11, color: rgb(1, 1, 1),
    });
    page.drawText(`Protocolo: ${dados.protocolo}`, {
      x: 280, y: height - 58, font: fontRegular, size: 9, color: rgb(1, 0.9, 0.9),
    });

    // ── HELPERS ────────────────────────────────────────────────────────────────
    let y = height - 100;

    const desenharSecao = (titulo: string, yPos: number): number => {
      page.drawRectangle({ x: 40, y: yPos - 4, width: 515, height: 16, color: rgb(0.95, 0.95, 0.95) });
      page.drawText(titulo, { x: 45, y: yPos, font: fontBold, size: 9, color: vermelhoBnb });
      return yPos - 22;
    };

    const quebrarTexto = (texto: string, largura: number): string[] => {
      const palavras = texto.split(' ');
      const linhas: string[] = [];
      let linha = '';
      for (const palavra of palavras) {
        if ((linha + palavra).length > largura) {
          linhas.push(linha.trim());
          linha = palavra + ' ';
        } else {
          linha += palavra + ' ';
        }
      }
      if (linha.trim()) linhas.push(linha.trim());
      return linhas;
    };

    // ── SEÇÃO 1 — Identificação do Destinatário ────────────────────────────────
    y = desenharSecao('1  IDENTIFICAÇÃO DO DESTINATÁRIO', y);
    page.drawText('1.1  Nome da Instituição Financeira Signatária:', { x: 45, y, font: fontBold, size: 8, color: cinzaTexto });
    page.drawText('BANCO DO NORDESTE DO BRASIL S/A', { x: 45, y: y - 12, font: fontBold, size: 9, color: vermelhoBnb });
    y -= 28;
    page.drawText('1.2  Nome e número da agência:', { x: 45, y, font: fontBold, size: 8, color: cinzaTexto });
    page.drawText(`${dados.agencia} — ${dados.nomeAgencia}`, { x: 45, y: y - 12, font: fontRegular, size: 9, color: preto });
    y -= 32;

    // ── SEÇÃO 2 — Identificação da Conta ──────────────────────────────────────
    y = desenharSecao('2  IDENTIFICAÇÃO DA CONTA CORRENTE', y);
    page.drawText('2.1  Número com DV:', { x: 45, y, font: fontBold, size: 8, color: cinzaTexto });
    page.drawText(dados.numeroConta, { x: 45, y: y - 12, font: fontRegular, size: 9, color: preto });
    page.drawText('2.2  Nome do(s) titular(es):', { x: 200, y, font: fontBold, size: 8, color: cinzaTexto });
    page.drawText(dados.titularNome, { x: 200, y: y - 12, font: fontRegular, size: 9, color: preto });
    y -= 32;

    // ── SEÇÃO 3 — Motivo ────────────────────────────────────────────────────────
    y = desenharSecao('3  MOTIVO DO ENCERRAMENTO DA CONTA CORRENTE (facultativo)', y);
    page.drawText(dados.motivoDescricao, { x: 45, y: y - 2, font: fontRegular, size: 9, color: preto });
    y -= 22;

    // ── SEÇÕES 4-13 — Cláusulas legais ─────────────────────────────────────────
    const clausulas: [string, string][] = [
      ['4  EFEITOS DO PEDIDO DE ENCERRAMENTO', '4.1  Estou ciente de que o pedido de encerramento da conta corrente produz imediatamente os seus efeitos, sendo permitido, nos casos de tarifas pendentes relativas a eventual pacote de serviços incidentes, sua cobrança pro rata.'],
      ['5  FOLHAS DE CHEQUES NÃO UTILIZADAS', `5.1  Declaro que o(s) cheque(s) sob meu poder foi(ram) devolvido(s) à Instituição Financeira Signatária ou inutilizado(s).${dados.numeroChequeDevolvido ? ` Número(s): ${dados.numeroChequeDevolvido}.` : ''}`],
      ['6  CARTÕES MAGNÉTICOS DE MOVIMENTAÇÃO', '6.1  Declaro que o(s) cartão(ões) magnéticos utilizados para a movimentação da conta corrente foram devolvidos ou inutilizados.'],
      ['7  DA MANUTENÇÃO DE FUNDOS', '7.1  Estou ciente que devo manter fundos suficientes para a liquidação de compromissos assumidos, decorrentes de: I - Tributos; II - Contratos de prestação de serviços, empréstimos e limites de crédito; III - Convênios para débitos automáticos; IV - Outras obrigações vinculadas à conta.'],
      ['8  SALDO CREDOR (SE HOUVER)', `8.1  Estou ciente de que se o saldo credor não for retirado antes do encerramento, será colocado à minha disposição para saque, transferência ou ordem de pagamento. 8.1.1 Estou ciente da cobrança de tarifa para transferências para outra(s) instituição(ões).${dados.bancoTransferencia ? ` Banco de destino: ${dados.bancoTransferencia} — Ag: ${dados.agenciaTransferencia ?? ''} — Conta: ${dados.contaTransferencia ?? ''}.` : ''}`],
      ['9  DÉBITOS AUTOMÁTICOS (SE HOUVER)', '9.1  Estou ciente de que a Instituição Financeira Signatária poderá cancelar as autorizações para débito automático. 9.2  A suspensão dos débitos programados pode ser feita por mim, observado prazo mínimo de 5 dias úteis anteriores à data programada.'],
      ['10  TRANSAÇÕES', '10.1  Estou ciente que os débitos das transações que efetuei serão pagos normalmente, desde que existam fundos, durante o período entre o pedido e a efetivação do encerramento.'],
      ['11  CHEQUES SUSTADOS, REVOGADOS OU CANCELADOS', '11.1  Estou ciente de que, na hipótese de apresentação dentro do prazo de prescrição, eventuais cheques sustados, revogados ou cancelados serão devolvidos pelos respectivos motivos, mesmo após o encerramento da conta.'],
      ['12  CHEQUES PRÉ-DATADOS OU PENDENTES', '12.1  Estou ciente de que referidos cheques serão devolvidos, mesmo após o encerramento, não me eximindo de obrigações legais, inclusive com possibilidade de inclusão no CCF do Banco Central do Brasil.'],
      ['13  PRAZO PARA ENCERRAMENTO DE CONTA', '13.1  Estou ciente de que o encerramento ocorrerá em até 30 (trinta) dias corridos, com data final indicada mediante notificação por meio eficaz ou correspondência.'],
    ];

    for (const [titulo, texto] of clausulas) {
      if (y < 120) break;
      y = desenharSecao(titulo, y);
      const linhasTexto = quebrarTexto(texto, 88);
      for (const linha of linhasTexto) {
        page.drawText(linha, { x: 45, y, font: fontRegular, size: 8, color: preto });
        y -= 11;
      }
      y -= 8;
    }

    // ── SEÇÃO 14 — Assinatura ───────────────────────────────────────────────────
    y = Math.min(y, 200);
    y = desenharSecao('14  ASSINATURA(S) E ENDEREÇO(S) ATUALIZADO(S) DO(S) TITULAR(ES)', y);
    page.drawText('14.1  É indispensável a apresentação da assinatura, ou do(s) procurador(es) legalmente habilitado(s), bem como o fornecimento do endereço atualizado.', {
      x: 45, y, font: fontRegular, size: 8, color: preto,
    });
    y -= 16;
    page.drawText(`Local e data: ${dados.dataAceite.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`, {
      x: 45, y, font: fontRegular, size: 9, color: preto,
    });
    y -= 10;
    page.drawText(`Endereço atualizado: ${dados.enderecoCliente ?? '______________________________________'}`, {
      x: 45, y, font: fontRegular, size: 9, color: preto,
    });
    y -= 10;
    page.drawText(`E-mail: ${dados.emailCliente ?? '________________________________________'}`, {
      x: 45, y, font: fontRegular, size: 9, color: preto,
    });
    y -= 28;

    page.drawLine({ start: { x: 45, y }, end: { x: 280, y }, thickness: 0.8, color: preto });
    page.drawText('(Nome/assinatura do titular)', { x: 45, y: y - 12, font: fontRegular, size: 8, color: cinzaTexto });

    // ── RECIBO DO BANCO ────────────────────────────────────────────────────────
    page.drawRectangle({ x: 40, y: 30, width: 515, height: 40, borderColor: vermelhoBnb, borderWidth: 1 });
    page.drawText('Banco do Nordeste do Brasil S/A', { x: 50, y: 58, font: fontBold, size: 9, color: vermelhoBnb });
    page.drawText('Recebido em: ____/____/____', { x: 50, y: 44, font: fontRegular, size: 9, color: preto });
    page.drawText('Carimbo e assinatura', { x: 350, y: 44, font: fontRegular, size: 9, color: preto });

    // ── RODAPÉ ──────────────────────────────────────────────────────────────────
    page.drawRectangle({ x: 0, y: 0, width: 595, height: 18, color: vermelhoBnb });
    page.drawText(
      `Documento gerado eletronicamente em ${new Date().toLocaleString('pt-BR')} | Protocolo: ${dados.protocolo} | 3303-40-64 v.020`,
      { x: 40, y: 5, font: fontRegular, size: 7, color: rgb(1, 1, 1) },
    );

    return Buffer.from(await doc.save());
  }
}
