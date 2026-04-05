import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

/**
 * Controller de healthcheck — verifica se a API está disponível.
 */
@ApiTags('Saúde')
@Controller('saude')
export class SaudeController {
  @Get()
  @ApiOperation({ summary: 'Verifica se a API está saudável' })
  verificar() {
    return {
      status: 'ok',
      servico: 'EncerraDigital API',
      timestamp: new Date().toISOString(),
      ambiente: process.env.NODE_ENV ?? 'development',
    };
  }
}
