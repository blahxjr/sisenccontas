import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DocumentosController } from './documentos.controller';
import { DocumentosService } from './documentos.service';
import { DocumentosRepository } from './documentos.repository';
import { SolicitacoesModule } from '@modules/solicitacoes/solicitacoes.module';
import { CatalogosModule } from '@modules/catalogos/catalogos.module';

@Module({
  imports: [
    SolicitacoesModule,
    CatalogosModule,
    // Multer em memória — arquivo processado e enviado ao MinIO, não toca o disco
    MulterModule.register({ storage: undefined, limits: { fileSize: 10 * 1024 * 1024 } }),
  ],
  controllers: [DocumentosController],
  providers: [DocumentosService, DocumentosRepository],
  exports: [DocumentosService],
})
export class DocumentosModule {}
