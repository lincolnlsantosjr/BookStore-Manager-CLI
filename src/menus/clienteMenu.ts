import * as readline from "readline";
import { perguntar, pausar } from "../utils/input";
import { ClienteController } from "../controllers/clienteController";
import { BaseMenu } from "./baseMenu";

export class ClienteMenu extends BaseMenu {
  private clienteController: ClienteController;

  constructor(private rl: readline.Interface) {
    super();
    this.clienteController = new ClienteController(rl);
  }

  async iniciar(): Promise<void> {
    let voltar = false;
    while (!voltar) {
      this.exibirMenu();
      const opcao = await perguntar(this.rl, "Escolha uma opção: ");

      try {
        switch (opcao) {
          case "1":
            await this.clienteController.cadastrar();
            await pausar(this.rl);
            break;
          case "2":
            await this.clienteController.listar();
            await pausar(this.rl);
            break;
          case "3":
            await this.clienteController.consultar();
            await pausar(this.rl);
            break;
          case "4":
            await this.clienteController.atualizar();
            await pausar(this.rl);
            break;
          case "5":
            await this.clienteController.remover();
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
    console.log("\n===== MENU CLIENTES =====");
    console.log("1 - Cadastrar cliente");
    console.log("2 - Listar clientes");
    console.log("3 - Consultar cliente por ID");
    console.log("4 - Atualizar cliente");
    console.log("5 - Remover cliente");
    console.log("0 - Voltar ao menu principal");
  }
}
