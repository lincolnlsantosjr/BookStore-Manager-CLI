import * as readline from "readline";
import { perguntar } from "../utils/input";
import { ClienteService } from "../services/clienteService";
import { parseIntOrNull } from "../utils/validations";
import { ErroNegocio } from "../utils/erros";

export class ClienteController {
  constructor(
    private rl: readline.Interface,
    private clienteService: ClienteService = new ClienteService(),
  ) {}

  async cadastrar(): Promise<void> {
    console.log("\n--- Cadastro de Cliente ---");
    const nome = await perguntar(this.rl, "Nome: ");
    const email = await perguntar(this.rl, "E-mail: ");
    const telefone = await perguntar(this.rl, "Telefone (opcional): ");

    const cliente = await this.clienteService.cadastrar({
      nome,
      email,
      telefone: telefone || null,
    });

    console.log(`\nCliente cadastrado com sucesso! ID: ${cliente.id}`);
  }

  async listar(): Promise<void> {
    console.log("\n--- Lista de Clientes ---");
    const clientes = await this.clienteService.listar();
    if (clientes.length === 0) {
      console.log("Nenhum cliente cadastrado.");
      return;
    }
    console.table(
      clientes.map((c) => ({
        ID: c.id,
        Nome: c.nome,
        Email: c.email,
        Telefone: c.telefone ?? "-",
      })),
    );
  }

  async consultar(): Promise<void> {
    const idStr = await perguntar(this.rl, "ID do cliente: ");
    const id = parseIntOrNull(idStr);
    if (id === null) throw new ErroNegocio("ID inválido.");

    const cliente = await this.clienteService.buscarPorId(id);
    console.table([
      {
        ID: cliente.id,
        Nome: cliente.nome,
        Email: cliente.email,
        Telefone: cliente.telefone ?? "-",
      },
    ]);
  }

  async atualizar(): Promise<void> {
    const idStr = await perguntar(this.rl, "ID do cliente a atualizar: ");
    const id = parseIntOrNull(idStr);
    if (id === null) throw new ErroNegocio("ID inválido.");

    const atual = await this.clienteService.buscarPorId(id);
    console.log("Deixe em branco para manter o valor atual.");

    const nome = await perguntar(this.rl, `Nome (${atual.nome}): `);
    const email = await perguntar(this.rl, `Email (${atual.email}): `);
    const telefone = await perguntar(
      this.rl,
      `Telefone (${atual.telefone ?? "-"}): `,
    );

    const atualizado = await this.clienteService.atualizar(id, {
      nome: nome || undefined,
      email: email || undefined,
      telefone: telefone || undefined,
    });

    console.log("\nCliente atualizado com sucesso!");
    console.table([atualizado]);
  }

  async remover(): Promise<void> {
    const idStr = await perguntar(this.rl, "ID do cliente a remover: ");
    const id = parseIntOrNull(idStr);
    if (id === null) throw new ErroNegocio("ID inválido.");

    await this.clienteService.remover(id);
    console.log("\nCliente removido com sucesso!");
  }
}
