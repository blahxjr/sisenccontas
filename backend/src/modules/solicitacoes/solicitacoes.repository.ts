import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma/prisma.service';

/** Dados necessários para persistir uma nova solicitação. */
interface CriarSolicitacaoInput {
  numeroProtocolo: string;
  agencia: string;
  numeroConta: string;
  titularNome: string;
  motivoEncerramento?: string;
  aceiteTermosVersao: string;
  aceiteTermosTimestamp: Date;
  ipOrigemMascarado?: string;
}

/** Campos retornados publicamente após criação — sem dados sensíveis. */
const selectPublico = {
  id: true,
  numeroProtocolo: true,
  status: true,
  agencia: true,
  criadoEm: true,
} as const;

/** Campos retornados na consulta de status — sem dados sensíveis. */
const selectStatus = {
  numeroProtocolo: true,
  status: true,
  agencia: true,
  motivoEncerramento: true,
  criadoEm: true,
  atualizadoEm: true,
} as const;

@Injectable()
export class SolicitacoesRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Persiste uma nova solicitação de encerramento.
   * Retorna apenas campos não-sensíveis.
   */
  async criar(dados: CriarSolicitacaoInput) {
    return this.prisma.solicitacao.create({
      data: {
        numeroProtocolo: dados.numeroProtocolo,
        agencia: dados.agencia,
        numeroConta: dados.numeroConta,
        titularNome: dados.titularNome,
        motivoEncerramento: dados.motivoEncerramento,
        aceiteTermosVersao: dados.aceiteTermosVersao,
        aceiteTermosTimestamp: dados.aceiteTermosTimestamp,
        ipOrigemMascarado: dados.ipOrigemMascarado,
      },
      select: selectPublico,
    });
  }

  /**
   * Busca o status de uma solicitação pelo número de protocolo.
   * Retorna apenas metadados — sem numeroConta ou titularNome.
   */
  async buscarStatusPorProtocolo(protocolo: string) {
    return this.prisma.solicitacao.findUnique({
      where: { numeroProtocolo: protocolo },
      select: selectStatus,
    });
  }
}
