import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SolicitacoesModule } from '@modules/solicitacoes/solicitacoes.module';
import { CatalogosModule } from '@modules/catalogos/catalogos.module';
import { SaudeModule } from '@modules/saude/saude.module';
import { PrismaModule } from '@shared/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,
    SolicitacoesModule,
    CatalogosModule,
    SaudeModule,
  ],
})
export class AppModule {}
