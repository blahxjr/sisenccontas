# Backlog Técnico — EncerraDigital BRF

**Última atualização**: 2026-04-06

---

## Fase 0 — Estrutura e Ambiente

- [x] **TEC-001** — Criar estrutura de monorepo com PNPM Workspaces
- [x] **TEC-002** — Configurar Dev Container (Node 20, PostgreSQL, Redis, MinIO)
- [x] **TEC-003** — Criar projeto Next.js `frontend-cliente` com TypeScript + TailwindCSS
- [x] **TEC-004** — Criar projeto Next.js `frontend-interno` com TypeScript + TailwindCSS
- [x] **TEC-005** — Criar projeto NestJS `backend` com TypeScript
- [x] **TEC-006** — Configurar Prisma + PostgreSQL no backend
- [x] **TEC-007** — Criar primeiro modelo de dados (tabela `solicitacoes`)
- [ ] **TEC-008** — Configurar ESLint + Prettier no monorepo
- [ ] **TEC-009** — Criar pipeline CI/CD básico no GitHub Actions (lint + testes)
- [x] **TEC-010** — Configurar Docker Compose de desenvolvimento (todos os serviços)

## Fase 1 — Frontend Cliente (migração do HTML)

- [x] **TEC-011** — Criar layout base com identidade visual BRF
- [ ] **TEC-012** — Migrar chatbot do HTML para componente React com máquina de estados _(chatbot desabilitado; formulário multi-etapa implementado como substituto)_
- [x] **TEC-013** — Migrar formulário manual para React Hook Form + Zod
- [x] **TEC-014** — Criar endpoint de catálogos no backend (motivos, agências)
- [x] **TEC-015** — Conectar formulário/chatbot com dados do catálogo (via API)

## Débitos de segurança (a implementar conforme avanço)

- [x] **SEC-001** — Implementar headers HTTP de segurança no backend _(Helmet + CSP/HSTS/X-Frame-Options)_
- [x] **SEC-002** — Implementar mascaramento de dados pessoais nos logs _(IP mascarado; dados sensíveis não logados)_
- [x] **SEC-003** — Configurar criptografia em repouso para campos sensíveis _(AES-256-CBC: numeroConta, titularNome, emailCliente, contaTransferencia)_
- [x] **SEC-006** — Remover dados sensíveis (CNPJ) hardcoded em artefatos estáticos do repositório _(conformidade LGPD — csv, pdf.service.ts, layout.tsx, demo/page.tsx)_ **[CONCLUÍDO]**
- [ ] **SEC-004** — Implementar rate limiting nas rotas públicas
- [ ] **SEC-005** — Revisar todos os DTOs com checklist OWASP ASVS V5

## Fase 8 — Auth Corporativo + CI/CD + Produção

- [ ] **TEC-016** — Substituir auth mock por OIDC/SAML SSO corporativo BRF real no `frontend-interno`
- [ ] **TEC-017** — Configurar pipeline CI/CD no GitHub Actions: lint → test (Jest + Playwright) → build → deploy
- [ ] **TEC-018** — Adicionar análise SAST (CodeQL ou Semgrep) no pipeline CI/CD
- [ ] **TEC-019** — Configurar rate limiting nas rotas públicas do backend (express-rate-limit ou NestJS throttler)
- [ ] **TEC-020** — Hardening de produção: WAF, SIEM, revisão completa OWASP ASVS nível 2
- [ ] **TEC-021** — Integração gov.br para assinatura digital do Termo de Encerramento
- [ ] **TEC-022** — Configurar SSE/KMS no MinIO para produção (S3 SSE-S3 ou SSE-KMS)

---

## Legenda

- [ ] Não iniciado
- [x] Concluído
- [~] Em andamento
- [!] Bloqueado — descrição do bloqueio
