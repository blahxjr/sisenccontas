import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Serviço de armazenamento de objetos via MinIO/S3-compatível.
 * Em produção, aponta para Cloudflare R2 (via MINIO_ENDPOINT, MINIO_BUCKET, MINIO_REGION).
 */
@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private s3: S3Client;
  private readonly bucketName: string;

  constructor(private readonly config: ConfigService) {
    this.bucketName =
      this.config.get<string>("MINIO_BUCKET") ?? "encerradigital-documentos";
    this.s3 = new S3Client({
      endpoint:
        this.config.get<string>("MINIO_ENDPOINT") ?? "http://localhost:9000",
      region: this.config.get<string>("MINIO_REGION") ?? "us-east-1",
      credentials: {
        accessKeyId:
          this.config.get<string>("MINIO_ACCESS_KEY") ?? "minioadmin",
        secretAccessKey:
          this.config.get<string>("MINIO_SECRET_KEY") ?? "minioadmin",
      },
      forcePathStyle: true, // obrigatório para MinIO e Cloudflare R2
    });
  }

  /** Garante que o bucket exista ao inicializar o módulo. */
  async onModuleInit() {
    try {
      await this.s3.send(new HeadBucketCommand({ Bucket: this.bucketName }));
      this.logger.log(`✅ Bucket "${this.bucketName}" disponível`);
    } catch {
      await this.s3.send(new CreateBucketCommand({ Bucket: this.bucketName }));
      this.logger.log(`✅ Bucket "${this.bucketName}" criado`);
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
        Bucket: this.bucketName,
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
  async gerarUrlPresignada(
    chave: string,
    expiracaoSegundos = 300,
  ): Promise<string> {
    const comando = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: chave,
    });
    return getSignedUrl(this.s3, comando, { expiresIn: expiracaoSegundos });
  }

  /** Nome do bucket de documentos. */
  get bucket(): string {
    return this.bucketName;
  }
}
