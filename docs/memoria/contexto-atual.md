# Contexto Atual do Projeto — EncerraDigital BNB

> **LEIA ESTE ARQUIVO PRIMEIRO** ao iniciar qualquer nova sessão de desenvolvimento ou IA.
> Ele representa o estado atual real do projeto.

**Atualizado em**: 2026-04-05  
**Fase atual**: Fase 4 — Frontend Cliente completo ✅

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

### Fase 3 — Backend Solicitações ✅ (05/04/2026)
- `CriarSolicitacaoDto` com class-validator: `@Matches`, `@IsDateString`, `@Equals(true)` para aceite de termos
- `SolicitacoesRepository` com Prisma: `criar()` com `selectPublico` (sem campos sensíveis na resposta), `buscarStatusPorProtocolo()` com `selectStatus`
- `SolicitacoesService`: criptografia AES-256-CBC em repouso em `numeroConta` e `titularNome`; geração de protocolo único; `NotFoundException` para protocolo inexistente
- `SolicitacoesController`: `POST /api/publico/solicitacoes` + `GET /api/publico/solicitacoes/:protocolo/status`; IP mascarado nos logs
- `tsc --noEmit` ✅ (zero erros) | Boot confirmado com Prisma gracioso sem DB

### Fase 4 — Frontend Cliente Next.js 14 ✅ (05/04/2026)
- `frontend-cliente/` scaffolded: Next.js 14.2.5, React 18, TailwindCSS 3, react-hook-form + zod, axios, lucide-react
- `next.config.mjs` (ES module): headers de segurança (CSP, X-Frame-Options: DENY, HSTS, Referrer-Policy, Permissions-Policy)
- `tailwind.config.ts`: cores BNB — bnb-amarelo (#F5A800), bnb-azul (#003087), bnb-azul-claro (#0055B8)
- `src/lib/api-client.ts`: axios com baseURL via env, interceptors para 400/404/429/500
- `src/hooks/useCatalogos.ts`: `useMotivos()`, `useUfs()`, `useAgencias(uf?)` — cascata UF → Agência
- `FormularioEncerramento.tsx`: RHF + Zod, seleção UF→Agência em cascata, tela de sucesso com protocolo
- Rotas: `/` (landing), `/encerramento/formulario`, `/encerramento/status?protocolo=`
- `next build` ✅ | tipos ok | 4 rotas geradas
- **Commit eb21b9d pushed para origin/main** (fases 1-4: 64 arquivos, +12.065 linhas)

---

## O que está em andamento

- 🔄 Nenhuma tarefa em andamento no momento

---

## O que está bloqueado

- ⏸️ **Fase 3 persistência**: `POST /api/publico/solicitacoes` retorna 500 sem PostgreSQL — use `docker compose -f infra/docker-compose.dev.yml up -d db` para ativar, depois `prisma migrate dev`

---

## Próximos passos imediatos

1. **Infraestrutura**: `docker compose up` para PostgreSQL + MinIO + Redis locais
2. `prisma migrate dev --name init` para criar as tabelas
3. **Fase 5** — `frontend-interno`: scaffold Next.js, autenticação mockada (SSO), listagem de solicitações para operadores
4. Testar fluxo E2E completo: formulário → backend → banco → consulta de status

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

**Repositório**: https://github.com/blahxjr/sisenccontas  
**Protótipo HTML original**: `Codigo-incial.html` (arquivo de referência)
