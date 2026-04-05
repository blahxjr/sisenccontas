import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { StatusSolicitacao } from '@prisma/client';
import { SolicitacoesRepository, ListarSolicitacoesParams } from '@modules/solicitacoes/solicitacoes.repository';
import { descriptografarCampo } from '@shared/utils/seguranca.util';

@Injectable()
export class InternoService {
  private readonly logger = new Logger(InternoService.name);
  private readonly chave = process.env.ENCRYPTION_KEY ?? 'chave-local-desenvolvimento-32ch';

  constructor(private readonly solicitacoesRepo: SolicitacoesRepository) {}

  /**
   * Lista solicitações paginadas para o painel do operador.
   * Não descriptografa campos sensíveis — apenas metadados.
   */
  async listar(params: ListarSolicitacoesParams) {
    return this.solicitacoesRepo.listar(params);
  }

  /**
   * Busca uma solicitação com dados sensíveis descriptografados.
   * Uso exclusivo de operadores internos autenticados.
   * Registra log de auditoria com o ID acessado.
   */
  async buscarComDadosSensiveis(id: string, matriculaOperador = 'SISTEMA') {
    const solicitacao = await this.solicitacoesRepo.buscarPorId(id);
    if (!solicitacao) throw new NotFoundException('Solicitação não encontrada.');

    this.logger.log(`[AUDITORIA] operador=${matriculaOperador} acessou id=${id}`);

    return {
      id: solicitacao.id,
      numeroProtocolo: solicitacao.numeroProtocolo,
      agencia: solicitacao.agencia,
      numeroConta: this.descriptografar(solicitacao.numeroConta),
      titularNome: this.descriptografar(solicitacao.titularNome),
      motivoEncerramento: solicitacao.motivoEncerramento,
      status: solicitacao.status,
      aceiteTermosVersao: solicitacao.aceiteTermosVersao,
      aceiteTermosTimestamp: solicitacao.aceiteTermosTimestamp,
      criadoEm: solicitacao.criadoEm,
      atualizadoEm: solicitacao.atualizadoEm,
    };
  }

  /**
   * Atualiza o status de uma solicitação.
   * Registra log de auditoria com operador e novo status.
   */
  async atualizarStatus(id: string, status: StatusSolicitacao, matriculaOperador = 'SISTEMA') {
    const solicitacao = await this.solicitacoesRepo.buscarPorId(id);
    if (!solicitacao) throw new NotFoundException('Solicitação não encontrada.');

    this.logger.log(`[AUDITORIA] operador=${matriculaOperador} alterou status de id=${id} para ${status}`);

    return this.solicitacoesRepo.atualizarStatus(id, status);
  }

  /** Descriptografa campo com tratamento de erro — retorna '***' se falhar. */
  private descriptografar(valor: string): string {
    try {
      return descriptografarCampo(valor, this.chave);
    } catch {
      return '***';
    }
  }
}
