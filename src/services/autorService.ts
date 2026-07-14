import { AutorRepository } from "../repositories/autorRepository";
import { Autor, AutorProps } from "../models/autor";
import { ErroNegocio } from "../utils/erros";
import { isNonEmptyString, isPositiveInteger } from "../utils/validations";

export class AutorService {
  constructor(
    private autorRepository: AutorRepository = new AutorRepository(),
  ) {}

  async cadastrar(dados: AutorProps): Promise<Autor> {
    if (!isNonEmptyString(dados.nome)) {
      throw new ErroNegocio("O nome do autor é obrigatório.");
    }
    const autor = new Autor(dados);
    return this.autorRepository.criar(autor);
  }

  async listar(): Promise<Autor[]> {
    return this.autorRepository.buscarTodos();
  }

  async buscarPorId(id: number): Promise<Autor> {
    if (!isPositiveInteger(id)) {
      throw new ErroNegocio("ID inválido.");
    }
    const autor = await this.autorRepository.buscarPorId(id);
    if (!autor) {
      throw new ErroNegocio(`Autor com ID ${id} não encontrado.`);
    }
    return autor;
  }

  async atualizar(id: number, dados: Partial<AutorProps>): Promise<Autor> {
    await this.buscarPorId(id);

    if (dados.nome !== undefined && !isNonEmptyString(dados.nome)) {
      throw new ErroNegocio("O nome do autor não pode ser vazio.");
    }

    const atualizado = await this.autorRepository.update(
      id,
      dados as Partial<Autor>,
    );
    if (!atualizado) {
      throw new ErroNegocio(`Não foi possível atualizar o autor com ID ${id}.`);
    }
    return atualizado;
  }

  async deletar(id: number): Promise<void> {
    await this.buscarPorId(id); // valida existência

    const possuiLivros = await this.autorRepository.possuiLivrosVinculados(id);
    if (possuiLivros) {
      throw new ErroNegocio(
        "Não é possível deletar este autor pois existem livros vinculados a ele.",
      );
    }

    await this.autorRepository.deletar(id);
  }
}
