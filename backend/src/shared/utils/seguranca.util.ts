import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'crypto';

const ALGORITMO = 'aes-256-cbc';

/**
 * Gera um número de protocolo único para a solicitação de encerramento.
 * Formato: ENC-{ANO}-{NUMERO_ALEATORIO_6_DIGITOS}
 */
export function gerarNumeroProtocolo(): string {
  const ano = new Date().getFullYear();
  const aleatorio = Math.floor(100000 + Math.random() * 900000);
  return `ENC-${ano}-${aleatorio}`;
}

/**
 * Mascara os dois últimos octetos de um endereço IPv4 para conformidade com LGPD.
 * Exemplo: 192.168.1.100 → 192.168.**.*
 */
export function mascararIp(ip: string): string {
  const partes = ip.split('.');
  if (partes.length === 4) return `${partes[0]}.${partes[1]}.*.*`;
  return '***';
}

/**
 * Criptografa um campo usando AES-256-CBC com IV aleatório.
 * Retorna o resultado no formato "iv_hex:dados_hex".
 * A chave deve ter exatamente 32 caracteres.
 */
export function criptografarCampo(valor: string, chave: string): string {
  const chaveBuffer = Buffer.from(chave.substring(0, 32), 'utf-8');
  const iv = randomBytes(16);
  const cifra = createCipheriv(ALGORITMO, chaveBuffer, iv);
  const criptografado = Buffer.concat([cifra.update(valor, 'utf-8'), cifra.final()]);
  return `${iv.toString('hex')}:${criptografado.toString('hex')}`;
}

/**
 * Descriptografa um campo previamente criptografado com criptografarCampo.
 */
export function descriptografarCampo(valorCriptografado: string, chave: string): string {
  const [ivHex, dadosHex] = valorCriptografado.split(':');
  const chaveBuffer = Buffer.from(chave.substring(0, 32), 'utf-8');
  const iv = Buffer.from(ivHex, 'hex');
  const decifra = createDecipheriv(ALGORITMO, chaveBuffer, iv);
  const decriptografado = Buffer.concat([
    decifra.update(Buffer.from(dadosHex, 'hex')),
    decifra.final(),
  ]);
  return decriptografado.toString('utf-8');
}

/**
 * Gera hash SHA-256 de um buffer de bytes.
 * Utilizado para verificar integridade de arquivos enviados.
 */
export function gerarHashSha256(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex');
}
