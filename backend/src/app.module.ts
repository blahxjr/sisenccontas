import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SolicitacoesModule } from '@modules/solicitacoes/solicitacoes.module';
import { CatalogosModule } from '@modules/catalogos/catalogos.module';
import { SaudeModule } from '@modules/saude/saude.module';
import { InternoModule } from '@modules/interno/interno.module';
import { DocumentosModule } from '@modules/documentos/documentos.module';
import { PrismaModule } from '@shared/prisma/prisma.module';
import { MinioModule } from '@shared/minio/minio.module';
import { PdfModule } from '@shared/pdf/pdf.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,
    MinioModule,
    PdfModule,
    SolicitacoesModule,
    CatalogosModule,
    SaudeModule,
    InternoModule,
    DocumentosModule,
  ],
})
export class AppModule {}
