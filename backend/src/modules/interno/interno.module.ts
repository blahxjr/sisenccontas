import { Module } from '@nestjs/common';
import { InternoController } from './interno.controller';
import { InternoService } from './interno.service';
import { SolicitacoesModule } from '@modules/solicitacoes/solicitacoes.module';

@Module({
  imports: [SolicitacoesModule],
  controllers: [InternoController],
  providers: [InternoService],
})
export class InternoModule {}
