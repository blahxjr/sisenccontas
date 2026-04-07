#!/bin/sh
# Script de inicialização do backend em produção (Railway / Docker)
# Executa migrações Prisma antes de subir o servidor NestJS
set -e

# Move para o diretório do backend independente de onde o script é chamado
cd "$(dirname "$0")"

echo "▶ [1/2] Executando migrações Prisma..."
npx prisma migrate deploy

echo "✅ [2/2] Migrações concluídas. Iniciando servidor NestJS..."
exec node dist/main
