# Instruções Globais para o GitHub Copilot — Projeto EncerraDigital BRF

> Este arquivo é lido automaticamente pelo GitHub Copilot Chat ao usar `@workspace`.
> Ele define o contexto, regras e papéis dos agentes de IA para este projeto.
> **Idioma padrão: Português do Brasil (pt-BR)** em todos os comentários, documentação, nomes de variáveis de domínio e mensagens de commit.

---

## 1. Visão geral do projeto

**Nome**: EncerraDigital  
**Contexto**: Sistema de solicitação digital de encerramento de conta corrente para o Banco Regional de Fomento (BRF).  
**Objetivo**: Digitalizar e automatizar a jornada do cliente para encerramento de conta, eliminando a necessidade de atendimento presencial.  
**Ecossistema**: Bancário — alto padrão de segurança, conformidade LGPD e OWASP ASVS obrigatórios.  

**Dois módulos principais**:
- `frontend-cliente` — Interface pública para o cliente final (sem dados internos do banco).
- `frontend-interno` — Interface restrita para equipes internas do banco (autenticação obrigatória).
- `backend` — API Node.js + TypeScript (BFF), única camada que acessa banco de dados, CSVs e integrações.

---

## 2. Stack tecnológica

| Camada | Tecnologia |
|---|---|
| Frontend Cliente | Next.js 14+ (App Router), TypeScript, TailwindCSS |
| Frontend Interno | Next.js 14+ (App Router), TypeScript, TailwindCSS |
| Backend | Node.js 20+, TypeScript, NestJS |
| Banco de dados | PostgreSQL 16+ com Prisma ORM |
| Autenticação | JWT (módulo público) + OIDC/SAML SSO (módulo interno) |
| Storage de arquivos | MinIO (local/dev) / S3-compatível (produção) |
| Cache | Redis |
| Containerização | Docker + Dev Containers (VS Code) |
| Testes | Jest (unit + integration), Playwright (e2e) |
| Lint/Format | ESLint + Prettier |
| CI/CD | GitHub Actions |

---

## 3. Arquivos de contexto obrigatórios

Antes de propor qualquer mudança de arquitetura ou design, consulte sempre:

- `#file:'docs/arquitetura.md'` — Visão arquitetural completa
- `#file:'docs/seguranca-lgpd.md'` — Exigências de segurança e LGPD
- `#file:'docs/backlog-tecnico.md'` — Dívidas técnicas e pendências
- `#file:'docs/backlog-produto.md'` — Histórias de usuário e features
- `#file:'docs/adr/README.md'` — Índice de decisões arquiteturais (ADRs)
- `#file:'docs/memoria/contexto-atual.md'` — Estado atual de desenvolvimento
- `#file:'docs/convencoes.md'` — Convenções de código e nomenclatura
- `#file:'docs/estrategia-agentes-e-memoria.md'` — Estratégia de desenvolvimento com agentes de IA e memória persistente

---

## 4. Regras globais de desenvolvimento

### 4.1 Código
- Toda função pública deve ter JSDoc em pt-BR.
- Nomes de variáveis e funções em inglês (padrão de código). Nomes de domínio (ex.: `agencia`, `solicitacao`) podem ser em pt-BR.
- Nunca escreva lógica de negócio em controllers — use sempre a camada de service.
- Nunca acesse o banco de dados diretamente em services — use sempre a camada de repository.
- Toda entrada de dados do usuário deve ser validada com DTO + class-validator antes de chegar ao service.
- Nunca exponha stack trace ou mensagens de erro do servidor em respostas de API.

### 4.2 Segurança (OWASP ASVS)
- Toda rota do módulo interno exige autenticação e autorização explícita via guard.
- Upload de arquivos sempre com verificação de MIME, limite de tamanho e armazenamento fora do diretório público.
- Dados pessoais nunca devem aparecer em logs — use mascaramento obrigatório.
- Headers HTTP de segurança (CSP, HSTS, X-Frame-Options) são obrigatórios no backend.
- Qualquer token, secret ou credencial NUNCA vai para o código — use variáveis de ambiente.

### 4.3 LGPD
- Coleta mínima de dados: solicite apenas o necessário para o processo de encerramento.
- Toda solicitação deve registrar o aceite de termos de uso e política de privacidade (timestamp + versão).
- Dados pessoais sensíveis devem ser criptografados em repouso.
- Logs de acesso a dados pessoais são obrigatórios no módulo interno.

### 4.4 Git e commits
- Formato de commit: `tipo(escopo): descrição em pt-BR`
- Tipos: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `security`
- Exemplo: `feat(frontend-cliente): adicionar etapa de confirmação no chatbot`
- Uma feature por branch, nomenclatura: `feat/nome-da-feature` ou `fix/nome-do-bug`

---

## 5. Agentes de IA disponíveis

Este projeto usa agentes de IA especializados por contexto.
Cada agente tem um arquivo de instruções próprio em `.github/agents/`.

| Agente | Arquivo | Quando usar |
|---|---|---|
| Arquiteto | `.github/agents/arquiteto.md` | Decisões de design, ADRs, refatorações estruturais |
| Desenvolvedor Backend | `.github/agents/dev-backend.md` | Endpoints, services, repositories, migrações |
| Desenvolvedor Frontend | `.github/agents/dev-frontend.md` | Componentes React, páginas Next.js, UX |
| Segurança | `.github/agents/seguranca.md` | Revisão de segurança, OWASP, LGPD |
| Testes | `.github/agents/testes.md` | Geração e revisão de testes |
| Documentador | `.github/agents/documentador.md` | Atualização de docs, ADRs, backlog, memória |

Para ativar um agente, mencione seu contexto no início do chat.
Exemplo: `@workspace [AGENTE: Segurança] Revise este endpoint de upload.`

---

## 6. Modelo de IA recomendado por agente

> A seleção de modelo no Copilot Chat é **manual** — use a tabela abaixo como guia
> antes de acionar cada agente. O modo **Auto** pode ser usado quando estiver em dúvida.

| Agente | Modelo recomendado | Motivo |
|---|---|---|
| Arquiteto | **Claude Opus 4.6** | Decisões arquiteturais exigem raciocínio profundo e análise de trade-offs |
| Dev Backend | **Claude Sonnet 4.6** | Equilíbrio ideal entre qualidade de código e velocidade de resposta |
| Dev Frontend | **Claude Sonnet 4.6** ou **GPT-4.1** | Geração de componentes React/Next.js é bem coberta por ambos |
| Segurança | **Claude Opus 4.6** | Revisão crítica de segurança exige máxima atenção a detalhes e contexto |
| Testes | **Claude Sonnet 4.6** ou **GPT-4.1** | Testes têm estrutura previsível — modelo intermediário resolve bem |
| Documentador | **Claude Haiku 4.5** ou **GPT-4.1** | Tarefa estruturada e simples — não justifica modelo pesado |

### Como selecionar o modelo no VS Code

1. Abra o Copilot Chat (`Ctrl + Alt + I`)
2. Clique em **Auto** na barra inferior do chat (conforme print de referência)
3. Selecione o modelo da tabela acima conforme o agente que vai usar
4. Referencie o agente com `#file:` e inicie a tarefa

### Dica de custo vs. qualidade

- Use **Opus / GPT-5.4** apenas para tarefas de alto impacto (arquitetura, segurança crítica)
- Use **Sonnet / GPT-4.1** para o dia a dia de desenvolvimento
- Use **Haiku** para tarefas repetitivas ou de baixo risco (atualizar docs, gerar changelogs)
- O modo **Auto** é uma boa escolha quando não tiver certeza — o Copilot tende a escolher bem
