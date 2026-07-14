import { LivroRepository } from "../repositories/livroRepository";
import { AutorRepository } from "../repositories/autorRepository";
import { Livro, LivroProps, LivroComAutor } from "../models/livro";
import { ErroNegocio } from "../utils/erros";
import {
  isNonEmptyString,
  isPositiveInteger,
  isNonNegativeInteger,
} from "../utils/validations";

export class LivroService {
  constructor(
    private livroRepository: LivroRepository = new LivroRepository(),
    private autorRepository: AutorRepository = new AutorRepository(),
  ) {}

  async cadastrar(dados: LivroProps): Promise<Livro> {
    if (!isNonEmptyString(dados.titulo)) {
      throw new ErroNegocio("O título do livro é obrigatório.");
    }
    if (!isPositiveInteger(dados.autorId)) {
      throw new ErroNegocio("Informe um ID de autor válido.");
    }
    const autor = await this.autorRepository.buscarPorId(dados.autorId);
    if (!autor) {
      throw new ErroNegocio(
        `Autor com ID ${dados.autorId} não encontrado. Cadastre o autor antes do livro.`,
      );
    }
    if (!isNonNegativeInteger(dados.quantidadeTotal)) {
      throw new ErroNegocio(
        "A quantidade total deve ser um número inteiro maior ou igual a 0.",
      );
    }

    const livro = new Livro({
      ...dados,
      quantidadeDisponivel: dados.quantidadeTotal,
    });
    return this.livroRepository.create(livro);
  }

  async listar(): Promise<LivroComAutor[]> {
    return this.livroRepository.findAll();
  }

  async buscarPorId(id: number): Promise<Livro> {
    if (!isPositiveInteger(id)) {
      throw new ErroNegocio("ID inválido.");
    }
    const livro = await this.livroRepository.findById(id);
    if (!livro) {
      throw new ErroNegocio(`Livro com ID ${id} não encontrado.`);
    }
    return livro;
  }

  async atualizar(id: number, dados: Partial<LivroProps>): Promise<Livro> {
    await this.buscarPorId(id);

    if (dados.titulo !== undefined && !isNonEmptyString(dados.titulo)) {
      throw new ErroNegocio("O título do livro não pode ser vazio.");
    }
    if (dados.autorId !== undefined) {
      const autor = await this.autorRepository.buscarPorId(dados.autorId);
      if (!autor) {
        throw new ErroNegocio(`Autor com ID ${dados.autorId} não encontrado.`);
      }
    }

    const atualizado = await this.livroRepository.update(
      id,
      dados as Partial<Livro>,
    );
    if (!atualizado) {
      throw new ErroNegocio(`Não foi possível atualizar o livro com ID ${id}.`);
    }
    return atualizado;
  }

  async deletar(id: number): Promise<void> {
    await this.buscarPorId(id);

    const possuiEmprestimos =
      await this.livroRepository.possuiEmprestimosVinculados(id);
    if (possuiEmprestimos) {
      throw new ErroNegocio(
        "Não é possível deletar este livro pois existem empréstimos vinculados a ele.",
      );
    }

    await this.livroRepository.delete(id);
  }
}
