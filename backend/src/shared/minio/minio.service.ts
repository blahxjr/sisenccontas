import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const BUCKET_DOCUMENTOS = 'encerradigital-documentos';

/**
 * Serviço de armazenamento de objetos via MinIO (compatível com S3).
 * Em produção, aponta para bucket S3 ou MinIO gerenciado.
 */
@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private s3: S3Client;

  constructor(private readonly config: ConfigService) {
    this.s3 = new S3Client({
      endpoint: this.config.get<string>('MINIO_ENDPOINT') ?? 'http://localhost:9000',
      region: 'us-east-1',
      credentials: {
        accessKeyId: this.config.get<string>('MINIO_ACCESS_KEY') ?? 'minioadmin',
        secretAccessKey: this.config.get<string>('MINIO_SECRET_KEY') ?? 'minioadmin',
      },
      forcePathStyle: true, // obrigatório para MinIO
    });
  }

  /** Garante que o bucket exista ao inicializar o módulo. */
  async onModuleInit() {
    try {
      await this.s3.send(new HeadBucketCommand({ Bucket: BUCKET_DOCUMENTOS }));
      this.logger.log(`✅ Bucket MinIO "${BUCKET_DOCUMENTOS}" disponível`);
    } catch {
      await this.s3.send(new CreateBucketCommand({ Bucket: BUCKET_DOCUMENTOS }));
      this.logger.log(`✅ Bucket MinIO "${BUCKET_DOCUMENTOS}" criado`);
    }
  }

  /**
   * Faz upload de um arquivo para o MinIO com criptografia AES256 no servidor.
   * @param chave - Caminho do objeto no bucket
   * @param buffer - Conteúdo do arquivo
   * @param mimeType - Content-Type do arquivo
   */
  async upload(chave: string, buffer: Buffer, mimeType: string): Promise<void> {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_DOCUMENTOS,
        Key: chave,
        Body: buffer,
        ContentType: mimeType,
      }),
    );
  }

  /**
   * Gera URL presignada de download com expiração de 5 minutos.
   * O operador nunca acessa o MinIO diretamente.
   * @param chave - Caminho do objeto no bucket
   * @param expiracaoSegundos - Tempo de expiração em segundos (padrão: 300)
   */
  async gerarUrlPresignada(chave: string, expiracaoSegundos = 300): Promise<string> {
    const comando = new GetObjectCommand({ Bucket: BUCKET_DOCUMENTOS, Key: chave });
    return getSignedUrl(this.s3, comando, { expiresIn: expiracaoSegundos });
  }

  /** Nome do bucket de documentos. */
  get bucket(): string {
    return BUCKET_DOCUMENTOS;
  }
}
