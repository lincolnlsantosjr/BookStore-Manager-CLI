import * as readline from "readline";
import { perguntar, pausar } from "../utils/input";
import { EmprestimoController } from "../controllers/emprestimoController";
import { BaseMenu } from "./baseMenu";

export class EmprestimoMenu extends BaseMenu {
  private emprestimoController: EmprestimoController;

  constructor(private rl: readline.Interface) {
    super();
    this.emprestimoController = new EmprestimoController(rl);
  }

  async iniciar(): Promise<void> {
    let voltar = false;
    while (!voltar) {
      this.exibirMenu();
      const opcao = await perguntar(this.rl, "Escolha uma opção: ");

      try {
        switch (opcao) {
          case "1":
            await this.emprestimoController.registrarEmprestimo();
            await pausar(this.rl);
            break;
          case "2":
            await this.emprestimoController.registrarDevolucao();
            await pausar(this.rl);
            break;
          case "3":
            await this.emprestimoController.consultar();
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
    console.log("\n===== MENU EMPRÉSTIMOS =====");
    console.log("1 - Registrar empréstimo");
    console.log("2 - Registrar devolução");
    console.log("3 - Consultar empréstimos");
    console.log("0 - Voltar ao menu principal");
  }
}
