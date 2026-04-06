import { Test } from '@nestjs/testing';
import { CatalogosService } from './catalogos.service';

describe('CatalogosService', () => {
  let service: CatalogosService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CatalogosService],
    }).compile();
    await module.init(); // Dispara onModuleInit → carrega CSVs
    service = module.get<CatalogosService>(CatalogosService);
  });

  it('deve carregar exatamente 7 motivos de encerramento', () => {
    const motivos = service.listarMotivos();
    expect(motivos).toHaveLength(7);
  });

  it('todos os motivos devem ter codigo e descricao', () => {
    service.listarMotivos().forEach((m) => {
      expect(m.codigo).toBeTruthy();
      expect(m.descricao).toBeTruthy();
    });
  });

  it('deve retornar 300 agências BRF no total', () => {
    const agencias = service.listarAgencias();
    expect(agencias.length).toBe(300);
  });

  it('deve filtrar agências por UF corretamente', () => {
    const agenciasMa = service.listarAgencias({ uf: 'MA' });
    expect(agenciasMa.length).toBeGreaterThanOrEqual(1);
    agenciasMa.forEach((a) => expect(a.uf).toBe('MA'));
  });

  it('deve retornar 13 UFs com agências BRF', () => {
    const ufs = service.listarUfs();
    expect(ufs).toHaveLength(13);
  });

  it('deve buscar agência por código exato', () => {
    const agencia = service.buscarAgenciaPorCodigo('81');
    expect(agencia).not.toBeUndefined();
    expect(agencia?.codigo).toBe('81');
  });

  it('deve retornar undefined para código inexistente', () => {
    const agencia = service.buscarAgenciaPorCodigo('9999');
    expect(agencia).toBeUndefined();
  });

  it('busca por texto deve ser case-insensitive', () => {
    const r1 = service.listarAgencias({ busca: 'fortaleza' });
    const r2 = service.listarAgencias({ busca: 'FORTALEZA' });
    expect(r1.length).toBe(r2.length);
    expect(r1.length).toBeGreaterThan(0);
  });
});
