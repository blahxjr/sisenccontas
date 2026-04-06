# EncerraDigital — BNB

Sistema de solicitação digital de encerramento de conta corrente do Banco do Nordeste.

## Módulos

| Módulo | Descrição | Porta |
|---|---|---|
| `frontend-cliente` | Interface pública para o cliente final | 3000 |
| `frontend-interno` | Interface restrita para operadores do banco | 3001 |
| `backend` | API BFF (NestJS) | 3333 |

## Pré-requisitos

- Node.js 20+
- PNPM 9+
- Docker + Docker Compose
- VS Code com extensão "Dev Containers"

## Início rápido

### Opção A — Script automático (recomendado)

```powershell
.\start-dev.ps1
```

O script verifica pré-requisitos, sobe o Docker e abre os servidores em janelas separadas automaticamente.

**Flags opcionais:**

```powershell
.\start-dev.ps1 -SemInterno   # não sobe o frontend-interno
.\start-dev.ps1 -SoDocker     # sobe apenas PostgreSQL, Redis e MinIO
```

---

### Opção B — VS Code Tasks (Ctrl+Shift+B)

Com o projeto aberto no VS Code, pressione **`Ctrl+Shift+B`** e selecione:

> **▶ EncerraDigital: Iniciar tudo**

Isso roda Docker + Backend + Frontend Cliente + Frontend Interno em terminais separados dentro do VS Code.

Outras tarefas disponíveis via **`Ctrl+Shift+P` → "Tasks: Run Task"**:

| Tarefa | O que faz |
|---|---|
| `▶ EncerraDigital: Iniciar tudo` | Sobe tudo (padrão `Ctrl+Shift+B`) |
| `🐳 Docker: Subir infraestrutura` | Só PostgreSQL, Redis e MinIO |
| `🛑 Docker: Parar infraestrutura` | Para os containers |
| `⚙️ Backend: NestJS (porta 3333)` | Só o backend |
| `🌐 Frontend Cliente: Next.js (porta 3000)` | Só o frontend público |
| `🏦 Frontend Interno: Next.js (porta 3001)` | Só o painel interno |
| `🧪 Testes: Unitários (Jest)` | Suite completa de testes |
| `🎭 Testes: E2E (Playwright)` | Testes end-to-end |

---

### Opção C — Manual

```powershell
# 1. Subir infraestrutura
docker compose -f infra/docker-compose.dev.yml up -d

# 2. Instalar dependências (só na primeira vez)
pnpm install

# 3. Backend + Frontend Cliente juntos
pnpm dev

# 4. Frontend Interno (outro terminal)
pnpm dev:interno
```

---

### URLs disponíveis

| Serviço | URL |
|---|---|
| Frontend Cliente | http://localhost:3000 |
| Página Demo | http://localhost:3000/demo |
| Frontend Interno | http://localhost:3001 |
| Backend API | http://localhost:3333 |
| Swagger | http://localhost:3333/api/docs |
| MinIO Console | http://localhost:9001 |

---

### Encerrar o ambiente

```powershell
# Para os servidores Node.js: Ctrl+C nos terminais
# Para o Docker:
docker compose -f infra/docker-compose.dev.yml down
```

## Documentação

| Arquivo | Conteúdo |
|---|---|
| `docs/memoria/contexto-atual.md` | **Leia primeiro** — Estado atual do projeto |
| `docs/arquitetura.md` | Arquitetura e modelos de dados |
| `docs/seguranca-lgpd.md` | Controles de segurança e LGPD |
| `docs/convencoes.md` | Convenções de código |
| `docs/backlog-produto.md` | Histórias de usuário |
| `docs/backlog-tecnico.md` | Tarefas técnicas e débitos |
| `docs/adr/` | Decisões arquiteturais (ADRs) |

## Agentes de IA

Para usar os agentes no GitHub Copilot Chat:
```
@workspace [AGENTE: Backend] Crie o endpoint POST /api/solicitacoes
@workspace [AGENTE: Segurança] Revise este controller
@workspace [AGENTE: Testes] Gere testes para o SolicitacoesService
```

Ver `.github/copilot-instructions.md` para instruções completas.

## Segurança e LGPD

Este sistema opera no ecossistema bancário. Ver `docs/seguranca-lgpd.md`.  
**Nunca comite o arquivo `.env`.**  
**Nunca exponha dados pessoais em logs.**

## Licença

Uso interno — Banco do Nordeste. Confidencial.
