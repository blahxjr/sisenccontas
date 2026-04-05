-- CreateEnum
CREATE TYPE "StatusSolicitacao" AS ENUM ('PENDENTE', 'EM_ANALISE', 'CONCLUIDO', 'CANCELADO', 'REJEITADO');

-- CreateTable
CREATE TABLE "solicitacoes" (
    "id" TEXT NOT NULL,
    "numeroProtocolo" TEXT NOT NULL,
    "agencia" VARCHAR(10) NOT NULL,
    "numeroConta" VARCHAR(512) NOT NULL,
    "titularNome" VARCHAR(512) NOT NULL,
    "motivoEncerramento" VARCHAR(100),
    "status" "StatusSolicitacao" NOT NULL DEFAULT 'PENDENTE',
    "aceiteTermosVersao" VARCHAR(20) NOT NULL,
    "aceiteTermosTimestamp" TIMESTAMP(3) NOT NULL,
    "ipOrigemMascarado" VARCHAR(20),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "solicitacoes_numeroProtocolo_key" ON "solicitacoes"("numeroProtocolo");

-- CreateIndex
CREATE INDEX "solicitacoes_status_idx" ON "solicitacoes"("status");

-- CreateIndex
CREATE INDEX "solicitacoes_agencia_idx" ON "solicitacoes"("agencia");
