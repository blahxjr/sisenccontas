# ADR-007 — Route Group `(main)` para Isolamento de Layout no Frontend-Cliente

**Data**: 2026-04-05  
**Status**: Aceita  
**Autores**: Equipe EncerraDigital

## Contexto

O `frontend-cliente` precisava suportar duas experiências visuais distintas:

1. **Layout padrão** (`header vermelho BRF + footer + max-w-4xl`): usado nas páginas de negócio 
   (`/`, `/encerramento/formulario`, `/encerramento/status`).
2. **Layout standalone** (sem header/footer, tela cheia): usado exclusivamente pela página `/demo`, 
   criada para apresentação a stakeholders.

O `layout.tsx` raiz do Next.js App Router aplica o layout a todas as rotas filhas. 
Envolver a lógica condicional de header/footer no layout raiz com base na rota atual 
violaria o princípio de separação de responsabilidades e tornaria o código frágil.

## Decisão

Utilizar **Route Groups** do Next.js App Router para segmentar as rotas por contexto de layout:

```
src/app/
  (main)/           ← Route Group: layout com header/footer BRF
    layout.tsx      ← Header vermelho + footer + max-w-4xl
    page.tsx        ← Rota: /
    encerramento/
      formulario/
        page.tsx    ← Rota: /encerramento/formulario
      status/
        page.tsx    ← Rota: /encerramento/status
  demo/             ← Rota direta (sem Route Group)
    page.tsx        ← Rota: /demo (standalone, sem header/footer)
  layout.tsx        ← Layout raiz: apenas providers globais e <html>/<body>
  globals.css
```

O nome `(main)` com parênteses **não compõe a URL** — `/`, `/encerramento/formulario` e 
`/encerramento/status` funcionam normalmente sem o segmento `(main)` na URL.

## Consequências

- ✅ Separação clara entre rotas com layout institucional e rotas standalone
- ✅ `layout.tsx` raiz permanece limpo (apenas providers globais)
- ✅ Facilita adicionar novas rotas standalone no futuro sem modificar o layout principal
- ✅ Padrão oficial do Next.js App Router — sem hacks ou workarounds
- ⚠️ Desenvolvedores novos devem entender a convenção de Route Groups do Next.js para navegar corretamente na estrutura de pastas

## Alternativas descartadas

- **Lógica condicional no `layout.tsx` raiz** (verificar `usePathname()` para esconder header): descartado por misturar responsabilidades e exigir `"use client"` no layout raiz
- **`_document.tsx` customizado** (padrão Pages Router): não aplicável ao App Router
- **Componente `ConditionalLayout` wrapper**: descartado por adicionar indireção desnecessária quando o Next.js possui solução nativa via Route Groups
