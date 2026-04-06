# ADR-005 — Paleta de Cores Oficial BRF (Vermelho #A6193C + Laranja #F68B1F)

**Data**: 2026-04-05  
**Status**: Aceita  
**Autores**: Equipe EncerraDigital

## Contexto

O protótipo inicial do sistema utilizava a cor azul (#003087 / #0055B8) como cor primária, 
sem vinculação com o Manual de Identidade Visual oficial do Banco Regional de Fomento (BRF). 
Uma revisão de conformidade identificou que o BRF possui paleta própria definida em seu 
Manual de Identidade Visual, com vermelho e laranja como cores institucionais primárias.
A paleta incorreta comprometia a legitimidade da solução perante stakeholders internos do banco.

## Decisão

Substituir completamente a paleta azul pela paleta oficial do Paleta Banco Regional de Fomento 
em todos os módulos (`frontend-cliente`, `frontend-interno`, `backend/pdf.service.ts`).

**Tokens Tailwind CSS definidos**:

| Token | Valor HEX | Uso |
|---|---|---|
| `brf-vermelho` | `#A6193C` | Cor primária: headers, botões, destaques |
| `brf-vermelho-escuro` | `#7A1228` | Hover de elementos primários |
| `brf-laranja` | `#F68B1F` | Cor secundária: faixas decorativas, destaques secundários |
| `brf-laranja-escuro` | `#C96D0A` | Hover de elementos secundários |
| `brf-amarelo` | `#FFCB05` | Acentos e alertas |
| `brf-salmao` | `#FFE6CB` | Fundos suaves e cards |
| `brf-cinza` | `#646464` | Texto secundário |
| `brf-cinza-claro` | `#F5F5F5` | Fundos de seções e formulários |
| `brf-verde` | `#07A684` | Indicadores de sucesso |
| `brf-azul` | `#0996B6` | Informação e links |

**PDF**: cabeçalho usa `rgb(0.651, 0.098, 0.235)` (vermelho BRF) e `rgb(0.965, 0.545, 0.122)` (laranja BRF) via `pdf-lib`.

## Consequências

- ✅ Identidade visual alinhada ao Manual de Identidade Visual oficial do BRF
- ✅ Maior credibilidade e aceitação pelos stakeholders internos do banco
- ✅ Conformidade visual entre `frontend-cliente`, `frontend-interno` e PDF gerado
- ✅ Paleta centralizada em `tailwind.config.ts` / `tailwind.config.mjs` — fácil manutenção
- ⚠️ Todas as referências a cores `brf-azul`/`brf-azul-claro` anteriores precisaram ser migradas manualmente

## Alternativas descartadas

- **Manter azul**: descartado por não ser a cor institucional do BRF — comprometeria a legitimidade do produto perante o banco
- **Usar CSS variables globais em vez de tokens Tailwind**: descartado por baixa integração com o fluxo de desenvolvimento já estabelecido com TailwindCSS
