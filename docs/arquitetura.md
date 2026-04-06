# Arquitetura do Sistema — EncerraDigital BRF

**Última atualização**: 2026-04-05  
**Responsável**: Arquiteto de Software  
**Status**: Em definição (Fase 0)

---

## Visão Geral

O EncerraDigital é um sistema web para digitalização da jornada de encerramento de conta corrente 
do Banco Regional de Fomento, composto por dois módulos independentes integrados por uma API backend.

```
[Cliente Final]
      |
      ↓
[frontend-cliente]  (Next.js — público)
      |
      ↓ HTTPS
[backend — API BFF]  (NestJS — restrito)
      |         \
      ↓          ↓
[PostgreSQL]  [MinIO/S3]   [CSVs de catálogo]   [Sistemas internos BRF]
      ↑
[frontend-interno]  (Next.js — rede interna / VPN)
      ↑
[Operador Interno]
```

---

## Módulos

### frontend-cliente
- **Tipo**: Aplicação Next.js pública (App Router)
- **Usuário**: Cliente final do banco
- **Função**: Chatbot guiado + formulário de encerramento, geração de preview do termo, 
  upload do termo assinado via gov.br
- **Não faz**: Consultar dados internos da conta, autenticar via sistemas bancários

### frontend-interno
- **Tipo**: Aplicação Next.js restrita
- **Usuário**: Operadores internos do BRF
- **Função**: Listar e tratar solicitações, verificar documentos, integrar com sistemas internos
- **Acesso**: Somente via rede interna / VPN + autenticação OIDC/SAML corporativo

### backend (API BFF)
- **Tipo**: API REST — NestJS + TypeScript
- **Função**:  
  - Receber e validar solicitações do módulo cliente  
  - Servir catálogos (motivos, agências) a partir de CSVs  
  - Armazenar solicitações e documentos (PostgreSQL + MinIO)  
  - Expor endpoints protegidos para o módulo interno  
  - Integrar com sistemas internos do BRF (via adapters isolados)
- **Nunca**: Expõe dados internos ao frontend-cliente

---

## Estrutura de Pastas do Monorepo

```
EncerraDigital/
├── .devcontainer/          # Configuração Dev Container (VS Code)
├── .github/
│   ├── copilot-instructions.md   # Instruções globais da IA
│   ├── agents/                   # Agentes especializados de IA
│   └── workflows/                # GitHub Actions (CI/CD)
├── frontend-cliente/       # App Next.js — público
├── frontend-interno/       # App Next.js — interno
├── backend/                # API NestJS
├── data/                   # CSVs de catálogo (sem dados sensíveis)
├── infra/                  # Docker Compose, scripts, configurações
├── docs/                   # Toda documentação do projeto
└── README.md
```

---

## Camadas do Backend

```
Request HTTP
    ↓
[Controller]         ← Recebe, valida DTO, delega
    ↓
[Service]            ← Lógica de negócio, orquestra
    ↓
[Repository]         ← Acesso a dados (Prisma)
    ↓
[PostgreSQL / MinIO]
```

Integração com sistemas externos:
```
[Service]
    ↓
[Adapter (Interface)]
    ↓
[Implementação concreta do sistema externo]
```

---

## Modelos de Dados (rascunho inicial)

### Tabela: solicitacoes
| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | PK |
| numero_protocolo | VARCHAR | Gerado automaticamente |
| agencia | VARCHAR | Código da agência |
| numero_conta | VARCHAR | Número da conta (criptografado) |
| titular_nome | VARCHAR | Nome do titular (criptografado) |
| motivo_encerramento | VARCHAR | De catálogo (CSV) |
| status | ENUM | pendente, em_analise, concluido, cancelado |
| aceite_termos_versao | VARCHAR | Versão dos termos aceitos |
| aceite_termos_timestamp | TIMESTAMP | Data/hora do aceite |
| criado_em | TIMESTAMP | Data de criação |
| atualizado_em | TIMESTAMP | Data de atualização |

### Tabela: documentos
| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | PK |
| solicitacao_id | UUID | FK → solicitacoes |
| tipo | ENUM | termo_gerado, termo_assinado |
| caminho_storage | VARCHAR | Referência ao objeto no MinIO/S3 |
| hash_sha256 | VARCHAR | Hash de integridade |
| criado_em | TIMESTAMP | Data de armazenamento |

### Tabela: log_acesso_dados
| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | PK |
| usuario_interno_id | UUID | FK → usuarios_internos |
| solicitacao_id | UUID | FK → solicitacoes |
| acao | VARCHAR | Ação realizada |
| timestamp | TIMESTAMP | Momento do acesso |
| ip_origem | VARCHAR | IP mascarado |

---

## Decisões Arquiteturais
Ver `docs/adr/README.md` para índice completo de ADRs.
