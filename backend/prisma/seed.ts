import { PrismaClient } from '@prisma/client';
import { criptografarCampo, gerarNumeroProtocolo } from '../src/shared/utils/seguranca.util';

const prisma = new PrismaClient();

/**
 * Seed inicial do banco de dados.
 * Cria uma solicitação de exemplo para facilitar o desenvolvimento e testes.
 */
async function main() {
  const chave = process.env.ENCRYPTION_KEY ?? 'chave-local-desenvolvimento-32ch';

  const protocolo = 'ENC-2026-000001';

  // Evita duplicar o seed se já existir
  const existente = await prisma.solicitacao.findUnique({
    where: { numeroProtocolo: protocolo },
  });

  if (existente) {
    console.log(`⚠️  Seed já existe: ${protocolo} — pulando.`);
    return;
  }

  const solicitacao = await prisma.solicitacao.create({
    data: {
      numeroProtocolo: protocolo,
      agencia: '0081',
      numeroConta: criptografarCampo('99999-1', chave),
      titularNome: criptografarCampo('Titular Seed BRF', chave),
      motivoEncerramento: 'mudanca_banco',
      status: 'PENDENTE',
      aceiteTermosVersao: '1.0',
      aceiteTermosTimestamp: new Date('2026-04-05T20:00:00.000Z'),
      ipOrigemMascarado: '127.0.*.*',
    },
  });

  console.log(`✅ Solicitação de seed criada: ${solicitacao.numeroProtocolo}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
