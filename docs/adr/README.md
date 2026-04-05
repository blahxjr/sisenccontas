# ADRs — Architectural Decision Records

Registro de todas as decisões arquiteturais importantes do projeto EncerraDigital.

## O que é um ADR?
Um ADR documenta uma decisão de arquitetura relevante: o que foi decidido, 
por que foi decidido e quais alternativas foram descartadas.

## Como criar um novo ADR
1. Crie um arquivo `ADR-NNN-titulo-da-decisao.md` nesta pasta.
2. Use o template abaixo.
3. Atualize o índice neste README.

## Template
```markdown
# ADR-NNN — Título da Decisão

**Data**: AAAA-MM-DD  
**Status**: Proposta | Aceita | Substituída | Obsoleta  
**Autores**: Nome(s)

## Contexto
Por que essa decisão precisou ser tomada?

## Decisão
O que foi decidido?

## Consequências
Quais são os impactos positivos e negativos desta decisão?

## Alternativas descartadas
O que foi considerado e por que foi rejeitado?
```

---

## Índice de ADRs

| ID | Título | Status | Data |
|---|---|---|---|
| ADR-001 | Uso de monorepo com PNPM Workspaces | Aceita | 2026-04-05 |
| ADR-002 | Padrão Backend for Frontend (BFF) com NestJS | Aceita | 2026-04-05 |
| ADR-003 | PostgreSQL como banco de dados principal | Aceita | 2026-04-05 |
| ADR-004 | MinIO para armazenamento de arquivos em dev | Aceita | 2026-04-05 |
