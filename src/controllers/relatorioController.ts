import * as readline from "readline";
import { RelatorioService } from "../services/relatorioService";
import { formatarData } from "../utils/validations";

export class RelatorioController {
  constructor(
    private rl: readline.Interface,
    private relatorioService: RelatorioService = new RelatorioService(),
  ) {}

  async livrosDisponiveis(): Promise<void> {
    console.log("\n--- Relatório: Livros Disponíveis ---");
    const dados = await this.relatorioService.livrosDisponiveis();
    if (dados.length === 0) {
      console.log("Nenhum livro disponível.");
      return;
    }
    console.table(
      dados.map((d) => ({
        ID: d.id,
        Título: d.titulo,
        Autor: d.nome_autor,
        Disponível: d.quantidade_disponivel,
      })),
    );
  }

  async livrosEmprestados(): Promise<void> {
    console.log("\n--- Relatório: Livros Emprestados ---");
    const dados = await this.relatorioService.livrosEmprestados();
    if (dados.length === 0) {
      console.log("Nenhum livro emprestado no momento.");
      return;
    }
    console.table(
      dados.map((d) => ({
        ID: d.id,
        Título: d.titulo,
        Cliente: d.nome_cliente,
        "Data Empréstimo": formatarData(d.data_emprestimo),
      })),
    );
  }

  async livrosCadastradosPorAutor(): Promise<void> {
    console.log("\n--- Relatório: Livros Cadastrados por Autor ---");
    const dados = await this.relatorioService.livrosCadastradosPorAutor();
    if (dados.length === 0) {
      console.log("Nenhum autor cadastrado.");
      return;
    }
    console.table(
      dados.map((d) => ({
        Autor: d.nome_autor,
        "Total de Livros": d.total_livros,
      })),
    );
  }

  async quantidadeEmprestimosPorLivro(): Promise<void> {
    console.log("\n--- Relatório: Empréstimos por Livro ---");
    const dados = await this.relatorioService.quantidadeEmprestimosPorLivro();
    if (dados.length === 0) {
      console.log("Nenhum livro cadastrado.");
      return;
    }
    console.table(
      dados.map((d) => ({
        Título: d.titulo,
        "Total de Empréstimos": d.total_emprestimos,
      })),
    );
  }

  async clientesComEmprestimosAtivos(): Promise<void> {
    console.log("\n--- Relatório: Clientes com Empréstimos Ativos ---");
    const dados = await this.relatorioService.clientesComEmprestimosAtivos();
    if (dados.length === 0) {
      console.log("Nenhum cliente com empréstimos ativos.");
      return;
    }
    console.table(
      dados.map((d) => ({
        Cliente: d.nome_cliente,
        Email: d.email,
        "Empréstimos Ativos": d.emprestimos_ativos,
      })),
    );
  }
}
