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

```bash
# 1. Clonar o repositório
git clone <repo-url> EncerraDigital
cd EncerraDigital

# 2. Copiar variáveis de ambiente
cp .env.example .env
# Edite o .env com os valores corretos

# 3. Abrir no VS Code com Dev Container
code .
# VS Code perguntará se quer abrir no container — confirme

# 4. Subir serviços de infraestrutura
docker compose -f infra/docker-compose.dev.yml up -d

# 5. Instalar dependências
pnpm install

# 6. Iniciar em desenvolvimento
pnpm dev
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
