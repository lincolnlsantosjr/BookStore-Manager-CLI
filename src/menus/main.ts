import * as readline from "readline";
import { perguntar } from "../utils/input";
import { AutorMenu } from "./autorMenu";
import { LivroMenu } from "./livroMenu";
import { ClienteMenu } from "./clienteMenu";
import { EmprestimoMenu } from "./emprestimoMenu";
import { RelatorioMenu } from "./relatorioMenu";

export class MainMenu {
  private autorMenu: AutorMenu;
  private livroMenu: LivroMenu;
  private clienteMenu: ClienteMenu;
  private emprestimoMenu: EmprestimoMenu;
  private relatorioMenu: RelatorioMenu;

  constructor(private rl: readline.Interface) {
    this.autorMenu = new AutorMenu(rl);
    this.livroMenu = new LivroMenu(rl);
    this.clienteMenu = new ClienteMenu(rl);
    this.emprestimoMenu = new EmprestimoMenu(rl);
    this.relatorioMenu = new RelatorioMenu(rl);
  }

  async iniciar(): Promise<void> {
    let encerrar = false;

    while (!encerrar) {
      console.log("\n===================================");
      console.log("   BOOKSTORE MANAGER CLI");
      console.log("===================================");
      console.log("1 - Autores");
      console.log("2 - Livros");
      console.log("3 - Clientes");
      console.log("4 - Empréstimos");
      console.log("5 - Relatórios");
      console.log("0 - Encerrar aplicação");

      const opcao = await perguntar(this.rl, "Escolha uma opção: ");

      switch (opcao) {
        case "1":
          await this.autorMenu.iniciar();
          break;
        case "2":
          await this.livroMenu.iniciar();
          break;
        case "3":
          await this.clienteMenu.iniciar();
          break;
        case "4":
          await this.emprestimoMenu.iniciar();
          break;
        case "5":
          await this.relatorioMenu.iniciar();
          break;
        case "0":
          encerrar = true;
          console.log("\nEncerrando a aplicação. Até logo!");
          break;
        default:
          console.log("Opção inválida. Tente novamente.");
      }
    }
  }
}
