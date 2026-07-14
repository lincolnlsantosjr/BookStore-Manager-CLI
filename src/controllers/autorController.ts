import * as readline from "readline";
import { perguntar } from "../utils/input";
import { AutorService } from "../services/autorService";
import { parseIntOrNull } from "../utils/validations";
import { ErroNegocio } from "../utils/erros";

export class AutorController {
  constructor(
    private rl: readline.Interface,
    private autorService: AutorService = new AutorService(),
  ) {}

  async cadastrar(): Promise<void> {
    console.log("\n--- Cadastro de Autor ---");
    const nome = await perguntar(this.rl, "Nome: ");
    const nacionalidade = await perguntar(
      this.rl,
      "Nacionalidade (opcional): ",
    );
    const dataNascimento = await perguntar(
      this.rl,
      "Data de nascimento AAAA-MM-DD (opcional): ",
    );

    const autor = await this.autorService.cadastrar({
      nome,
      nacionalidade: nacionalidade || null,
      dataNascimento: dataNascimento || null,
    });

    console.log(`\nAutor cadastrado com sucesso! ID: ${autor.id}`);
  }

  async listar(): Promise<void> {
    console.log("\n--- Lista de Autores ---");
    const autores = await this.autorService.listar();
    if (autores.length === 0) {
      console.log("Nenhum autor cadastrado.");
      return;
    }
    console.table(
      autores.map((a) => ({
        ID: a.id,
        Nome: a.nome,
        Nacionalidade: a.nacionalidade ?? "-",
        "Data Nasc.": a.dataNascimento ?? "-",
      })),
    );
  }

  async consultar(): Promise<void> {
    const idStr = await perguntar(this.rl, "ID do autor: ");
    const id = parseIntOrNull(idStr);
    if (id === null) throw new ErroNegocio("ID inválido.");

    const autor = await this.autorService.buscarPorId(id);
    console.table([
      {
        ID: autor.id,
        Nome: autor.nome,
        Nacionalidade: autor.nacionalidade ?? "-",
        "Data Nasc.": autor.dataNascimento ?? "-",
      },
    ]);
  }

  async atualizar(): Promise<void> {
    const idStr = await perguntar(this.rl, "ID do autor a atualizar: ");
    const id = parseIntOrNull(idStr);
    if (id === null) throw new ErroNegocio("ID inválido.");

    const atual = await this.autorService.buscarPorId(id);
    console.log("Deixe em branco para manter o valor atual.");

    const nome = await perguntar(this.rl, `Nome (${atual.nome}): `);
    const nacionalidade = await perguntar(
      this.rl,
      `Nacionalidade (${atual.nacionalidade ?? "-"}): `,
    );
    const dataNascimento = await perguntar(
      this.rl,
      `Data de nascimento (${atual.dataNascimento ?? "-"}): `,
    );

    const atualizado = await this.autorService.atualizar(id, {
      nome: nome || undefined,
      nacionalidade: nacionalidade || undefined,
      dataNascimento: dataNascimento || undefined,
    });

    console.log("\nAutor atualizado com sucesso!");
    console.table([atualizado]);
  }

  async remover(): Promise<void> {
    const idStr = await perguntar(this.rl, "ID do autor a remover: ");
    const id = parseIntOrNull(idStr);
    if (id === null) throw new ErroNegocio("ID inválido.");

    await this.autorService.deletar(id);
    console.log("\nAutor removido com sucesso!");
  }
}
