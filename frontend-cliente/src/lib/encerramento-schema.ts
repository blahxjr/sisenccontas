import { z } from "zod";

/**
 * Schema Zod completo para o formulário de encerramento de conta corrente BRF.
 * Conforme normativo BRF-3303-03-11.
 */
export const encerramentoSchema = z.object({
  // Etapa 1 — Dados da conta
  uf: z.string().min(2, "Selecione um estado"),
  agencia: z.string().regex(/^\d+$/, "Selecione uma agência"),
  numeroConta: z
    .string()
    .min(3, "Número de conta muito curto")
    .max(20, "Número de conta muito longo")
    .regex(/^[\d-]+$/, "Apenas números e traço são permitidos"),
  titularNome: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(150, "Nome muito longo"),
  motivoEncerramento: z.string().optional(),
  // Etapa 2 — Informações complementares (BRF-3303-03-11)
  enderecoCliente: z.string().min(10, "Informe seu endereço completo").max(200),
  emailCliente: z
    .string()
    .email("E-mail inválido")
    .optional()
    .or(z.literal("")),
  possuiCheque: z.boolean(),
  numeroChequeDevolvido: z.string().optional(),
  possuiSaldoPositivo: z.boolean(),
  bancoTransferencia: z.string().optional(),
  agenciaTransferencia: z.string().max(10).optional(),
  contaTransferencia: z.string().max(20).optional(),
  // Etapa 3 — Aceite
  aceitouTermos: z.literal(true, {
    errorMap: () => ({ message: "Aceite os termos para continuar" }),
  }),
});

/** Tipo inferido do schema de encerramento de conta. */
export type EnccerramentoFormData = z.infer<typeof encerramentoSchema>;
