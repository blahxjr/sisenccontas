import { Injectable } from '@nestjs/common';
import { StatusSolicitacao } from '@prisma/client';
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
  // Campos complementares — conformidade normativa 3303-03-11
  enderecoCliente?: string;
  emailCliente?: string;
  possuiCheque?: boolean;
  numeroChequeDevolvido?: string;
  possuiSaldoPositivo?: boolean;
  bancoTransferencia?: string;
  agenciaTransferencia?: string;
  contaTransferencia?: string;
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

/** Parâmetros para listagem paginada de solicitações. */
export interface ListarSolicitacoesParams {
  pagina: number;
  itensPorPagina?: number;
  status?: StatusSolicitacao;
  agencia?: string;
}

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
        enderecoCliente: dados.enderecoCliente,
        emailCliente: dados.emailCliente,
        possuiCheque: dados.possuiCheque ?? false,
        numeroChequeDevolvido: dados.numeroChequeDevolvido,
        possuiSaldoPositivo: dados.possuiSaldoPositivo ?? false,
        bancoTransferencia: dados.bancoTransferencia,
        agenciaTransferencia: dados.agenciaTransferencia,
        contaTransferencia: dados.contaTransferencia,
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

  /**
   * Lista solicitações paginadas para uso interno.
   * Retorna campos sensíveis criptografados — descriptografar no InternoService.
   */
  async listar(params: ListarSolicitacoesParams) {
    const { pagina, itensPorPagina = 10, status, agencia } = params;
    const skip = (pagina - 1) * itensPorPagina;

    const where = {
      ...(status ? { status } : {}),
      ...(agencia ? { agencia } : {}),
    };

    const [total, itens] = await Promise.all([
      this.prisma.solicitacao.count({ where }),
      this.prisma.solicitacao.findMany({
        where,
        skip,
        take: itensPorPagina,
        orderBy: { criadoEm: 'desc' },
        select: {
          id: true,
          numeroProtocolo: true,
          agencia: true,
          status: true,
          motivoEncerramento: true,
          criadoEm: true,
          atualizadoEm: true,
        },
      }),
    ]);

    return {
      total,
      pagina,
      itensPorPagina,
      totalPaginas: Math.ceil(total / itensPorPagina),
      itens,
    };
  }

  /**
   * Busca uma solicitação pelo ID incluindo campos criptografados.
   * Uso exclusivo do módulo interno — descriptografar antes de expor.
   */
  async buscarPorId(id: string) {
    return this.prisma.solicitacao.findUnique({ where: { id } });
  }

  /**
   * Atualiza o status de uma solicitação.
   */
  async atualizarStatus(id: string, status: StatusSolicitacao) {
    return this.prisma.solicitacao.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        numeroProtocolo: true,
        status: true,
        atualizadoEm: true,
      },
    });
  }
}
