# Convenções de Código — EncerraDigital BRF

**Última atualização**: 2026-04-05

---

## 1. Idioma

| Contexto | Idioma |
|---|---|
| Comentários e JSDoc | Português do Brasil (pt-BR) |
| Nomes de variáveis/funções (código) | Inglês |
| Nomes de domínio (agência, solicitação...) | Português (são nomes de negócio) |
| Mensagens de erro para o usuário | Português do Brasil |
| Mensagens de erro de log interno | Português do Brasil |
| Commits | Português do Brasil |
| Documentação | Português do Brasil |

---

## 2. Nomenclatura

### Arquivos
- Componentes React: `PascalCase.tsx` → ex.: `FormularioEncerramento.tsx`
- Hooks: `useNomeDoHook.ts` → ex.: `useSolicitacao.ts`
- Services NestJS: `nome.service.ts` → ex.: `solicitacoes.service.ts`
- Controllers NestJS: `nome.controller.ts`
- Repositories: `nome.repository.ts`
- DTOs: `nome.dto.ts` → ex.: `criar-solicitacao.dto.ts`
- Testes: `nome.spec.ts` ou `nome.test.ts`

### Variáveis e funções
- camelCase para variáveis e funções
- PascalCase para classes, interfaces e tipos
- SCREAMING_SNAKE_CASE para constantes globais
- Prefixo `I` para interfaces: `ISolicitacao`
- Prefixo `T` para tipos: `TStatusSolicitacao`

### Banco de dados (PostgreSQL)
- Tabelas: `snake_case` no plural → `solicitacoes`, `documentos`
- Colunas: `snake_case` → `numero_conta`, `criado_em`
- Índices: `idx_tabela_coluna` → `idx_solicitacoes_status`

---

## 3. Estrutura de um módulo NestJS

```
backend/src/modules/solicitacoes/
├── dto/
│   ├── criar-solicitacao.dto.ts
│   └── atualizar-status.dto.ts
├── entities/
│   └── solicitacao.entity.ts
├── solicitacoes.controller.ts
├── solicitacoes.service.ts
├── solicitacoes.repository.ts
├── solicitacoes.module.ts
└── solicitacoes.spec.ts
```

---

## 4. Estrutura de um módulo Next.js (App Router)

```
frontend-cliente/src/app/(fluxo-encerramento)/
├── page.tsx               ← Página principal
├── layout.tsx             ← Layout do fluxo
├── components/
│   ├── ChatbotEncerramento.tsx
│   └── FormularioEncerramento.tsx
├── hooks/
│   └── useEncerramento.ts
└── types/
    └── encerramento.types.ts
```

---

## 5. Commits

Formato: `tipo(escopo): descrição curta em pt-BR`

| Tipo | Quando usar |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Documentação |
| `refactor` | Refatoração sem mudança de comportamento |
| `test` | Adição ou correção de testes |
| `chore` | Tarefas de manutenção (deps, configs) |
| `security` | Correção de vulnerabilidade |

Exemplos:
```
feat(frontend-cliente): adicionar chatbot de encerramento com fluxo guiado
fix(backend): corrigir validação de MIME type no upload de termo
security(backend): mascarar CPF nos logs de auditoria
docs: atualizar ADR-002 com decisão sobre armazenamento de arquivos
```
