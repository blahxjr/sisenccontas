import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@shared/prisma/prisma.service';

/** Selects públicos para listagem — não expõe chaveObjeto ao cliente. */
const selectListagem = {
  id: true,
  tipo: true,
  nomeOriginal: true,
  tamanhoBytes: true,
  mimeType: true,
  criadoEm: true,
} as const;

/**
 * Repositório de acesso ao banco para documentos.
 * Encapsula todas as queries relacionadas à tabela `documentos`.
 */
@Injectable()
export class DocumentosRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registra metadados de um novo documento no banco.
   * O arquivo em si fica no MinIO — apenas metadados são persistidos aqui.
   */
  async registrar(dados: Prisma.DocumentoCreateInput) {
    return this.prisma.documento.create({ data: dados });
  }

  /**
   * Lista documentos de uma solicitação.
   * Não expõe chaveObjeto — use gerarUrlDownload para acesso ao arquivo.
   */
  async listarPorSolicitacao(solicitacaoId: string) {
    return this.prisma.documento.findMany({
      where: { solicitacaoId },
      select: selectListagem,
      orderBy: { criadoEm: 'asc' },
    });
  }

  /** Busca documento completo (inclui chaveObjeto) para uso interno ao gerar URL presignada. */
  async buscarPorId(id: string) {
    return this.prisma.documento.findUnique({ where: { id } });
  }
}
