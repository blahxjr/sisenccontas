import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsDateString,
  Equals,
  IsBoolean,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para criação de solicitação de encerramento de conta corrente.
 * Validates all user inputs before reaching the service layer.
 */
export class CriarSolicitacaoDto {
  @ApiProperty({ description: 'Código COMPE da agência (até 10 dígitos)', example: '0031' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  agencia: string;

  @ApiProperty({ description: 'Número da conta (apenas dígitos e traço)', example: '12345-6' })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[\d-]+$/, { message: 'Apenas números e traço são permitidos' })
  numeroConta: string;

  @ApiProperty({ description: 'Nome completo do titular conforme cadastro' })
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  titularNome: string;

  @ApiProperty({ required: false, description: 'Código do motivo de encerramento' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  motivoEncerramento?: string;

  @ApiProperty({ description: 'Versão dos termos aceitos', example: '1.0' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  aceiteTermosVersao: string;

  @ApiProperty({ description: 'Timestamp ISO 8601 do momento do aceite dos termos' })
  @IsDateString()
  aceiteTermosTimestamp: string;

  @ApiProperty({ description: 'Confirmação de aceite dos termos — deve ser true' })
  @IsBoolean()
  @Equals(true, { message: 'O aceite dos termos é obrigatório' })
  aceitouTermos: boolean;

  // ── Campos complementares — conformidade normativa 3303-03-11 ─────────────

  @ApiProperty({ required: false, description: 'Endereço atualizado do titular' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  enderecoCliente?: string;

  @ApiProperty({ required: false, description: 'E-mail do titular (criptografado em repouso)' })
  @IsOptional()
  @IsEmail({}, { message: 'E-mail inválido' })
  emailCliente?: string;

  @ApiProperty({ required: false, description: 'Titular movimentou a conta com cheques?' })
  @IsOptional()
  @IsBoolean()
  possuiCheque?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  numeroChequeDevolvido?: string;

  @ApiProperty({ required: false, description: 'Conta possui saldo positivo?' })
  @IsOptional()
  @IsBoolean()
  possuiSaldoPositivo?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  bancoTransferencia?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  agenciaTransferencia?: string;

  @ApiProperty({ required: false, description: 'Conta de destino para transferência do saldo (criptografada em repouso)' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  contaTransferencia?: string;
}
