# ADR-004 — MinIO para armazenamento de arquivos em dev

**Data**: 2026-04-05  
**Status**: Aceita  
**Autores**: Equipe EncerraDigital

## Contexto
Os termos de encerramento assinados (PDFs) precisam ser armazenados de forma segura, fora do servidor web, com suporte a URLs assinadas e compatibilidade com S3 em produção.

## Decisão
Usar **MinIO** em ambiente de desenvolvimento (via Docker Compose) como storage de objetos S3-compatível. Em produção, o mesmo código funciona com AWS S3, Azure Blob ou outro serviço S3-compatível sem alteração.

## Consequências
- ✅ API S3-compatível — zero alteração de código para produção
- ✅ Roda localmente via Docker, sem dependência de cloud em dev
- ✅ Suporte a buckets privados e presigned URLs para download seguro
- ⚠️ Requer configuração de política de bucket (arquivos nunca públicos)

## Alternativas descartadas
- **Armazenar no banco (BYTEA)**: descartado por impacto em performance e tamanho do banco
- **Pasta do servidor**: descartado por ser inseguro (risco de path traversal e acesso direto via web)
