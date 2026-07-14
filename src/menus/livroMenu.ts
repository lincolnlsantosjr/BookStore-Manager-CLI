import * as readline from "readline";
import { perguntar, pausar } from "../utils/input";
import { LivroController } from "../controllers/livroController";
import { BaseMenu } from "./baseMenu";

export class LivroMenu extends BaseMenu {
  private livroController: LivroController;

  constructor(private rl: readline.Interface) {
    super();
    this.livroController = new LivroController(rl);
  }

  async iniciar(): Promise<void> {
    let voltar = false;
    while (!voltar) {
      this.exibirMenu();
      const opcao = await perguntar(this.rl, "Escolha uma opção: ");

      try {
        switch (opcao) {
          case "1":
            await this.livroController.cadastrar();
            await pausar(this.rl);
            break;
          case "2":
            await this.livroController.listar();
            await pausar(this.rl);
            break;
          case "3":
            await this.livroController.consultar();
            await pausar(this.rl);
            break;
          case "4":
            await this.livroController.atualizar();
            await pausar(this.rl);
            break;
          case "5":
            await this.livroController.remover();
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
    console.log("\n===== MENU LIVROS =====");
    console.log("1 - Cadastrar livro");
    console.log("2 - Listar livros");
    console.log("3 - Consultar livro por ID");
    console.log("4 - Atualizar livro");
    console.log("5 - Remover livro");
    console.log("0 - Voltar ao menu principal");
  }
}
