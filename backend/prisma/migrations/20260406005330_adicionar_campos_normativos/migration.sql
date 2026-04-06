-- AlterTable
ALTER TABLE "solicitacoes" ADD COLUMN     "agenciaTransferencia" VARCHAR(10),
ADD COLUMN     "bancoTransferencia" VARCHAR(50),
ADD COLUMN     "contaTransferencia" VARCHAR(512),
ADD COLUMN     "emailCliente" VARCHAR(512),
ADD COLUMN     "enderecoCliente" VARCHAR(200),
ADD COLUMN     "numeroChequeDevolvido" VARCHAR(100),
ADD COLUMN     "possuiCheque" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "possuiSaldoPositivo" BOOLEAN NOT NULL DEFAULT false;
