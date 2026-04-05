import { Module } from '@nestjs/common';
import { SolicitacoesController } from './solicitacoes.controller';
import { SolicitacoesService } from './solicitacoes.service';
import { SolicitacoesRepository } from './solicitacoes.repository';

@Module({
  controllers: [SolicitacoesController],
  providers: [SolicitacoesService, SolicitacoesRepository],
  exports: [SolicitacoesRepository],
})
export class SolicitacoesModule {}
