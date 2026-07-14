import * as readline from "readline";
import { perguntar } from "../utils/input";
import { LivroService } from "../services/livroService";
import { parseIntOrNull } from "../utils/validations";
import { ErroNegocio } from "../utils/erros";

export class LivroController {
  constructor(
    private rl: readline.Interface,
    private livroService: LivroService = new LivroService(),
  ) {}

  async cadastrar(): Promise<void> {
    console.log("\n--- Cadastro de Livro ---");
    const titulo = await perguntar(this.rl, "Título: ");
    const autorIdStr = await perguntar(this.rl, "ID do autor: ");
    const genero = await perguntar(this.rl, "Gênero (opcional): ");
    const anoStr = await perguntar(this.rl, "Ano de publicação (opcional): ");
    const quantidadeStr = await perguntar(
      this.rl,
      "Quantidade de exemplares: ",
    );

    const autorId = parseIntOrNull(autorIdStr);
    if (autorId === null) throw new ErroNegocio("ID de autor inválido.");

    const quantidadeTotal = parseIntOrNull(quantidadeStr);
    if (quantidadeTotal === null) throw new ErroNegocio("Quantidade inválida.");

    const anoPublicacao = anoStr ? parseIntOrNull(anoStr) : null;

    const livro = await this.livroService.cadastrar({
      titulo,
      autorId,
      genero: genero || null,
      anoPublicacao,
      quantidadeTotal,
      quantidadeDisponivel: quantidadeTotal,
    });

    console.log(`\nLivro cadastrado com sucesso! ID: ${livro.id}`);
  }

  async listar(): Promise<void> {
    console.log("\n--- Lista de Livros ---");
    const livros = await this.livroService.listar();
    if (livros.length === 0) {
      console.log("Nenhum livro cadastrado.");
      return;
    }
    console.table(
      livros.map((l) => ({
        ID: l.id,
        Título: l.titulo,
        Autor: l.nomeAutor,
        Gênero: l.genero ?? "-",
        Ano: l.anoPublicacao ?? "-",
        Total: l.quantidadeTotal,
        Disponível: l.quantidadeDisponivel,
      })),
    );
  }

  async consultar(): Promise<void> {
    const idStr = await perguntar(this.rl, "ID do livro: ");
    const id = parseIntOrNull(idStr);
    if (id === null) throw new ErroNegocio("ID inválido.");

    const livro = await this.livroService.buscarPorId(id);
    console.table([
      {
        ID: livro.id,
        Título: livro.titulo,
        "ID Autor": livro.autorId,
        Gênero: livro.genero ?? "-",
        Ano: livro.anoPublicacao ?? "-",
        Total: livro.quantidadeTotal,
        Disponível: livro.quantidadeDisponivel,
      },
    ]);
  }

  async atualizar(): Promise<void> {
    const idStr = await perguntar(this.rl, "ID do livro a atualizar: ");
    const id = parseIntOrNull(idStr);
    if (id === null) throw new ErroNegocio("ID inválido.");

    const atual = await this.livroService.buscarPorId(id);
    console.log("Deixe em branco para manter o valor atual.");

    const titulo = await perguntar(this.rl, `Título (${atual.titulo}): `);
    const autorIdStr = await perguntar(
      this.rl,
      `ID do autor (${atual.autorId}): `,
    );
    const genero = await perguntar(
      this.rl,
      `Gênero (${atual.genero ?? "-"}): `,
    );
    const anoStr = await perguntar(
      this.rl,
      `Ano de publicação (${atual.anoPublicacao ?? "-"}): `,
    );
    const quantidadeStr = await perguntar(
      this.rl,
      `Quantidade total (${atual.quantidadeTotal}): `,
    );

    const atualizado = await this.livroService.atualizar(id, {
      titulo: titulo || undefined,
      autorId: autorIdStr
        ? (parseIntOrNull(autorIdStr) ?? undefined)
        : undefined,
      genero: genero || undefined,
      anoPublicacao: anoStr ? (parseIntOrNull(anoStr) ?? undefined) : undefined,
      quantidadeTotal: quantidadeStr
        ? (parseIntOrNull(quantidadeStr) ?? undefined)
        : undefined,
    });

    console.log("\nLivro atualizado com sucesso!");
    console.table([atualizado]);
  }

  async remover(): Promise<void> {
    const idStr = await perguntar(this.rl, "ID do livro a remover: ");
    const id = parseIntOrNull(idStr);
    if (id === null) throw new ErroNegocio("ID inválido.");

    await this.livroService.deletar(id);
    console.log("\nLivro removido com sucesso!");
  }
}
