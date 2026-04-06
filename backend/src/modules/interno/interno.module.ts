import { Module } from '@nestjs/common';
import { InternoController } from './interno.controller';
import { InternoService } from './interno.service';
import { SolicitacoesModule } from '@modules/solicitacoes/solicitacoes.module';
import { DocumentosModule } from '@modules/documentos/documentos.module';
import { CatalogosModule } from '@modules/catalogos/catalogos.module';

@Module({
  imports: [SolicitacoesModule, DocumentosModule, CatalogosModule],
  controllers: [InternoController],
  providers: [InternoService],
})
export class InternoModule {}
