import {
  Controller,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import { DocumentosService } from './documentos.service';

/**
 * Controller de documentos para o módulo público.
 * Permite que o cliente faça upload do termo assinado.
 * Validações de segurança são aplicadas em múltiplas camadas.
 */
@ApiTags('Documentos — Público')
@Controller('publico/solicitacoes/:solicitacaoId/documentos')
export class DocumentosController {
  constructor(private readonly service: DocumentosService) {}

  /**
   * Recebe o upload do termo de encerramento assinado pelo cliente.
   * Apenas PDF são aceitos, com tamanho máximo de 10 MB.
   * Validação adicional de magic bytes (%PDF) é feita no service.
   */
  @Post('upload')
  @ApiOperation({ summary: 'Upload do termo assinado pelo cliente (apenas PDF, max 10 MB)' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'solicitacaoId', description: 'ID (UUID) da solicitação' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { arquivo: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('arquivo'))
  async uploadTermoAssinado(
    @Param('solicitacaoId') solicitacaoId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      }),
    )
    arquivo: Express.Multer.File,
  ) {
    const resultado = await this.service.receberTermoAssinado(
      solicitacaoId,
      arquivo.buffer,
      arquivo.originalname,
      arquivo.mimetype,
    );
    return { mensagem: 'Documento recebido com sucesso.', documentoId: resultado.id };
  }

  /**
   * Gera o Termo de Encerramento em PDF para a solicitação indicada.
   * Rota pública — acessível pelo cliente após submissão do formulário.
   */
  @Post('gerar-termo')
  @ApiOperation({ summary: 'Gera o Termo de Encerramento em PDF para assinatura pelo cliente' })
  @ApiParam({ name: 'solicitacaoId', description: 'ID (UUID) da solicitação' })
  async gerarTermo(@Param('solicitacaoId') solicitacaoId: string) {
    return this.service.gerarTermoPublico(solicitacaoId);
  }
}
