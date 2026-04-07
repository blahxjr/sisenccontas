# Memória — ChatbotEncerramento

> Arquivo de memória persistente do agente. Atualizar a cada evolução
> significativa do componente.

## Status

- Versão: 1.0
- Data: 2026-04-07
- Localização: `frontend-cliente/src/components/encerramento/ChatbotEncerramento.tsx`

## Decisões de arquitetura

- Padrão de "máquina de passos" escolhido por simplicidade e testabilidade
- Passos condicionais implementados via propriedade `condicao` no array,
  evitando lógica dispersa no componente
- Schema Zod compartilhado via `encerramento-schema.ts` para garantir
  consistência com FormularioEncerramento
- Dados sensíveis: número de conta exibido apenas com últimos 3 dígitos
  (conformidade LGPD)

## Fluxo de passos

| id                    | field                 | tipo         | condicional                  |
| --------------------- | --------------------- | ------------ | ---------------------------- |
| boas-vindas           | null                  | button-group | -                            |
| uf                    | uf                    | select       | -                            |
| agencia               | agencia               | select       | -                            |
| numero-conta          | numeroConta           | text         | -                            |
| titular               | titularNome           | text         | -                            |
| motivo                | motivoEncerramento    | button-group | -                            |
| possui-cheque         | possuiCheque          | button-group | -                            |
| numero-cheque         | numeroChequeDevolvido | text         | possuiCheque === true        |
| possui-saldo          | possuiSaldoPositivo   | button-group | -                            |
| banco-transferencia   | bancoTransferencia    | text         | possuiSaldoPositivo === true |
| agencia-transferencia | agenciaTransferencia  | text         | possuiSaldoPositivo === true |
| conta-transferencia   | contaTransferencia    | text         | possuiSaldoPositivo === true |
| endereco              | enderecoCliente       | text         | -                            |
| email                 | emailCliente          | text         | -                            |
| resumo-aceite         | aceitouTermos         | confirm      | -                            |

## Próximos agentes que trabalharem aqui devem saber

- O array `passos` é a fonte de verdade do fluxo — não dispersar lógica
  de navegação fora dele
- Para adicionar um novo passo: inserir no array na posição correta e
  definir `condicao` se necessário
- A tela de sucesso é reutilizada de FormularioEncerramento — não duplicar
- O componente NÃO usa localStorage (sandbox/LGPD) — estado em memória
