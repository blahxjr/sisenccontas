# Contexto Atual do Projeto — EncerraDigital BNB

> **LEIA ESTE ARQUIVO PRIMEIRO** ao iniciar qualquer nova sessão de desenvolvimento ou IA.
> Ele representa o estado atual real do projeto.

**Atualizado em**: 2026-04-05  
**Fase atual**: Fase 2 — Scaffold Backend NestJS ✅

---

## O que foi feito até agora

- ✅ Análise do protótipo HTML original (formulário + chatbot de encerramento de conta BNB)
- ✅ Definição da arquitetura alvo (monorepo, frontend-cliente, frontend-interno, backend BFF)
- ✅ Criação de toda a documentação base do projeto (`docs/`)
- ✅ Configuração das instruções do GitHub Copilot (`.github/copilot-instructions.md`)
- ✅ Criação dos 5 agentes de IA especializados (`.github/agents/`)
- ✅ Dev Container configurado (Node 20, PostgreSQL 16, Redis, MinIO)
- ✅ Docker Compose de desenvolvimento criado

### Fase 1 — Catálogos BNB ✅ (05/04/2026)
- `data/agencias.csv` com 300 agências reais BNB (fonte: BCB/ODbL)
- `data/motivos_encerramento.csv` com 7 motivos de encerramento
- `backend/src/modules/catalogos/catalogos.service.ts` — lerCsv<T>, listarAgencias, listarUfs, buscarAgenciaPorCodigo
- `backend/src/modules/catalogos/catalogos.controller.ts` — endpoints /agencias, /agencias?uf=, /agencias?busca=, /agencias/ufs
- `backend/src/modules/catalogos/catalogos.module.ts` — módulo NestJS criado

### Fase 2 — Scaffold Backend NestJS ✅ (05/04/2026)
- `package.json`, `tsconfig.json`, `nest-cli.json` criados
- `main.ts` + `app.module.ts` configurados com Helmet, CORS, ValidationPipe, Swagger
- `PrismaModule` global criado (`shared/prisma/`) — falha graciosamente sem banco disponível
- `seguranca.util.ts` criado (AES-256, mascaramento IP, protocolo, hash SHA-256)
- `SaudeModule` funcionando em `/api/saude`
- `SolicitacoesModule` criado (estrutura base — service/repository vazios para Fase 3)
- `backend/prisma/schema.prisma` criado com modelo `Solicitacao` e enum `StatusSolicitacao`
- `pnpm install` ✅ | `tsc --noEmit` ✅ (zero erros)
- Boot confirmado: **Motivos: 7 | Agências BNB: 300** ✅
- Endpoints validados: `/api/saude` ✅ | `/agencias/ufs` (13 UFs) ✅ | `?uf=MA` (29) ✅ | `?busca=fortaleza` (7) ✅
- Correções aplicadas: `strictNullChecks` em `listarAgencias`, path de CSV via `__dirname`

---

## O que está em andamento

- 🔄 Nenhuma tarefa em andamento no momento

---

## O que está bloqueado

- ⏸️ Nenhum bloqueio no momento

---

## Próximos passos imediatos

1. **Fase 3** — DTOs de entrada validados com class-validator para criação de solicitação
2. **Fase 3** — Service e Repository completos de Solicitações (`TEC-008`)
3. **Fase 3** — `prisma migrate dev` com banco PostgreSQL disponível (Docker Compose) (`TEC-006`, `TEC-007`)
4. Criar o projeto `frontend-cliente` Next.js 14 + TypeScript + TailwindCSS (`TEC-003`)
5. Migrar o chatbot do HTML para componente React (`TEC-012`)

---

## Decisões importantes já tomadas

- **Stack**: Next.js 14 + NestJS + PostgreSQL + Prisma + MinIO + Redis
- **Padrão de API**: REST (GraphQL pode ser adicionado depois se necessário — vide ADR-003 quando criado)
- **Segurança**: OWASP ASVS nível 2 como alvo mínimo
- **Armazenamento de arquivos**: MinIO em dev, S3-compatível em produção
- **Autenticação módulo cliente**: Nenhuma (público) — dados coletados com base legal regulatória
- **Autenticação módulo interno**: OIDC/SAML corporativo (mock em dev)

---

## Contexto de negócio resumido

O sistema digitaliza o processo de encerramento de conta corrente do BNB, 
que hoje exige presença física na agência. O cliente preenche um formulário 
ou usa um chatbot guiado, gera o Termo de Encerramento, assina via gov.br 
e faz upload. O módulo interno permite que operadores do banco processem 
as solicitações sem necessidade de papel ou atendimento presencial.

**Repositório de referência**: A ser definido (criar no GitHub)  
**Protótipo HTML original**: `Codigo-incial.html` (arquivo de referência)
