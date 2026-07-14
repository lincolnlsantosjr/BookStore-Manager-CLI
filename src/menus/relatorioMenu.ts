import * as readline from "readline";
import { perguntar, pausar } from "../utils/input";
import { RelatorioController } from "../controllers/relatorioController";
import { BaseMenu } from "./baseMenu";

export class RelatorioMenu extends BaseMenu {
  private relatorioController: RelatorioController;

  constructor(private rl: readline.Interface) {
    super();
    this.relatorioController = new RelatorioController(rl);
  }

  async iniciar(): Promise<void> {
    let voltar = false;
    while (!voltar) {
      this.exibirMenu();
      const opcao = await perguntar(this.rl, "Escolha uma opção: ");

      try {
        switch (opcao) {
          case "1":
            await this.relatorioController.livrosDisponiveis();
            await pausar(this.rl);
            break;
          case "2":
            await this.relatorioController.livrosEmprestados();
            await pausar(this.rl);
            break;
          case "3":
            await this.relatorioController.livrosCadastradosPorAutor();
            await pausar(this.rl);
            break;
          case "4":
            await this.relatorioController.quantidadeEmprestimosPorLivro();
            await pausar(this.rl);
            break;
          case "5":
            await this.relatorioController.clientesComEmprestimosAtivos();
            await pausar(this.rl);
            break;
          case "0":
            voltar = true;
            break;
          default:
            console.log("Opção inválida. Tente novamente.");
        }
      } catch (erro) {
        this.tratarErro(erro);
        await pausar(this.rl);
      }
    }
  }

  private exibirMenu(): void {
    console.log("\n===== MENU RELATÓRIOS =====");
    console.log("1 - Livros disponíveis");
    console.log("2 - Livros emprestados");
    console.log("3 - Livros cadastrados por autor");
    console.log("4 - Quantidade de empréstimos por livro");
    console.log("5 - Clientes com empréstimos ativos");
    console.log("0 - Voltar ao menu principal");
  }
}
