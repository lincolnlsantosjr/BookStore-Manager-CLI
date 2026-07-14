import { RelatorioRepository } from "../repositories/relatorioRepository";

export class RelatorioService {
  constructor(
    private relatorioRepository: RelatorioRepository = new RelatorioRepository(),
  ) {}

  async livrosDisponiveis() {
    return this.relatorioRepository.livrosDisponiveis();
  }

  async livrosEmprestados() {
    return this.relatorioRepository.livrosEmprestados();
  }

  async livrosCadastradosPorAutor() {
    return this.relatorioRepository.livrosCadastradosPorAutor();
  }

  async quantidadeEmprestimosPorLivro(limite: number = 10) {
    return this.relatorioRepository.quantidadeEmprestimosPorLivro(limite);
  }

  async clientesComEmprestimosAtivos() {
    return this.relatorioRepository.clientesComEmprestimosAtivos();
  }
}
