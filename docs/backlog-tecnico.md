# Backlog Técnico — EncerraDigital BNB

**Última atualização**: 2026-04-05

---

## Fase 0 — Estrutura e Ambiente

- [ ] **TEC-001** — Criar estrutura de monorepo com PNPM Workspaces
- [ ] **TEC-002** — Configurar Dev Container (Node 20, PostgreSQL, Redis, MinIO)
- [ ] **TEC-003** — Criar projeto Next.js `frontend-cliente` com TypeScript + TailwindCSS
- [ ] **TEC-004** — Criar projeto Next.js `frontend-interno` com TypeScript + TailwindCSS
- [ ] **TEC-005** — Criar projeto NestJS `backend` com TypeScript
- [ ] **TEC-006** — Configurar Prisma + PostgreSQL no backend
- [ ] **TEC-007** — Criar primeiro modelo de dados (tabela `solicitacoes`)
- [ ] **TEC-008** — Configurar ESLint + Prettier no monorepo
- [ ] **TEC-009** — Criar pipeline CI/CD básico no GitHub Actions (lint + testes)
- [ ] **TEC-010** — Configurar Docker Compose de desenvolvimento (todos os serviços)

## Fase 1 — Frontend Cliente (migração do HTML)

- [ ] **TEC-011** — Criar layout base com identidade visual BNB
- [ ] **TEC-012** — Migrar chatbot do HTML para componente React com máquina de estados
- [ ] **TEC-013** — Migrar formulário manual para React Hook Form + Zod
- [ ] **TEC-014** — Criar endpoint de catálogos no backend (motivos, agências)
- [ ] **TEC-015** — Conectar formulário/chatbot com dados do catálogo (via API)

## Débitos de segurança (a implementar conforme avanço)

- [ ] **SEC-001** — Implementar headers HTTP de segurança no backend
- [ ] **SEC-002** — Implementar mascaramento de dados pessoais nos logs
- [ ] **SEC-003** — Configurar criptografia em repouso para campos sensíveis
- [ ] **SEC-004** — Implementar rate limiting nas rotas públicas
- [ ] **SEC-005** — Revisar todos os DTOs com checklist OWASP ASVS V5

---

## Legenda
- [ ] Não iniciado
- [x] Concluído
- [~] Em andamento
- [!] Bloqueado — descrição do bloqueio
