import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { StatusSolicitacao } from '@prisma/client';
import { SolicitacoesRepository, ListarSolicitacoesParams } from '@modules/solicitacoes/solicitacoes.repository';
import { descriptografarCampo } from '@shared/utils/seguranca.util';
import { DocumentosService } from '@modules/documentos/documentos.service';
import { CatalogosService } from '@modules/catalogos/catalogos.service';

@Injectable()
export class InternoService {
  private readonly logger = new Logger(InternoService.name);
  private readonly chave = process.env.ENCRYPTION_KEY ?? 'chave-local-desenvolvimento-32ch';

  constructor(
    private readonly solicitacoesRepo: SolicitacoesRepository,
    private readonly documentosService: DocumentosService,
    private readonly catalogosService: CatalogosService,
  ) {}

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

  /**
   * Lista documentos de uma solicitação para exibição no painel interno.
   * Não expõe chaveObjeto — usa URL presignada para download.
   */
  async listarDocumentos(solicitacaoId: string) {
    return this.documentosService.listarPorSolicitacao(solicitacaoId);
  }

  /**
   * Gera o Termo de Encerramento em PDF para uma solicitação.
   * Descriptografa dados sensíveis, monta DadosTermoEncerramento e delega ao DocumentosService.
   */
  async gerarTermoParaSolicitacao(id: string): Promise<{ id: string; url: string }> {
    const solicitacao = await this.solicitacoesRepo.buscarPorId(id);
    if (!solicitacao) throw new NotFoundException('Solicitação não encontrada.');

    const agencia = this.catalogosService.buscarAgenciaPorCodigo(solicitacao.agencia);
    const nomeAgencia = agencia?.nome ?? solicitacao.agencia;

    const motivoDescricao = solicitacao.motivoEncerramento ?? 'Não informado';

    this.logger.log(`[AUDITORIA] gerou termo para id=${id}`);

    return this.documentosService.gerarTermo(id, {
      protocolo: solicitacao.numeroProtocolo,
      agencia: solicitacao.agencia,
      nomeAgencia,
      numeroConta: this.descriptografar(solicitacao.numeroConta),
      titularNome: this.descriptografar(solicitacao.titularNome),
      motivoDescricao,
      dataAceite: new Date(solicitacao.aceiteTermosTimestamp),
      versaoTermos: solicitacao.aceiteTermosVersao,
      // Novos campos — conformidade BRF-3303-03-11
      enderecoCliente: solicitacao.enderecoCliente ?? undefined,
      emailCliente: solicitacao.emailCliente ? this.descriptografar(solicitacao.emailCliente) : undefined,
      possuiCheque: solicitacao.possuiCheque,
      numeroChequeDevolvido: solicitacao.numeroChequeDevolvido ?? undefined,
      possuiSaldoPositivo: solicitacao.possuiSaldoPositivo,
      bancoTransferencia: solicitacao.bancoTransferencia ?? undefined,
      agenciaTransferencia: solicitacao.agenciaTransferencia ?? undefined,
      contaTransferencia: solicitacao.contaTransferencia ? this.descriptografar(solicitacao.contaTransferencia) : undefined,
    });
  }

  /** Gera URL presignada de download para um documento. */
  async gerarUrlDownload(docId: string) {
    return this.documentosService.gerarUrlDownload(docId);
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
