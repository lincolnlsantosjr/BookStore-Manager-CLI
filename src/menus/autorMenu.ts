import * as readline from "readline";
import { perguntar, pausar } from "../utils/input";
import { AutorController } from "../controllers/autorController";
import { BaseMenu } from "./baseMenu";

export class AutorMenu extends BaseMenu {
  private autorController: AutorController;

  constructor(private rl: readline.Interface) {
    super();
    this.autorController = new AutorController(rl);
  }

  async iniciar(): Promise<void> {
    let voltar = false;
    while (!voltar) {
      this.exibirMenu();
      const opcao = await perguntar(this.rl, "Escolha uma opção: ");

      try {
        switch (opcao) {
          case "1":
            await this.autorController.cadastrar();
            await pausar(this.rl);
            break;
          case "2":
            await this.autorController.listar();
            await pausar(this.rl);
            break;
          case "3":
            await this.autorController.consultar();
            await pausar(this.rl);
            break;
          case "4":
            await this.autorController.atualizar();
            await pausar(this.rl);
            break;
          case "5":
            await this.autorController.remover();
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
    console.log("\n===== MENU AUTORES =====");
    console.log("1 - Cadastrar autor");
    console.log("2 - Listar autores");
    console.log("3 - Consultar autor por ID");
    console.log("4 - Atualizar autor");
    console.log("5 - Remover autor");
    console.log("0 - Voltar ao menu principal");
  }
}
