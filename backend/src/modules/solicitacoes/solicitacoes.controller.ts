import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Request } from 'express';
import { SolicitacoesService } from './solicitacoes.service';
import { CriarSolicitacaoDto } from './criar-solicitacao.dto';
import { mascararIp } from '@shared/utils/seguranca.util';

/**
 * Controller de solicitações — rota pública, sem dados sensíveis nas respostas.
 */
@ApiTags('Solicitações')
@Controller('publico/solicitacoes')
export class SolicitacoesController {
  constructor(private readonly solicitacoesService: SolicitacoesService) {}

  /**
   * Registra uma nova solicitação de encerramento de conta corrente.
   * Retorna o número de protocolo para acompanhamento.
   */
  @Post()
  @ApiOperation({ summary: 'Registra uma solicitação de encerramento de conta corrente' })
  async criar(@Body() dto: CriarSolicitacaoDto, @Req() req: Request) {
    const ipOrigem = mascararIp(req.ip ?? '');
    return this.solicitacoesService.criar(dto, ipOrigem);
  }

  /**
   * Consulta o status de uma solicitação pelo número de protocolo.
   * Não retorna dados pessoais (conta, nome).
   */
  @Get(':protocolo/status')
  @ApiOperation({ summary: 'Consulta o status público de uma solicitação pelo protocolo' })
  @ApiParam({ name: 'protocolo', description: 'Número de protocolo no formato ENC-YYYY-XXXXXX' })
  async consultarStatus(@Param('protocolo') protocolo: string) {
    return this.solicitacoesService.consultarStatus(protocolo);
  }
}
