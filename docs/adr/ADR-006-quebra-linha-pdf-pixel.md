# ADR-006 — Quebra de Linha no PDF por Largura Real de Pixel (`font.widthOfTextAtSize`)

**Data**: 2026-04-05  
**Status**: Aceita  
**Autores**: Equipe EncerraDigital

## Contexto

A primeira implementação do `pdf.service.ts` utilizava o método de contagem de caracteres 
para determinar onde quebrar linhas longas no PDF do Termo de Encerramento. Esse método assume 
que todos os caracteres têm a mesma largura (fonte monoespaçada), o que é falso para fontes 
proporcionais (Helvetica, Times Roman, etc.). O resultado era sobreposição de texto e 
extrapolação das margens em seções do PDF que continham textos jurídicos longos.

Problema identificado no commit `14e1bdf` após geração de Termos reais.

## Decisão

Substituir a contagem de caracteres pelo método `font.widthOfTextAtSize(texto, tamanho)` 
da biblioteca `pdf-lib`, que retorna a **largura real em pontos tipográficos** do texto 
na fonte e tamanho especificados.

**Algoritmo de quebra de linha implementado**:

```typescript
function quebrarTexto(font: PDFFont, texto: string, maxWidth: number, size: number): string[] {
  const palavras = texto.split(' ');
  const linhas: string[] = [];
  let linhaAtual = '';

  for (const palavra of palavras) {
    const tentativa = linhaAtual ? `${linhaAtual} ${palavra}` : palavra;
    if (font.widthOfTextAtSize(tentativa, size) <= maxWidth) {
      linhaAtual = tentativa;
    } else {
      if (linhaAtual) linhas.push(linhaAtual);
      linhaAtual = palavra;
    }
  }
  if (linhaAtual) linhas.push(linhaAtual);
  return linhas;
}
```

**Paginação real** também implementada: nova página criada automaticamente quando `y < 75` 
(margem inferior de 75pt), com rodapé vermelho BRF renderizado em todas as páginas.

**Espaçamentos corrigidos** por tamanho de fonte:
- Fonte 10pt → `y -= 13`
- Fonte 11pt → `y -= 14`
- Fonte 12pt → `y -= 16`

## Consequências

- ✅ Texto nunca extrapola as margens do PDF, independentemente do comprimento
- ✅ Paginação automática elimina corte de conteúdo em documentos longos
- ✅ Rodapé aparece em todas as páginas (requisito do modelo oficial BRF-3303-40-64)
- ✅ Espaçamento proporcional ao tamanho de fonte evita sobreposição entre linhas
- ⚠️ Pequena sobrecarga de processamento: para cada palavra, `widthOfTextAtSize` é chamado — aceitável dado o tamanho típico do Termo de Encerramento

## Alternativas descartadas

- **Contagem de caracteres com limite fixo** (ex.: 80 chars): descartado por produzir sobreposição com fontes proporcionais
- **Biblioteca externa de layout de PDF** (ex.: `pdfmake`, `jsPDF`): descartado para evitar dependência adicional quando `pdf-lib` já oferece a primitiva necessária (`widthOfTextAtSize`)
- **Conversão HTML → PDF** (Puppeteer/Chrome headless): descartado por introduzir dependência pesada de browser no servidor, incompatível com o ambiente containerizado atual
