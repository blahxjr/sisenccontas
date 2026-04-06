import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

export interface IMotivo {
  codigo: string;
  descricao: string;
}

export interface IAgencia {
  codigo: string;
  nome: string;
  municipio: string;
  uf: string;
  cep: string;
  endereco: string;
  bairro: string;
  ddd: string;
  telefone: string;
}

/**
 * Serviço de catálogos — carrega dados dos CSVs de referência na inicialização.
 * Dados oficiais de agências obtidos via API pública do Banco Central (ODbL).
 * Fonte: https://olinda.bcb.gov.br/olinda/servico/Informes_Agencias/versao/v1
 * Total de agências BRF: 300 | Atualizado em: 05/04/2026
 */
@Injectable()
export class CatalogosService implements OnModuleInit {
  private readonly logger = new Logger(CatalogosService.name);
  private motivos: IMotivo[] = [];
  private agencias: IAgencia[] = [];

  onModuleInit() {
    this.carregarCatalogos();
  }

  private caminhoData(): string {
    // process.cwd() é sempre o diretório onde o processo foi iniciado (backend/)
    // independente de ts-node, dist/src, ou dist — monorepo root está 1 nível acima
    return join(process.cwd(), '..', 'data');
  }

  /** Parseia CSV com suporte a linhas de comentário (#) */
  private lerCsv<T>(nomeArquivo: string, campos: (keyof T)[]): T[] {
    try {
      const conteudo = readFileSync(join(this.caminhoData(), nomeArquivo), 'utf-8');
      const linhas = conteudo
        .split('\n')
        .filter((l) => l.trim() && !l.startsWith('#') && !l.startsWith('codigo,'));

      return linhas.map((linha) => {
        const valores = linha.split(',').map((v) => v.trim().replace(/"/g, ''));
        return campos.reduce((obj, campo, i) => {
          (obj as Record<string, string>)[campo as string] = valores[i] ?? '';
          return obj;
        }, {} as T);
      });
    } catch (erro) {
      this.logger.warn(`⚠️ Não foi possível carregar "${nomeArquivo}": ${(erro as Error).message}`);
      return [];
    }
  }

  private carregarCatalogos() {
    this.motivos = this.lerCsv<IMotivo>('motivos_encerramento.csv', ['codigo', 'descricao']);
    this.agencias = this.lerCsv<IAgencia>('agencias.csv', [
      'codigo', 'nome', 'municipio', 'uf', 'cep', 'endereco', 'bairro', 'ddd', 'telefone',
    ]);
    this.logger.log(
      `✅ Catálogos carregados — Motivos: ${this.motivos.length} | Agências BRF: ${this.agencias.length}`,
    );
  }

  listarMotivos(): IMotivo[] {
    return this.motivos;
  }

  listarAgencias(filtros?: { uf?: string; busca?: string }): IAgencia[] {
    let resultado = this.agencias;
    if (filtros?.uf) {
      const uf = filtros.uf.toUpperCase();
      resultado = resultado.filter((a) => a.uf === uf);
    }
    if (filtros?.busca) {
      const termo = filtros.busca.toLowerCase();
      resultado = resultado.filter(
        (a) =>
          a.nome.toLowerCase().includes(termo) ||
          a.municipio.toLowerCase().includes(termo),
      );
    }
    return resultado;
  }

  listarUfs(): string[] {
    return [...new Set(this.agencias.map((a) => a.uf))].sort();
  }

  buscarAgenciaPorCodigo(codigo: string): IAgencia | undefined {
    return this.agencias.find((a) => a.codigo === codigo);
  }
}
