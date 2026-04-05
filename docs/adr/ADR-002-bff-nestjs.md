# ADR-002 — Padrão Backend for Frontend (BFF) com NestJS

**Data**: 2026-04-05  
**Status**: Aceita  
**Autores**: Equipe EncerraDigital

## Contexto
O sistema tem dois frontends com necessidades diferentes (cliente público e operadores internos). Precisamos de uma camada que proteja a integração com sistemas internos do banco e centralize segurança, autenticação e lógica de negócio.

## Decisão
Adotar o padrão **Backend for Frontend (BFF)** com um único backend NestJS servindo ambos os frontends, com rotas claramente segregadas por prefixo (`/api/publico/*` e `/api/interno/*`) e diferentes políticas de autenticação.

## Consequências
- ✅ Tokens e credenciais de sistemas internos nunca chegam ao browser
- ✅ Lógica de negócio centralizada em um único lugar
- ✅ NestJS oferece estrutura modular, guards, interceptors e pipes que facilitam segurança
- ⚠️ Ponto único de falha — exige boa estratégia de monitoramento e escalabilidade

## Alternativas descartadas
- **Dois backends separados**: descartado por duplicar código e complexidade operacional
- **Next.js API Routes como backend**: descartado por limitações em lógica complexa e segurança robusta
- **GraphQL puro**: pode ser adicionado como camada opcional depois, mas REST é mais simples para começar
