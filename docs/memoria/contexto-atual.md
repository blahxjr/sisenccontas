# Contexto Atual do Projeto — EncerraDigital BNB

> **LEIA ESTE ARQUIVO PRIMEIRO** ao iniciar qualquer nova sessão de desenvolvimento ou IA.
> Ele representa o estado atual real do projeto.

**Atualizado em**: 2026-04-06  
**Fase atual**: Fase 7 ✅ | Conformidade Normativa BNB 3303-40-64 / 3303-03-11 ✅

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

### Fase 5 — Frontend Interno + Auth Mock ✅ (05/04/2026)
- Docker Compose ativado (postgres, minio, redis) — todos healthy
- Migration `20260405195603_sisenccontas` aplicada + seed ENC-2026-000001 criado
- `InternoModule` no backend: `GET /interno/solicitacoes` (paginado), `GET /interno/solicitacoes/:id` (dados descriptografados), `PATCH /interno/solicitacoes/:id/status`
- Auditoria: log `[AUDITORIA] operador=X acessou id=Y` em todas as operações internas
- `frontend-interno/` em :3001 — Next.js 14, NextAuth v4, TailwindCSS com cores BNB
- Auth mock OIDC: BNB0001 (operador) / BNB0002 (supervisor), sessão JWT 8h
- `SessionProvider` via `providers.tsx` client-side (App Router compatible)
- Middleware de proteção: todas as rotas exceto `/login` e `/api/auth` exigem sessão
- Dashboard: tabela paginada com badges PENDENTE/EM_ANALISE/CONCLUIDO/CANCELADO/REJEITADO
- Tela de detalhe: dados descriptografados (titularNome, numeroConta) + ações por perfil
- E2E validado: POST /publico/solicitacoes ✅ | GET /interno/solicitacoes ✅ | GET /interno/solicitacoes/:id (decrypt) ✅
- `tsc --noEmit` ✅ em backend e frontend-interno (zero erros)

### Conformidade Visual BNB — Paleta Oficial ✅ (05/04/2026)
- Substituição completa do azul (#003087/#0055B8) pela paleta oficial do Manual de Identidade Visual BNB
- **Tokens novos** (Tailwind): `bnb-vermelho` (#A6193C), `bnb-laranja` (#F68B1F), `bnb-amarelo` (#FFCB05), `bnb-salmao` (#FFE6CB), `bnb-cinza` (#646464), `bnb-verde` (#07A684), `bnb-azul-info` (#0996B6)
- `tailwind.config.ts` (cliente) e `tailwind.config.mjs` (interno) atualizados com novos tokens
- Todos os componentes/páginas migrados: `bnb-azul` → `bnb-vermelho`, `bnb-azul-claro` → `bnb-laranja`
- `pdf.service.ts`: cabeçalho do Termo de Encerramento agora usa `rgb(0.651, 0.098, 0.235)` (Vermelho BNB) e `rgb(0.965, 0.545, 0.122)` (Laranja BNB)
- `tsc --noEmit` ✅ nos 3 módulos (zero erros)

### Conformidade Normativa BNB — Termo 3303-40-64 + Fluxo 3303-03-11 ✅ (06/04/2026)
- **Tailwind expandido**: + `bnb-vermelho-escuro` (#7A1228), `bnb-laranja-escuro` (#C96D0A), `bnb-cinza-claro` (#F5F5F5); renomeado `bnb-azul-info` → `bnb-azul` (#0996B6) em ambos os configs
- **PDF Termo oficial 3303-40-64**: `pdf.service.ts` substituído — 14 seções obrigatórias, faixa laranja, recibo do banco, rodapé vermelho, referência normativa `3303-40-64 v.020`
- **Interface `DadosTermoEncerramento`** expandida com campos opcionais: `enderecoCliente`, `emailCliente`, `possuiCheque`, `numeroChequeDevolvido`, `possuiSaldoPositivo`, `bancoTransferencia`, `agenciaTransferencia`, `contaTransferencia`
- **Formulário multi-etapa** em `FormularioEncerramento.tsx`:
  - Etapa 1: Dados da Conta (campos existentes)
  - Etapa 2: Informações Complementares (cheque, saldo positivo, endereço, email)
  - Etapa 3: Confirmar e Assinar (aceite do normativo 3303-03-11 + submit)
  - Tela de sucesso: instrução gov.br/ICP-Brasil, botão "Gerar PDF para Assinatura", `UploadTermoAssinado`
- **`CriarSolicitacaoDto`**: 8 novos campos opcionais com class-validator
- **Prisma**: migration `20260406005330_adicionar_campos_normativos` aplicada — 8 novos campos em `Solicitacao`
- **SolicitacoesService**: `emailCliente` e `contaTransferencia` criptografados com AES-256-CBC em `criar()`
- **InternoService**: novos campos descriptografados em `gerarTermoParaSolicitacao()`
- **DocumentosService**: `gerarTermoPublico(solicitacaoId)` — endpoint público `POST /api/publico/solicitacoes/:id/documentos/gerar-termo`
- **DocumentosModule** importa `CatalogosModule` para resolução do nome da agência
- `tsc --noEmit` ✅ nos 3 módulos (zero erros)

### Fase 7 — Testes Jest + Playwright E2E ✅ (05/04/2026)
- `backend/jest.config.ts`: ts-jest v29, moduleNameMapper `@shared/` e `@modules/`, rootDir `src`
- `seguranca.util.spec.ts`: 10 testes — AES-256-CBC criptografar/descriptografar, hash SHA-256, gerarNumeroProtocolo, mascararIp
- `catalogos.service.spec.ts`: 8 testes — listar motivos/UFs/agencias, filtrar por UF, buscar por código, mock readFileSync
- `documentos.service.spec.ts`: 4 testes — validação magic bytes PDF, tipo MIME inválido, limite 10MB, arquivo válido
- **22 testes Jest passando, 0 falhas** ✅
- `e2e/` adicionado como workspace pnpm dedicado (`pnpm-workspace.yaml`); `@playwright/test` v1.59.1 instalado; Chromium v1217 instalado
- `e2e/playwright.config.ts`: Chromium, workers=1, sequencial, timeout 60s, screenshots on-failure
- `e2e/pages/FormularioPage.ts`: single-page form (UF→Agência→Conta→Titular), wait `state: 'attached'` para opções DOM
- `e2e/pages/DashboardPage.ts`: login mock SSO, filtro por linha para "Ver detalhe", badge 'Gerado'
- `e2e/fluxo-completo.spec.ts`: 6 testes (01 formulário→protocolo, 02 status, 03 login, 04 dashboard, 05 gerar-termo, 06 LGPD)
- **6/6 testes E2E passando** ✅
- Correções de infraestrutura: CSP `connect-src` extraindo apenas a origem da `NEXT_PUBLIC_API_URL`; `caminhoData()` do catalogos.service usando `process.cwd()` em vez de `__dirname` (compatível com `dist/src/`)
- `data-testid="protocolo"` adicionado em `FormularioEncerramento.tsx`
- **Commit fase 7 pushed para origin/main**

### Fase 6 — Upload de Documentos + PDF do Termo ✅ (05/04/2026)
- `frontend-cliente/` scaffolded: Next.js 14.2.5, React 18, TailwindCSS 3, react-hook-form + zod, axios, lucide-react
- `next.config.mjs` (ES module): headers de segurança (CSP, X-Frame-Options: DENY, HSTS, Referrer-Policy, Permissions-Policy)
- `tailwind.config.ts`: cores BNB — bnb-amarelo (#F5A800), bnb-azul (#003087), bnb-azul-claro (#0055B8)
- `src/lib/api-client.ts`: axios com baseURL via env, interceptors para 400/404/429/500
- `src/hooks/useCatalogos.ts`: `useMotivos()`, `useUfs()`, `useAgencias(uf?)` — cascata UF → Agência
- `FormularioEncerramento.tsx`: RHF + Zod, seleção UF→Agência em cascata, tela de sucesso com protocolo
- Rotas: `/` (landing), `/encerramento/formulario`, `/encerramento/status?protocolo=`
- `next build` ✅ | tipos ok | 4 rotas geradas
- **Commit eb21b9d pushed para origin/main** (fases 1-4: 64 arquivos, +12.065 linhas)

### Fase 6 — Upload de Documentos + PDF do Termo ✅ (05/04/2026)
- `prisma/schema.prisma`: enum `TipoDocumento` (TERMO_GERADO, TERMO_ASSINADO) + modelo `Documento`; migration `20260405201024_sisenccontas` aplicada
- `MinioService` (`shared/minio/`): `@Global()`, S3Client com `forcePathStyle: true`, `upload()`, `gerarUrlPresignada()` (5 min TTL), criação automática de bucket no `onModuleInit()`
- `PdfService` (`shared/pdf/`): `@Global()`, `gerarTermoEncerramento()` — PDF A4 com cabeçalho BNB azul (#003087), tabela de dados, texto legal, área de assinatura, marca d'água girada 35°
- `DocumentosModule`: `DocumentosRepository` (sem expor `chaveObjeto`), `DocumentosService` (gerarTermo, receberTermoAssinado com validação magic bytes `%PDF`, listar, gerarUrlDownload), `DocumentosController` (`POST /api/publico/solicitacoes/:id/documentos/upload`)
- `InternoController`: 3 novos endpoints — `GET /interno/solicitacoes/:id/documentos`, `POST /interno/solicitacoes/:id/documentos/gerar-termo`, `GET /interno/documentos/:docId/download`
- `SolicitacoesService.criar()`: agora retorna `solicitacaoId` junto com `protocolo`
- `frontend-cliente`: componente `UploadTermoAssinado.tsx` (drag-drop, progress bar, axios, estados idle/selecionado/enviando/sucesso/erro); `FormularioEncerramento.tsx` atualizado com tela de sucesso + upload integrado
- `frontend-interno`: seção "Documentos" em `[id]/page.tsx` — botão "Gerar Termo", tabela de documentos com tipo badge / nome / tamanho / data / download
- Segurança: validação magic bytes `%PDF`, hash SHA-256 por arquivo, max 10MB, URLs presignadas sem exposição da chave de objeto
- **Nota dev**: `ServerSideEncryption: 'AES256'` removido do upload MinIO local (MinIO open-source não suporta SSE-S3 sem KMS); em produção usar SSE configurado na infraestrutura
- `tsc --noEmit` ✅ em backend, frontend-cliente e frontend-interno (zero erros); `nest build` ✅
- E2E validado: gerar-termo (PDF 2KB no MinIO) ✅ | listar documentos ✅ | URL download presignada ✅
- **Commit 07ebd64 pushed para origin/main** (fase 6: 23 arquivos, +2.352 linhas)

---

## O que está em andamento

- 🔄 Nenhuma tarefa em andamento no momento

---

## O que está bloqueado

- Nenhum bloqueio ativo

---

## Próximos passos imediatos

1. **Fase 8** — Integração gov.br para assinatura digital do Termo de Encerramento
2. **Fase 9** — CI/CD GitHub Actions (lint + test + build + deploy)
3. Testes de carga e security review final

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
