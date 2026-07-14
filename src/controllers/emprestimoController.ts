import * as readline from "readline";
import { perguntar } from "../utils/input";
import { EmprestimoService } from "../services/emprestimoService";
import { parseIntOrNull, formatarData } from "../utils/validations";
import { ErroNegocio } from "../utils/erros";

export class EmprestimoController {
  constructor(
    private rl: readline.Interface,
    private emprestimoService: EmprestimoService = new EmprestimoService(),
  ) {}

  async registrarEmprestimo(): Promise<void> {
    console.log("\n--- Registrar Empréstimo ---");
    const livroIdStr = await perguntar(this.rl, "ID do livro: ");
    const clienteIdStr = await perguntar(this.rl, "ID do cliente: ");

    const livroId = parseIntOrNull(livroIdStr);
    const clienteId = parseIntOrNull(clienteIdStr);
    if (livroId === null || clienteId === null)
      throw new ErroNegocio("IDs inválidos.");

    const emprestimo = await this.emprestimoService.realizarEmprestimo(
      livroId,
      clienteId,
    );
    console.log(`\nEmpréstimo registrado com sucesso! ID: ${emprestimo.id}`);
  }

  async registrarDevolucao(): Promise<void> {
    console.log("\n--- Registrar Devolução ---");
    const idStr = await perguntar(this.rl, "ID do empréstimo: ");
    const id = parseIntOrNull(idStr);
    if (id === null) throw new ErroNegocio("ID inválido.");

    await this.emprestimoService.registrarDevolucao(id);
    console.log("\nDevolução registrada com sucesso!");
  }

  async consultar(): Promise<void> {
    console.log("\n--- Lista de Empréstimos ---");
    const emprestimos = await this.emprestimoService.listar();
    if (emprestimos.length === 0) {
      console.log("Nenhum empréstimo registrado.");
      return;
    }
    console.table(
      emprestimos.map((e) => ({
        ID: e.id,
        Livro: e.tituloLivro,
        Cliente: e.nomeCliente,
        "Data Empréstimo": formatarData(e.dataEmprestimo),
        "Data Devolução": formatarData(e.dataDevolucao),
        Status: e.status,
      })),
    );
  }
}
