import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { TipoDocumento } from '@prisma/client';
import { MinioService } from '@shared/minio/minio.service';
import { PdfService, DadosTermoEncerramento } from '@shared/pdf/pdf.service';
import { gerarHashSha256 } from '@shared/utils/seguranca.util';
import { DocumentosRepository } from './documentos.repository';

const MIME_PDF = 'application/pdf';
const TAMANHO_MAX_UPLOAD = 10 * 1024 * 1024; // 10 MB

/**
 * Service responsável por toda a lógica de negócio de documentos.
 * Integra MinIO (armazenamento), PdfService (geração) e DocumentosRepository (metadados).
 */
@Injectable()
export class DocumentosService {
  private readonly logger = new Logger(DocumentosService.name);

  constructor(
    private readonly repo: DocumentosRepository,
    private readonly minio: MinioService,
    private readonly pdf: PdfService,
  ) {}

  /**
   * Gera o Termo de Encerramento em PDF e armazena no MinIO.
   * Retorna o ID do documento e uma URL presignada de 5 minutos.
   */
  async gerarTermo(
    solicitacaoId: string,
    dadosSensiveis: DadosTermoEncerramento,
  ): Promise<{ id: string; url: string }> {
    const pdfBuffer = await this.pdf.gerarTermoEncerramento(dadosSensiveis);
    const hash = gerarHashSha256(pdfBuffer);
    const chave = `termos/${solicitacaoId}/termo_${Date.now()}.pdf`;

    await this.minio.upload(chave, pdfBuffer, MIME_PDF);

    const doc = await this.repo.registrar({
      solicitacao: { connect: { id: solicitacaoId } },
      tipo: TipoDocumento.TERMO_GERADO,
      nomeOriginal: `termo_encerramento_${dadosSensiveis.protocolo}.pdf`,
      bucketMinio: this.minio.bucket,
      chaveObjeto: chave,
      hashSha256: hash,
      tamanhoBytes: pdfBuffer.length,
      mimeType: MIME_PDF,
    });

    const url = await this.minio.gerarUrlPresignada(chave);
    this.logger.log(`[DOCS] Termo gerado — solicitacaoId=${solicitacaoId} docId=${doc.id}`);
    return { id: doc.id, url };
  }

  /**
   * Recebe e valida o upload do termo assinado pelo cliente.
   * Verifica: tamanho máximo, MIME type e assinatura mágica %PDF.
   */
  async receberTermoAssinado(
    solicitacaoId: string,
    buffer: Buffer,
    nomeOriginal: string,
    mimeType: string,
  ): Promise<{ id: string }> {
    if (buffer.length > TAMANHO_MAX_UPLOAD) {
      throw new BadRequestException('Arquivo excede o tamanho máximo de 10 MB.');
    }
    if (mimeType !== MIME_PDF) {
      throw new BadRequestException('Apenas arquivos PDF são aceitos.');
    }
    // Verificar assinatura mágica do PDF (magic bytes) — previne bypass de MIME
    if (!buffer.subarray(0, 4).equals(Buffer.from('%PDF'))) {
      throw new BadRequestException('Arquivo inválido — não é um PDF legítimo.');
    }

    const hash = gerarHashSha256(buffer);
    const chave = `assinados/${solicitacaoId}/termo_assinado_${Date.now()}.pdf`;

    await this.minio.upload(chave, buffer, MIME_PDF);

    const doc = await this.repo.registrar({
      solicitacao: { connect: { id: solicitacaoId } },
      tipo: TipoDocumento.TERMO_ASSINADO,
      nomeOriginal: nomeOriginal.substring(0, 255),
      bucketMinio: this.minio.bucket,
      chaveObjeto: chave,
      hashSha256: hash,
      tamanhoBytes: buffer.length,
      mimeType: MIME_PDF,
    });

    // Log sem dados pessoais — apenas hash parcial (LGPD minimização)
    this.logger.log(
      `[DOCS] Termo assinado recebido — solicitacaoId=${solicitacaoId} hash=${hash.substring(0, 16)}...`,
    );
    return { id: doc.id };
  }

  /** Lista documentos de uma solicitação sem expor chaveObjeto. */
  async listarPorSolicitacao(solicitacaoId: string) {
    return this.repo.listarPorSolicitacao(solicitacaoId);
  }

  /**
   * Gera URL presignada de download válida por 5 minutos.
   * O cliente nunca acessa o MinIO diretamente.
   */
  async gerarUrlDownload(docId: string): Promise<{ url: string; expiraEm: string }> {
    const doc = await this.repo.buscarPorId(docId);
    if (!doc) throw new NotFoundException('Documento não encontrado.');
    const url = await this.minio.gerarUrlPresignada(doc.chaveObjeto);
    const expiraEm = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    return { url, expiraEm };
  }
}
