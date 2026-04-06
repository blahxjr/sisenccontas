import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { SolicitacoesRepository } from './solicitacoes.repository';
import { CriarSolicitacaoDto } from './criar-solicitacao.dto';
import { gerarNumeroProtocolo, criptografarCampo } from '@shared/utils/seguranca.util';

@Injectable()
export class SolicitacoesService {
  private readonly logger = new Logger(SolicitacoesService.name);

  constructor(private readonly repo: SolicitacoesRepository) {}

  /**
   * Registra uma nova solicitação de encerramento de conta corrente.
   * Criptografa numeroConta e titularNome antes de persistir.
   * Retorna o número de protocolo gerado — sem dados sensíveis.
   */
  async criar(dto: CriarSolicitacaoDto, ipOrigem?: string) {
    if (!dto.aceitouTermos) {
      throw new BadRequestException('O aceite dos termos é obrigatório.');
    }

    const chave = process.env.ENCRYPTION_KEY ?? '';
    if (!chave || chave.length < 32) {
      this.logger.warn('⚠️ ENCRYPTION_KEY ausente ou curta — verifique o arquivo .env');
    }

    const resultado = await this.repo.criar({
      numeroProtocolo: gerarNumeroProtocolo(),
      agencia: dto.agencia,
      numeroConta: criptografarCampo(dto.numeroConta, chave),
      titularNome: criptografarCampo(dto.titularNome, chave),
      motivoEncerramento: dto.motivoEncerramento,
      aceiteTermosVersao: dto.aceiteTermosVersao,
      aceiteTermosTimestamp: new Date(dto.aceiteTermosTimestamp),
      ipOrigemMascarado: ipOrigem,
      // Campos complementares — campos sensíveis criptografados em repouso
      enderecoCliente: dto.enderecoCliente,
      emailCliente: dto.emailCliente ? criptografarCampo(dto.emailCliente, chave) : undefined,
      possuiCheque: dto.possuiCheque,
      numeroChequeDevolvido: dto.numeroChequeDevolvido,
      possuiSaldoPositivo: dto.possuiSaldoPositivo,
      bancoTransferencia: dto.bancoTransferencia,
      agenciaTransferencia: dto.agenciaTransferencia,
      contaTransferencia: dto.contaTransferencia ? criptografarCampo(dto.contaTransferencia, chave) : undefined,
    });

    this.logger.log(`Solicitação criada — Protocolo: ${resultado.numeroProtocolo} | Agência: ${resultado.agencia}`);

    return {
      protocolo: resultado.numeroProtocolo,
      solicitacaoId: resultado.id,
      status: resultado.status,
      mensagem: 'Solicitação registrada com sucesso. Guarde o número de protocolo.',
    };
  }

  /**
   * Retorna metadados públicos de uma solicitação pelo protocolo.
   * Nunca expõe numeroConta, titularNome ou dados criptografados.
   */
  async consultarStatus(protocolo: string) {
    const solicitacao = await this.repo.buscarStatusPorProtocolo(protocolo);

    if (!solicitacao) {
      throw new NotFoundException('Solicitação não encontrada. Verifique o número de protocolo.');
    }

    return {
      protocolo: solicitacao.numeroProtocolo,
      status: solicitacao.status,
      agencia: solicitacao.agencia,
      motivoEncerramento: solicitacao.motivoEncerramento ?? null,
      criadoEm: solicitacao.criadoEm,
      atualizadoEm: solicitacao.atualizadoEm,
    };
  }
}
