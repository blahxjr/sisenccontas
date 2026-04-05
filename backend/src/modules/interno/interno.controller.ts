import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  Headers,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { StatusSolicitacao } from '@prisma/client';
import { InternoService } from './interno.service';

/** Token mock para desenvolvimento — substituir por Guard JWT/OIDC em produção. */
const TOKEN_MOCK_DEV = 'mock-token-dev';

@ApiTags('Módulo Interno')
@Controller('interno')
export class InternoController {
  private readonly logger = new Logger(InternoController.name);

  constructor(private readonly service: InternoService) {}

  /** Verifica o token mock de acesso interno. Em produção: Guard JWT OIDC corporativo. */
  private verificarToken(token: string | undefined): void {
    if (token !== TOKEN_MOCK_DEV) throw new ForbiddenException('Acesso não autorizado.');
  }

  /**
   * Lista solicitações paginadas com filtros opcionais.
   * Endpoint exclusivo para uso interno — requer x-interno-token.
   */
  @Get('solicitacoes')
  @ApiOperation({ summary: '[Interno] Lista solicitações paginadas' })
  @ApiHeader({ name: 'x-interno-token', required: true, description: 'Token mock de acesso interno' })
  @ApiQuery({ name: 'pagina', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: StatusSolicitacao })
  @ApiQuery({ name: 'agencia', required: false, type: String })
  async listar(
    @Headers('x-interno-token') token: string,
    @Query('pagina') pagina = '1',
    @Query('status') status?: string,
    @Query('agencia') agencia?: string,
  ) {
    this.verificarToken(token);
    return this.service.listar({
      pagina: Math.max(1, Number(pagina)),
      status: status as StatusSolicitacao | undefined,
      agencia,
    });
  }

  /**
   * Retorna os dados completos de uma solicitação, incluindo campos descriptografados.
   * Acesso exclusivo do módulo interno — NUNCA expor em rotas públicas.
   */
  @Get('solicitacoes/:id')
  @ApiOperation({ summary: '[Interno] Detalhe com dados descriptografados' })
  @ApiHeader({ name: 'x-interno-token', required: true })
  async detalhe(
    @Headers('x-interno-token') token: string,
    @Param('id') id: string,
  ) {
    this.verificarToken(token);
    return this.service.buscarComDadosSensiveis(id);
  }

  /**
   * Atualiza o status de uma solicitação.
   * Em produção: restringir ao perfil 'supervisor' via RolesGuard.
   */
  @Patch('solicitacoes/:id/status')
  @ApiOperation({ summary: '[Interno] Atualizar status da solicitação' })
  @ApiHeader({ name: 'x-interno-token', required: true })
  async atualizarStatus(
    @Headers('x-interno-token') token: string,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    this.verificarToken(token);
    const statusValidos = Object.values(StatusSolicitacao);
    if (!statusValidos.includes(status as StatusSolicitacao)) {
      throw new ForbiddenException(`Status inválido. Use: ${statusValidos.join(', ')}`);
    }
    return this.service.atualizarStatus(id, status as StatusSolicitacao);
  }
}
