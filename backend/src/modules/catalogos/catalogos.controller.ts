import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CatalogosService } from './catalogos.service';

/**
 * Controller de catálogos — expõe dados de referência ao frontend cliente.
 * Dados de agências obtidos oficialmente via API do Banco Central (ODbL).
 * Rota pública — sem dados sensíveis.
 */
@ApiTags('Catálogos')
@Controller('publico/catalogos')
export class CatalogosController {
  constructor(private readonly catalogosService: CatalogosService) {}

  @Get('motivos')
  @ApiOperation({ summary: 'Lista os motivos de encerramento disponíveis' })
  listarMotivos() {
    return { dados: this.catalogosService.listarMotivos() };
  }

  @Get('agencias')
  @ApiOperation({ summary: 'Lista as agências BRF com filtros opcionais' })
  @ApiQuery({ name: 'uf', required: false, description: 'Filtrar por UF (ex: CE, BA, PE)' })
  @ApiQuery({ name: 'busca', required: false, description: 'Buscar por nome ou município' })
  listarAgencias(
    @Query('uf') uf?: string,
    @Query('busca') busca?: string,
  ) {
    return {
      dados: this.catalogosService.listarAgencias({ uf, busca }),
      fonte: 'Banco Central do Brasil — API Informes_Agencias (ODbL)',
    };
  }

  @Get('agencias/ufs')
  @ApiOperation({ summary: 'Lista os estados com agências BRF disponíveis' })
  listarUfs() {
    return { dados: this.catalogosService.listarUfs() };
  }
}
