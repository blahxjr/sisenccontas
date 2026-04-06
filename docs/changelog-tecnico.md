# Changelog Técnico — EncerraDigital BRF

**Formato**: `[DATA] Tipo — Descrição`

---

## 2026-04-06

- `[FIX]` — `pdf.service.ts` reescrito: paginação real com nova página quando `y < 75`, quebra de linha por `font.widthOfTextAtSize()` (largura real de pixel), espaçamentos corrigidos por tamanho de fonte — elimina sobreposição de texto no Termo de Encerramento.
- `[FIX]` — Rodapé vermelho BRF renderizado em todas as páginas do PDF (não apenas na última).
- `[COMMIT]` — `14e1bdf fix(backend): corrigir sobreposicao de texto no PDF do Termo de Encerramento`

## 2026-04-05

### Conformidade Normativa — Termo BRF-3303-40-64 + Fluxo BRF-3303-03-11
- `[FEAT]` — `pdf.service.ts` substituído: 14 seções obrigatórias do modelo oficial BRF-3303-40-64, faixa laranja, seção de Recibo do Banco, rodapé com referência `BRF-3303-40-64 v.020`.
- `[FEAT]` — Interface `DadosTermoEncerramento` expandida: `enderecoCliente`, `emailCliente`, `possuiCheque`, `numeroChequeDevolvido`, `possuiSaldoPositivo`, `bancoTransferencia`, `agenciaTransferencia`, `contaTransferencia`.
- `[FEAT]` — Formulário multi-etapa 3 etapas + tela de sucesso: Etapa 1 (Agência em cascata por UF), Etapa 2 (Dados da Conta), Etapa 3 (Complementar com cheque, saldo, endereço, email).
- `[FEAT]` — `CriarSolicitacaoDto`: 8 novos campos opcionais com class-validator.
- `[DB]` — Prisma migration `20260406005330_adicionar_campos_normativos` aplicada — 8 novos campos em `Solicitacao`.
- `[SECURITY]` — `emailCliente` e `contaTransferencia` criptografados com AES-256-CBC em `SolicitacoesService.criar()`.
- `[FEAT]` — `InternoService`: novos campos descriptografados em `gerarTermoParaSolicitacao()`.
- `[FEAT]` — Endpoint público `POST /api/publico/solicitacoes/:id/documentos/gerar-termo` adicionado ao `DocumentosModule`.
- `[COMMIT]` — `c6af89a feat: conformidade normativa BRF — paleta oficial, termo BRF-3303-40-64, fluxo BRF-3303-03-11`

### Demo Visual — Página /demo
- `[FEAT]` — `frontend-cliente/src/app/demo/page.tsx`: página standalone para apresentação a stakeholders, sem header/footer do layout principal.
- `[FEAT]` — Route Group `(main)` criado para isolar o layout do frontend-cliente (header vermelho BRF + footer com link `/demo`).
- `[FEAT]` — Conteúdo da `/demo`: hero vermelho/laranja BRF, badges de conformidade, preview interativo do formulário (4 etapas), preview do dashboard do operador, tabela de arquitetura (7 camadas), diagrama de fluxo, grid de segurança (10 controles OWASP/LGPD), roadmap visual (8 fases).
- `[COMMIT]` — `7251565 feat(frontend-cliente): pagina de demonstracao visual do sistema (/demo)`

### Conformidade Visual BRF — Paleta Oficial
- `[STYLE]` — Azul (#003087/#0055B8) substituído pela paleta oficial do Paleta Banco Regional de Fomento em todos os módulos.
- `[STYLE]` — Tokens Tailwind novos: `brf-vermelho` (#A6193C), `brf-vermelho-escuro` (#7A1228), `brf-laranja` (#F68B1F), `brf-laranja-escuro` (#C96D0A), `brf-amarelo` (#FFCB05), `brf-salmao` (#FFE6CB), `brf-cinza` (#646464), `brf-cinza-claro` (#F5F5F5), `brf-verde` (#07A684), `brf-azul` (#0996B6).
- `[STYLE]` — `tailwind.config.ts` (cliente) e `tailwind.config.mjs` (interno) atualizados.
- `[STYLE]` — `pdf.service.ts`: cabeçalho usa `rgb(0.651, 0.098, 0.235)` (Vermelho BRF) e `rgb(0.965, 0.545, 0.122)` (Laranja BRF).
- `[COMMIT]` — `c207061 style: paleta de cores oficial BRF — vermelho/laranja substituem azul`

### Fase 7 — Testes Jest + Playwright E2E
- `[TEST]` — `backend/jest.config.ts`: ts-jest v29, moduleNameMapper para `@shared/` e `@modules/`.
- `[TEST]` — `seguranca.util.spec.ts`: 10 testes (AES-256-CBC, SHA-256, protocolo, mascaramento IP).
- `[TEST]` — `catalogos.service.spec.ts`: 8 testes (catálogos, filtros, mock readFileSync).
- `[TEST]` — `documentos.service.spec.ts`: 4 testes (magic bytes PDF, MIME inválido, limite 10MB, arquivo válido).
- `[TEST]` — **22 testes Jest passando, 0 falhas** ✅
- `[TEST]` — `e2e/` adicionado como workspace pnpm dedicado; Playwright v1.59.1 + Chromium v1217.
- `[TEST]` — `e2e/playwright.config.ts`: Chromium, workers=1, sequencial, timeout 60s.
- `[TEST]` — `e2e/pages/FormularioPage.ts` e `DashboardPage.ts` criados.
- `[TEST]` — `e2e/fluxo-completo.spec.ts`: 6 testes (formulário, status, login, dashboard, gerar-termo, LGPD).
- `[TEST]` — **6/6 testes E2E passando** ✅
- `[FIX]` — CSP `connect-src` extraindo apenas a origem da `NEXT_PUBLIC_API_URL`.
- `[FIX]` — `caminhoData()` do `catalogos.service` usando `process.cwd()` (compatível com `dist/src/`).
- `[FEAT]` — `data-testid="protocolo"` adicionado em `FormularioEncerramento.tsx`.
- `[COMMIT]` — `a782594 test: fase 7 — corrigir testes E2E Playwright (6/6 passando)`

### Fase 6 — Upload de Documentos + PDF do Termo
- `[DB]` — `prisma/schema.prisma`: enum `TipoDocumento` + modelo `Documento`; migration `20260405201024_sisenccontas` aplicada.
- `[FEAT]` — `MinioService` (`shared/minio/`): `@Global()`, S3Client com `forcePathStyle: true`, `upload()`, `gerarUrlPresignada()` (5 min TTL), criação automática de bucket no `onModuleInit()`.
- `[FEAT]` — `PdfService` (`shared/pdf/`): `gerarTermoEncerramento()` — PDF A4 com cabeçalho BRF, tabela de dados, texto legal, área de assinatura.
- `[FEAT]` — `DocumentosModule`: `DocumentosRepository`, `DocumentosService` (gerarTermo, receberTermoAssinado, listar, gerarUrlDownload), `DocumentosController` (`POST /api/publico/solicitacoes/:id/documentos/upload`).
- `[FEAT]` — `InternoController`: 3 endpoints — `GET /interno/solicitacoes/:id/documentos`, `POST /interno/solicitacoes/:id/documentos/gerar-termo`, `GET /interno/documentos/:docId/download`.
- `[FEAT]` — `frontend-cliente`: componente `UploadTermoAssinado.tsx` (drag-drop, progress bar, axios).
- `[FEAT]` — `frontend-interno`: seção "Documentos" em `[id]/page.tsx` com botão "Gerar Termo" e tabela de documentos.
- `[SECURITY]` — Validação magic bytes `%PDF`, hash SHA-256, max 10MB, URLs presignadas sem exposição da chave de objeto.
- `[COMMIT]` — `07ebd64 feat: fase 6 — upload de documentos, geracao de PDF e integracao MinIO`

### Fase 5 — Frontend Interno + Auth Mock
- `[INFRA]` — Docker Compose ativado (postgres, minio, redis) — todos healthy.
- `[DB]` — Migration `20260405195603_sisenccontas` aplicada + seed ENC-2026-000001 criado.
- `[FEAT]` — `InternoModule`: `GET /interno/solicitacoes` (paginado), `GET /interno/solicitacoes/:id` (descriptografado), `PATCH /interno/solicitacoes/:id/status`.
- `[SECURITY]` — Auditoria: log `[AUDITORIA] operador=X acessou id=Y` em todas as operações internas.
- `[FEAT]` — `frontend-interno/` em :3001 — Next.js 14, NextAuth v4, TailwindCSS com cores BRF.
- `[FEAT]` — Auth mock OIDC: BRF0001 (operador) / BRF0002 (supervisor), sessão JWT 8h.
- `[FEAT]` — `SessionProvider` via `providers.tsx` client-side (App Router compatible).
- `[SECURITY]` — Middleware de proteção: todas as rotas exceto `/login` e `/api/auth` exigem sessão.
- `[FEAT]` — Dashboard: tabela paginada com badges PENDENTE/EM_ANALISE/CONCLUIDO/CANCELADO/REJEITADO.
- `[FEAT]` — Tela de detalhe: dados descriptografados (titularNome, numeroConta) + ações por perfil.
- `[COMMIT]` — `fece5aa feat: fase 5 -- frontend interno, auth mock e modulo backend interno`

### Fases 1–4 — Catálogos, Scaffold Backend, Solicitações e Frontend Cliente
- `[FEAT]` — `data/agencias.csv` com 300 agências BRF reais (fonte BCB/ODbL).
- `[FEAT]` — `data/motivos_encerramento.csv` com 7 motivos de encerramento.
- `[FEAT]` — `CatalogosModule`: endpoints `/agencias`, `/agencias?uf=`, `/agencias?busca=`, `/agencias/ufs`.
- `[FEAT]` — `main.ts` + `app.module.ts`: Helmet, CORS, ValidationPipe, Swagger em `/api/docs`.
- `[FEAT]` — `PrismaModule` global com falha graciosa sem banco disponível.
- `[SECURITY]` — `seguranca.util.ts`: AES-256-CBC, mascaramento IP, protocolo, hash SHA-256.
- `[FEAT]` — `SaudeModule`: `GET /api/saude`.
- `[FEAT]` — `SolicitacoesModule`: `POST /api/publico/solicitacoes` + `GET /:protocolo/status`.
- `[SECURITY]` — Criptografia AES-256-CBC em repouso: `numeroConta`, `titularNome`, `emailCliente`, `contaTransferencia`.
- `[SECURITY]` — IP mascarado nos logs (último octeto substituído por `0`).
- `[FEAT]` — `frontend-cliente/` em :3000 — Next.js 14, TailwindCSS, react-hook-form + zod, axios.
- `[FEAT]` — Rotas: `/` (home), `/encerramento/formulario`, `/encerramento/status`.
- `[FEAT]` — `useCatalogos.ts`: hooks `useMotivos()`, `useUfs()`, `useAgencias(uf?)` — cascata UF → Agência.
- `[COMMIT]` — `eb21b9d feat: fases 1-4 — catalogo agencias, scaffold backend, solicitacoes e frontend cliente`

## 2026-04-05 (inicial)
- `[INICIO]` — Criação da estrutura inicial de documentação e ambiente de desenvolvimento.
- `[DOCS]` — Arquivos criados: `arquitetura.md`, `seguranca-lgpd.md`, `convencoes.md`, `backlog-produto.md`, `backlog-tecnico.md`.
- `[DOCS]` — Agentes de IA criados em `.github/agents/`: arquiteto, dev-backend, dev-frontend, seguranca, testes, documentador.
- `[DOCS]` — Instruções globais do Copilot criadas em `.github/copilot-instructions.md`.
- `[INFRA]` — Dev Container configurado com Node 20, PostgreSQL, Redis, MinIO.
- `[INFRA]` — Docker Compose de desenvolvimento criado.
- `[COMMIT]` — `5ac2faa Initial commit`
