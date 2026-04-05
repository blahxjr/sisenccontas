# ADR-001 — Uso de monorepo com PNPM Workspaces

**Data**: 2026-04-05  
**Status**: Aceita  
**Autores**: Equipe EncerraDigital

## Contexto
O sistema tem dois frontends (cliente e interno) e um backend, que compartilham tipos, utilitários e configurações. Precisamos de uma estratégia para gerenciar múltiplos pacotes de forma coesa.

## Decisão
Usar monorepo com **PNPM Workspaces**, com os pacotes `frontend-cliente`, `frontend-interno` e `backend` como workspaces independentes.

## Consequências
- ✅ Compartilhamento fácil de tipos e utilitários via pacote `packages/shared`
- ✅ Um único repositório Git, facilitando pull requests e code review
- ✅ PNPM é mais eficiente que NPM/Yarn em disco e tempo de instalação
- ⚠️ Exige familiaridade com a estrutura de workspaces

## Alternativas descartadas
- **Repositórios separados**: descartado por dificultar compartilhamento de tipos e sincronização de versões
- **Yarn Workspaces**: descartado em favor do PNPM (melhor performance)
- **Turborepo/Nx como orquestrador**: pode ser adicionado depois se o build time crescer
