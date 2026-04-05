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
}
