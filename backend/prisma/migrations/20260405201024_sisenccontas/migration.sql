-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('TERMO_GERADO', 'TERMO_ASSINADO');

-- CreateTable
CREATE TABLE "documentos" (
    "id" TEXT NOT NULL,
    "solicitacaoId" TEXT NOT NULL,
    "tipo" "TipoDocumento" NOT NULL,
    "nomeOriginal" VARCHAR(255) NOT NULL,
    "bucketMinio" VARCHAR(100) NOT NULL,
    "chaveObjeto" VARCHAR(512) NOT NULL,
    "hashSha256" VARCHAR(64) NOT NULL,
    "tamanhoBytes" INTEGER NOT NULL,
    "mimeType" VARCHAR(100) NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "documentos_solicitacaoId_idx" ON "documentos"("solicitacaoId");

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_solicitacaoId_fkey" FOREIGN KEY ("solicitacaoId") REFERENCES "solicitacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
