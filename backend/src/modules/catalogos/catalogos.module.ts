import { Module } from '@nestjs/common';
import { CatalogosController } from './catalogos.controller';
import { CatalogosService } from './catalogos.service';

/**
 * Módulo de catálogos — registra serviço e controller de dados de referência.
 * Deve ser importado no AppModule.
 */
@Module({
  controllers: [CatalogosController],
  providers: [CatalogosService],
  exports: [CatalogosService],
})
export class CatalogosModule {}
