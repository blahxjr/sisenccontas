import { Test } from '@nestjs/testing';
import { DocumentosService } from './documentos.service';
import { DocumentosRepository } from './documentos.repository';
import { MinioService } from '../../shared/minio/minio.service';
import { PdfService } from '../../shared/pdf/pdf.service';
import { BadRequestException } from '@nestjs/common';

// Mocks
const mockRepo = {
  registrar: jest.fn(),
  listarPorSolicitacao: jest.fn(),
  buscarPorId: jest.fn(),
};
const mockMinio = {
  upload: jest.fn(),
  gerarUrlPresignada: jest.fn().mockResolvedValue('http://minio/url-presignada'),
  bucket: 'test-bucket',
};
const mockPdf = {
  gerarTermoEncerramento: jest.fn().mockResolvedValue(Buffer.from('%PDFfake')),
};

describe('DocumentosService — validação de upload', () => {
  let service: DocumentosService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DocumentosService,
        { provide: DocumentosRepository, useValue: mockRepo },
        { provide: MinioService, useValue: mockMinio },
        { provide: PdfService, useValue: mockPdf },
      ],
    }).compile();
    service = module.get<DocumentosService>(DocumentosService);
  });

  afterEach(() => jest.clearAllMocks());

  it('deve rejeitar arquivo maior que 10 MB', async () => {
    const buffer = Buffer.alloc(11 * 1024 * 1024); // 11 MB
    await expect(
      service.receberTermoAssinado('id', buffer, 'teste.pdf', 'application/pdf'),
    ).rejects.toThrow(BadRequestException);
  });

  it('deve rejeitar arquivo que não seja PDF por MIME type', async () => {
    const buffer = Buffer.from('%PDFfake');
    await expect(
      service.receberTermoAssinado('id', buffer, 'malware.exe', 'application/octet-stream'),
    ).rejects.toThrow(BadRequestException);
  });

  it('deve rejeitar arquivo com MIME pdf mas sem assinatura magic %PDF', async () => {
    const buffer = Buffer.from('NOTAPDF content here');
    await expect(
      service.receberTermoAssinado('id', buffer, 'falso.pdf', 'application/pdf'),
    ).rejects.toThrow(BadRequestException);
  });

  it('deve aceitar PDF válido com magic bytes corretos', async () => {
    const buffer = Buffer.concat([Buffer.from('%PDF'), Buffer.alloc(100)]);
    mockRepo.registrar.mockResolvedValue({ id: 'doc-uuid' });
    const resultado = await service.receberTermoAssinado(
      'sol-id',
      buffer,
      'termo.pdf',
      'application/pdf',
    );
    expect(resultado.id).toBe('doc-uuid');
    expect(mockMinio.upload).toHaveBeenCalledTimes(1);
  });
});
