# ADR-003 — PostgreSQL como banco de dados principal

**Data**: 2026-04-05  
**Status**: Aceita  
**Autores**: Equipe EncerraDigital

## Contexto
Precisamos de um banco de dados relacional robusto, com suporte a criptografia, transações ACID e boa integração com o ecossistema Node.js/TypeScript.

## Decisão
Usar **PostgreSQL 16+** como banco de dados principal, com **Prisma ORM** para migrações e acesso a dados.

## Consequências
- ✅ PostgreSQL é amplamente adotado no setor financeiro
- ✅ Suporte nativo a UUID, JSON, enums e criptografia via pgcrypto
- ✅ Prisma oferece tipagem forte e migrações versionadas
- ✅ Excelente suporte a transações para operações críticas (ex.: criar solicitação + registrar log)

## Alternativas descartadas
- **MySQL/MariaDB**: menos recursos nativos de segurança e tipagem
- **MongoDB**: descartado por não ser relacional — dados de solicitações têm estrutura bem definida
- **TypeORM**: descartado em favor do Prisma (DX melhor, tipagem mais forte)
