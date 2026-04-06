import {
  criptografarCampo,
  descriptografarCampo,
  gerarHashSha256,
  gerarNumeroProtocolo,
  mascararIp,
} from './seguranca.util';

/** Chave de 32 caracteres para uso exclusivo nos testes. */
const CHAVE_TESTE = '12345678901234567890123456789012';

describe('seguranca.util', () => {
  describe('criptografia AES-256-CBC', () => {
    it('deve criptografar e descriptografar um valor corretamente', () => {
      const original = '12345-6';
      const cifrado = criptografarCampo(original, CHAVE_TESTE);
      expect(cifrado).not.toBe(original);
      expect(descriptografarCampo(cifrado, CHAVE_TESTE)).toBe(original);
    });

    it('deve gerar cifrados diferentes para o mesmo valor (IV aleatório)', () => {
      const v1 = criptografarCampo('conta-teste', CHAVE_TESTE);
      const v2 = criptografarCampo('conta-teste', CHAVE_TESTE);
      expect(v1).not.toBe(v2); // IV diferente a cada chamada
    });

    it('deve lançar erro ao descriptografar dado corrompido (IV inválido)', () => {
      expect(() => descriptografarCampo('semchave-invalido', CHAVE_TESTE)).toThrow();
    });
  });

  describe('gerarHashSha256', () => {
    it('deve gerar hash de 64 caracteres hexadecimais', () => {
      const hash = gerarHashSha256(Buffer.from('dados de teste'));
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it('deve gerar hashes diferentes para entradas diferentes', () => {
      const h1 = gerarHashSha256(Buffer.from('a'));
      const h2 = gerarHashSha256(Buffer.from('b'));
      expect(h1).not.toBe(h2);
    });

    it('deve gerar o mesmo hash para a mesma entrada (determinístico)', () => {
      const buf = Buffer.from('conteudo-fixo-12345');
      expect(gerarHashSha256(buf)).toBe(gerarHashSha256(buf));
    });
  });

  describe('gerarNumeroProtocolo', () => {
    it('deve seguir o formato ENC-YYYY-NNNNNN', () => {
      const protocolo = gerarNumeroProtocolo();
      const anoAtual = new Date().getFullYear().toString();
      expect(protocolo).toMatch(new RegExp(`^ENC-${anoAtual}-\\d{6}$`));
    });

    it('deve gerar protocolos únicos em chamadas consecutivas', () => {
      const protocolos = Array.from({ length: 10 }, () => gerarNumeroProtocolo());
      const unicos = new Set(protocolos);
      expect(unicos.size).toBe(10);
    });
  });

  describe('mascararIp', () => {
    it('deve mascarar os dois últimos octetos de IPv4', () => {
      expect(mascararIp('192.168.1.100')).toBe('192.168.*.*');
    });

    it('deve retornar "***" para IP com formato inválido', () => {
      expect(mascararIp('')).toBe('***');
      expect(mascararIp('nao-e-um-ip')).toBe('***');
    });
  });
});
