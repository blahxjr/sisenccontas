import { Injectable } from '@nestjs/common';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';

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
}

/**
 * Serviço responsável pela geração de documentos PDF.
 * Utiliza pdf-lib para criar documentos no servidor sem dependências nativas.
 */
@Injectable()
export class PdfService {
  /**
   * Gera o Termo de Encerramento de Conta Corrente em formato PDF.
   * Inclui cabeçalho BNB, dados da solicitação, declaração legal e marca d'água.
   * @param dados - Dados descritografados da solicitação
   * @returns Buffer contendo o PDF gerado
   */
  async gerarTermoEncerramento(dados: DadosTermoEncerramento): Promise<Buffer> {
    const doc = await PDFDocument.create();
    const page = doc.addPage([595, 842]); // A4 em pontos
    const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
    const { height } = page.getSize();

    // Cabeçalho BNB — Vermelho oficial (#A6193C)
    page.drawRectangle({
      x: 0,
      y: height - 80,
      width: 595,
      height: 80,
      color: rgb(0.651, 0.098, 0.235), // #A6193C — Vermelho BNB
    });
    page.drawText('BANCO DO NORDESTE DO BRASIL', {
      x: 40,
      y: height - 35,
      font: fontBold,
      size: 16,
      color: rgb(1, 1, 1),
    });
    page.drawText('TERMO DE ENCERRAMENTO DE CONTA CORRENTE', {
      x: 40,
      y: height - 58,
      font: fontRegular,
      size: 11,
      color: rgb(0.965, 0.545, 0.122), // #F68B1F — Laranja BNB
    });

    // Protocolo em destaque
    page.drawText(`Protocolo: ${dados.protocolo}`, {
      x: 40,
      y: height - 110,
      font: fontBold,
      size: 13,
      color: rgb(0, 0, 0),
    });

    // Linha separadora
    page.drawLine({
      start: { x: 40, y: height - 125 },
      end: { x: 555, y: height - 125 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });

    // Dados da solicitação
    const linhas: [string, string][] = [
      ['Titular:', dados.titularNome],
      ['Agência:', `${dados.agencia} — ${dados.nomeAgencia}`],
      ['Conta Corrente:', dados.numeroConta],
      ['Motivo do Encerramento:', dados.motivoDescricao],
      [
        'Data da Solicitação:',
        dados.dataAceite.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
      ],
      ['Versão dos Termos Aceitos:', dados.versaoTermos],
    ];

    let y = height - 160;
    for (const [label, valor] of linhas) {
      page.drawText(label, { x: 40, y, font: fontBold, size: 11, color: rgb(0, 0, 0) });
      page.drawText(valor, {
        x: 185,
        y,
        font: fontRegular,
        size: 11,
        color: rgb(0.1, 0.1, 0.1),
      });
      y -= 30;
    }

    // Declaração legal
    y -= 20;
    page.drawLine({
      start: { x: 40, y },
      end: { x: 555, y },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    y -= 25;
    const textoLegal = [
      'Pelo presente instrumento, o titular acima identificado solicita o encerramento',
      'da conta corrente junto ao Banco do Nordeste do Brasil S.A., declarando estar',
      'ciente de que a conta somente será encerrada após a regularização de eventuais',
      'pendências financeiras, conforme normas do Banco Central do Brasil.',
    ];
    for (const linha of textoLegal) {
      page.drawText(linha, { x: 40, y, font: fontRegular, size: 10, color: rgb(0.2, 0.2, 0.2) });
      y -= 18;
    }

    // Área de assinatura
    y -= 40;
    page.drawLine({
      start: { x: 40, y },
      end: { x: 280, y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    page.drawText('Assinatura do Titular / gov.br', {
      x: 40,
      y: y - 15,
      font: fontRegular,
      size: 9,
      color: rgb(0.4, 0.4, 0.4),
    });

    // Marca d'água — aguardando assinatura
    page.drawText('AGUARDANDO ASSINATURA', {
      x: 80,
      y: 300,
      font: fontBold,
      size: 38,
      color: rgb(0.9, 0.9, 0.9),
      rotate: degrees(35),
      opacity: 0.4,
    });

    // Rodapé
    page.drawText(
      `Banco do Nordeste do Brasil S.A. — CNPJ 07.237.373/0001-20 | Gerado em ${new Date().toLocaleString('pt-BR')}`,
      { x: 40, y: 25, font: fontRegular, size: 8, color: rgb(0.5, 0.5, 0.5) },
    );

    const pdfBytes = await doc.save();
    return Buffer.from(pdfBytes);
  }
}
