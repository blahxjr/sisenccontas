# Estratégia de Desenvolvimento com Agentes de IA e Memória Persistente

> **EncerraDigital BRF** — Documento de referência sobre como o projeto é desenvolvido  
> com o auxílio de agentes de IA especializados no GitHub Copilot Chat.  
>
> **Leitura recomendada para**: novos desenvolvedores, onboarding de IA, apresentações acadêmicas.  
> **Última atualização**: 2026-04-06

---

## 1. Visão Geral da Estratégia

Este projeto utiliza uma abordagem de desenvolvimento assistido por IA com **agentes especializados**,
organizados por domínio de responsabilidade. Cada agente tem um "papel" definido, instruções específicas
e acesso apenas ao contexto que precisa.

O modelo de trabalho é:

```
Desenvolvedor → ativa Agente → Agente lê contexto persistente → executa tarefa → Documentador atualiza memória
```

Isso permite que **qualquer nova sessão de IA retome o trabalho exatamente de onde parou**, sem
precisar re-explicar a arquitetura, decisões passadas ou estado atual do projeto.

---

## 2. Arquivos de Configuração dos Agentes

### 2.1 Instruções globais

```
.github/
└── copilot-instructions.md     ← Lido automaticamente em todo @workspace
```

O arquivo `.github/copilot-instructions.md` é carregado automaticamente pelo GitHub Copilot Chat
ao usar `@workspace`. Ele define:

- Visão geral do projeto (EncerraDigital, contexto BRF)
- Stack tecnológica completa
- Regras globais de código, segurança e LGPD
- Lista dos agentes disponíveis e quando usar cada um
- Modelo de IA recomendado por tipo de tarefa

> **Efeito prático**: qualquer resposta do Copilot já considera essas regras automaticamente,
> sem necessidade de repetir o contexto a cada mensagem.

---

### 2.2 Agentes especializados

```
.github/agents/
├── arquiteto.md        ← Decisões de design, ADRs, impacto arquitetural
├── dev-backend.md      ← Endpoints, services, repositories, migrações Prisma
├── dev-frontend.md     ← Componentes React, páginas Next.js, UX/acessibilidade
├── seguranca.md        ← Revisão OWASP, LGPD, headers HTTP, criptografia
├── testes.md           ← Jest, Playwright E2E, cobertura, mocks
└── documentador.md     ← Atualização de docs, ADRs, backlog, memória persistente
```

Cada arquivo de agente define:

| Campo | Descrição |
|---|---|
| **Papel** | O que o agente faz e qual seu escopo |
| **Contexto obrigatório** | Quais arquivos `#file:` devem ser lidos antes de responder |
| **Regras de implementação** | Padrões específicos a seguir (ex.: separação de camadas) |
| **Formato de resposta** | Como a resposta deve ser estruturada (código completo, cheklist, ADR...) |
| **Restrições** | O que o agente NÃO deve fazer |

#### Como ativar um agente

No Copilot Chat, mencione o contexto do agente no início da mensagem:

```
@workspace [AGENTE: Dev Backend] Adicionar endpoint de relatório mensal.
```

Ou referencie o arquivo diretamente:

```
#file:.github/agents/dev-backend.md
Preciso implementar o endpoint de cancelamento de solicitação.
```

---

### 2.3 Tabela de agentes e responsabilidades

| Agente | Arquivo | Quando usar | Modelo recomendado |
|---|---|---|---|
| **Arquiteto** | `arquiteto.md` | Novas features com impacto estrutural, refatorações, ADRs | Claude Opus 4.6 |
| **Dev Backend** | `dev-backend.md` | Endpoints NestJS, services, repositories, DTOs, migrações | Claude Sonnet 4.6 |
| **Dev Frontend** | `dev-frontend.md` | Componentes React/Next.js, hooks, formulários, UX | Claude Sonnet 4.6 |
| **Segurança** | `seguranca.md` | Revisão de código sensível, uploads, auth, LGPD | Claude Opus 4.6 |
| **Testes** | `testes.md` | Geração de testes Jest, specs Playwright, mocks | Claude Sonnet 4.6 |
| **Documentador** | `documentador.md` | Atualizar docs após sessão, criar ADRs, changelog | Claude Haiku 4.5 |

---

## 3. Sistema de Memória Persistente

A memória do projeto é mantida por uma hierarquia de arquivos que garantem que
nenhum contexto se perca entre sessões de desenvolvimento.

### 3.1 Visão geral da hierarquia

```
docs/
├── memoria/
│   └── contexto-atual.md       ← "README da sessão atual" — leia SEMPRE primeiro
├── arquitetura.md              ← Visão arquitetural permanente do sistema
├── convencoes.md               ← Padrões de código, nomenclatura, idioma
├── seguranca-lgpd.md           ← Requisitos de segurança e LGPD
├── backlog-tecnico.md          ← Dívidas técnicas e tarefas pendentes
├── backlog-produto.md          ← Histórias de usuário e features
├── changelog-tecnico.md        ← Histórico de mudanças (por commit/fase)
└── adr/
    ├── README.md               ← Índice de decisões arquiteturais
    ├── ADR-001-*.md            ← Decisão: monorepo com pnpm
    ├── ADR-002-*.md            ← Decisão: BFF NestJS
    ├── ADR-003-*.md            ← Decisão: PostgreSQL
    ├── ADR-004-*.md            ← Decisão: MinIO para storage
    ├── ADR-005-*.md            ← Decisão: paleta de cores BRF
    ├── ADR-006-*.md            ← Decisão: quebra de linha PDF por pixel
    └── ADR-007-*.md            ← Decisão: route group (main) para layout
```

### 3.2 `contexto-atual.md` — o coração da memória

Este é o arquivo mais importante do sistema de memória. Segue o princípio:

> **"Leia este arquivo primeiro"** — é o único arquivo que um agente de IA precisa
> ler para entender onde o projeto está e o que fazer a seguir.

Estrutura padrão do arquivo:

```markdown
# Contexto Atual do Projeto — EncerraDigital BRF
Atualizado em: AAAA-MM-DD
Fase atual: Fase N ✅ | Última feature ✅

## O que foi feito até agora
(histórico por fase, com detalhes técnicos concretos)

## O que está em andamento
(tarefas abertas, por que ainda não foram concluídas)

## O que está bloqueado
(bloqueios ativos — nunca deixar em branco sem justificativa)

## Próximos passos imediatos
(o que fazer na próxima sessão — especificidade é obrigatória)
```

**Regra fundamental**: o Agente Documentador atualiza este arquivo ao final de CADA sessão
de desenvolvimento significativa. Isso garante que a próxima sessão de IA retome com
contexto completo, sem precisar re-explicar nada.

### 3.3 ADRs — Architectural Decision Records

Toda decisão arquitetural relevante gera um ADR em `docs/adr/`. O formato é:

```markdown
# ADR-NNN — Título da Decisão

Data, Status, Autores

## Contexto   → por que foi necessário decidir?
## Decisão    → o que foi escolhido?
## Alternativas descartadas → o que foi considerado e rejeitado?
## Consequências → impactos positivos e negativos
```

**Exemplos de decisões documentadas no projeto**:

| ADR | Decisão |
|---|---|
| ADR-001 | Monorepo com pnpm workspaces |
| ADR-002 | Backend como BFF (NestJS) — único acesso ao banco |
| ADR-003 | PostgreSQL 16 como banco de dados principal |
| ADR-004 | MinIO como storage S3-compatível (dev) / S3 (prod) |
| ADR-005 | Paleta de cores oficial BRF (vermelho #A6193C, não azul) |
| ADR-006 | Quebra de linha em PDF por pixel (`font.widthOfTextAtSize`) |
| ADR-007 | Route Group `(main)` para isolar layout do `/demo` standalone |

---

## 4. Fluxo de Trabalho com Agentes

### 4.1 Início de sessão (protocolo de onboarding de IA)

```
1. Ler docs/memoria/contexto-atual.md         → estado atual do projeto
2. Ler docs/arquitetura.md (se mudança estrutural)
3. Ativar o agente adequado via #file: 
4. Executar a tarefa
5. Ao final: acionar Agente Documentador para atualizar a memória
```

### 4.2 Ciclo de desenvolvimento por fase

```
┌─────────────────────────────────────────────────────────────────┐
│                  CICLO POR FASE / FEATURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. ARQUITETO                                                   │
│     → Avalia impacto arquitetural da feature                    │
│     → Cria ADR se necessário                                    │
│     → Define contrato de API (request/response)                 │
│                        ↓                                        │
│  2. DEV BACKEND                                                 │
│     → Implementa controller → service → repository              │
│     → Cria/valida DTOs + class-validator                        │
│     → Executa migration Prisma                                  │
│                        ↓                                        │
│  3. DEV FRONTEND                                                │
│     → Implementa componentes React / páginas Next.js            │
│     → Conecta ao backend via api-client.ts centralizado         │
│                        ↓                                        │
│  4. SEGURANÇA                                                   │
│     → Revisa endpoints novos (OWASP checklist)                  │
│     → Valida LGPD: coleta mínima, criptografia, consentimento   │
│                        ↓                                        │
│  5. TESTES                                                      │
│     → Gera testes Jest para services novos                      │
│     → Atualiza spec Playwright para fluxos E2E                  │
│                        ↓                                        │
│  6. DOCUMENTADOR                                                │
│     → Atualiza contexto-atual.md                                │
│     → Atualiza backlog-tecnico.md e backlog-produto.md          │
│     → Registra no changelog-tecnico.md                         │
│     → Cria ADRs pendentes                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Seleção de modelo por tarefa

| Tarefa | Modelo | Motivo |
|---|---|---|
| Decisões arquiteturais, review de segurança | Claude Opus 4.6 | Raciocínio profundo, análise de trade-offs |
| Implementação backend/frontend | Claude Sonnet 4.6 | Equilíbrio qualidade × velocidade |
| Geração de testes, componentes simples | Claude Sonnet 4.6 | Estrutura previsível |
| Atualizar docs, changelogs, ADRs | Claude Haiku 4.5 | Tarefa estruturada — não justifica modelo pesado |
| Dúvida geral / não sei qual agente | Auto | Copilot escolhe automaticamente |

---

## 5. Organização Completa dos Arquivos do Projeto

### 5.1 Estrutura do repositório (monorepo pnpm)

```
SISENCCONTAS/
│
├── .github/
│   ├── copilot-instructions.md     ← Instruções globais — carregadas automaticamente
│   └── agents/
│       ├── arquiteto.md
│       ├── dev-backend.md
│       ├── dev-frontend.md
│       ├── seguranca.md
│       ├── testes.md
│       └── documentador.md
│
├── docs/
│   ├── memoria/
│   │   └── contexto-atual.md       ← LEIA SEMPRE PRIMEIRO (estado do projeto)
│   ├── arquitetura.md
│   ├── convencoes.md
│   ├── seguranca-lgpd.md
│   ├── backlog-tecnico.md          ← TEC-001..022, SEC-001..003
│   ├── backlog-produto.md          ← US-001..007
│   ├── changelog-tecnico.md
│   └── adr/
│       ├── README.md               ← Índice de ADRs
│       ├── ADR-001-monorepo-pnpm.md
│       ├── ADR-002-bff-nestjs.md
│       ├── ADR-003-postgresql.md
│       ├── ADR-004-minio-storage.md
│       ├── ADR-005-paleta-cores-bnb.md
│       ├── ADR-006-quebra-linha-pdf-pixel.md
│       └── ADR-007-route-group-main-layout.md
│
├── data/
│   ├── agencias.csv                ← 300 agências reais BRF (fonte: BCB/ODbL)
│   └── motivos_encerramento.csv    ← 7 motivos oficiais de encerramento
│
├── backend/                        ← NestJS BFF — único acesso ao banco e storage
│   ├── prisma/
│   │   ├── schema.prisma           ← Modelo Solicitacao + Documento + enums
│   │   ├── seed.ts
│   │   └── migrations/             ← 3 migrations aplicadas
│   └── src/
│       ├── main.ts                 ← Bootstrap (Helmet, CORS, ValidationPipe, Swagger)
│       ├── app.module.ts
│       ├── modules/
│       │   ├── catalogos/          ← /agencias, /agencias/ufs (CSV BRF)
│       │   ├── documentos/         ← upload, gerar-termo, download
│       │   ├── interno/            ← dashboard operador (autenticado)
│       │   ├── saude/              ← /api/saude (health check)
│       │   └── solicitacoes/       ← criar solicitação, consultar status
│       └── shared/
│           ├── minio/              ← MinIO client global (S3-compatível)
│           ├── pdf/                ← gerarTermoEncerramento (14 seções BRF-3303-40-64)
│           ├── prisma/             ← PrismaModule global (falha graciosamente)
│           └── utils/
│               └── seguranca.util.ts  ← AES-256-CBC, SHA-256, mascararIp, protocolo
│
├── frontend-cliente/               ← Next.js 14 App Router — interface pública
│   └── src/
│       ├── app/
│       │   ├── layout.tsx          ← Root layout (html/body bare)
│       │   ├── (main)/             ← Route Group: header BRF + max-w-4xl
│       │   │   ├── layout.tsx      ← Header vermelho + footer
│       │   │   ├── page.tsx        ← Home / landing
│       │   │   └── encerramento/   ← /encerramento/formulario, /status
│       │   └── demo/
│       │       └── page.tsx        ← /demo — standalone (sem header/footer)
│       ├── components/
│       │   └── encerramento/
│       │       ├── FormularioEncerramento.tsx   ← RHF + Zod, 3 etapas
│       │       └── UploadTermoAssinado.tsx      ← drag-drop, progress bar
│       ├── hooks/
│       │   └── useCatalogos.ts     ← cascata UF → Agência
│       └── lib/
│           └── api-client.ts       ← axios centralizado com interceptors
│
├── frontend-interno/               ← Next.js 14 App Router — restrito operadores
│   └── src/
│       ├── middleware.ts           ← Proteção de rotas (exceto /login, /api/auth)
│       ├── app/
│       │   ├── login/              ← Tela de login SSO mock
│       │   ├── dashboard/          ← Lista de solicitações paginada
│       │   │   └── [id]/           ← Detalhe + ações por perfil
│       │   ├── providers.tsx       ← SessionProvider client-side
│       │   └── api/auth/           ← NextAuth v4 handlers
│       └── lib/
│           ├── api-interno.ts      ← axios com token de sessão
│           └── auth.ts             ← config NextAuth (OIDC mock)
│
├── e2e/                            ← Playwright E2E (workspace pnpm dedicado)
│   ├── playwright.config.ts        ← Chromium, workers=1, timeout 60s
│   ├── pages/
│   │   ├── FormularioPage.ts       ← Page Object: formulário cliente
│   │   └── DashboardPage.ts        ← Page Object: dashboard operador
│   └── fluxo-completo.spec.ts      ← 6 testes E2E (todos passando ✅)
│
├── infra/
│   └── docker-compose.dev.yml      ← postgres:16, minio/minio, redis:7
│
├── pnpm-workspace.yaml             ← workspaces: backend, frontends, e2e
├── package.json                    ← scripts raiz (dev, build, test)
└── README.md
```

---

## 6. Contexto de Desenvolvimento — Linha do Tempo

### Fases concluídas

| Fase | Conteúdo | Commit |
|---|---|---|
| **Fase 1** | Catálogos BRF — 300 agências CSV, 7 motivos, endpoints REST | `eb21b9d` |
| **Fase 2** | Scaffold backend NestJS — Prisma, Helmet, seguranca.util.ts | `eb21b9d` |
| **Fase 3** | Backend solicitações — DTO, criptografia AES-256, protocolo | `eb21b9d` |
| **Fase 4** | Schema Prisma + infraestrutura Docker (postgres, minio, redis) | `eb21b9d` |
| **Fase 5** | Frontend interno + auth mock NextAuth + dashboard operador | `eb21b9d` |
| **Fase 6** | Upload/PDF — MinIO, pdf-lib, UploadTermoAssinado, InternoController | `07ebd64` |
| **Fase 7** | Testes — 22 Jest + 6 Playwright E2E, todos passando | comit fase 7 |
| **Conformidade** | Paleta BRF verm/laranja, Termo BRF-3303-40-64, campos normativos | — |
| **Demo Visual** | `/demo` standalone — Route Group, preview form/dashboard | `7251565` |
| **Fix PDF** | Paginação real, quebra por pixel, 14 seções oficiais | `14e1bdf` |
| **Docs** | Atualização completa de todos os docs via Agente Documentador | `48371c1` |

### Estado atual do repositório

```
Branch: main
HEAD: 48371c1
Testes: 22 Jest ✅ | 6 E2E Playwright ✅
TypeScript: tsc --noEmit ✅ (zero erros nos 3 módulos)
Build: pnpm build ✅ (7 rotas, zero erros)
```

---

## 7. Regras Imutáveis do Projeto

Estas regras são verificadas por todos os agentes antes de qualquer implementação:

### Segurança
- `emailCliente` e `contaTransferencia` → criptografados com AES-256-CBC em repouso
- Nenhum dado pessoal aparece em logs (usar `maskData()` de `seguranca.util.ts`)
- Uploads de arquivo validados com magic bytes + MIME + limite 10MB
- Headers HTTP de segurança (CSP, HSTS, X-Frame-Options) em todo o backend
- Tokens e secrets exclusivamente em variáveis de ambiente (`.env` nunca no git)

### Arquitetura
- Lógica de negócio → somente em Services
- Acesso ao banco → somente em Repositories (via Prisma)
- Validação de entrada → somente via DTOs com class-validator
- Stack trace de servidor → jamais exposto em respostas de API

### LGPD
- Coleta mínima de dados (apenas o necessário para encerramento)
- Consentimento registrado com timestamp + versão do termo
- Dados sensíveis criptografados em repouso (AES-256)
- Log de acesso a dados pessoais obrigatório no módulo interno

### Paleta de cores (Paleta Banco Regional de Fomento)
| Token Tailwind | HEX | Uso |
|---|---|---|
| `brf-vermelho` | `#A6193C` | Header, botões primários, destaques |
| `brf-vermelho-escuro` | `#7A1228` | Hover de botões primários |
| `brf-laranja` | `#F68B1F` | Badges, ícones, links ativos |
| `brf-laranja-escuro` | `#C96D0A` | Hover de elementos laranja |
| `brf-amarelo` | `#FFCB05` | Avisos, status PENDENTE |
| `brf-salmao` | `#FFE6CB` | Fundos leves, cards de info |
| `brf-cinza` | `#646464` | Textos secundários |
| `brf-cinza-claro` | `#F5F5F5` | Fundos de seções |
| `brf-verde` | `#07A684` | Status CONCLUÍDO, sucesso |
| `brf-azul` | `#0996B6` | Status EM_ANALISE, informações |

---

## 8. Como Contribuir com Agentes

### Criando um novo agente

1. Crie `.github/agents/nome-do-agente.md`
2. Defina: Papel, Stack, Contexto obrigatório, Regras, Formato de resposta, Restrições
3. Adicione entrada na tabela de agentes em `.github/copilot-instructions.md`
4. Crie um ADR se a adição do agente representar uma decisão arquitetural

### Atualizando a memória do projeto

Ao concluir uma sessão de desenvolvimento significativa:

```
@workspace [AGENTE: Documentador]  
Atualize contexto-atual.md, changelog-tecnico.md, backlog-tecnico.md  
e backlog-produto.md com as seguintes mudanças: [descreva o que foi feito]
```

### Iniciando uma nova sessão

```
@workspace Leia docs/memoria/contexto-atual.md e me diga onde o projeto está.  
Depois vamos com [AGENTE: Dev Backend] implementar [feature X].
```

---

_Documento gerado pelo Agente Documentador — EncerraDigital BRF | 2026-04-06_  
_Referência: `.github/copilot-instructions.md`, `.github/agents/`_
