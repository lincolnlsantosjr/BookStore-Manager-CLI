import { ClienteRepository } from "../repositories/clienteRepository";
import { Cliente, ClienteProps } from "../models/cliente";
import { ErroNegocio } from "../utils/erros";
import {
  isNonEmptyString,
  isPositiveInteger,
  isValidEmail,
} from "../utils/validations";

export class ClienteService {
  constructor(
    private clienteRepository: ClienteRepository = new ClienteRepository(),
  ) {}

  async cadastrar(dados: ClienteProps): Promise<Cliente> {
    if (!isNonEmptyString(dados.nome)) {
      throw new ErroNegocio("O nome do cliente é obrigatório.");
    }
    if (!isValidEmail(dados.email)) {
      throw new ErroNegocio("Informe um e-mail válido.");
    }

    const existente = await this.clienteRepository.findByEmail(dados.email);
    if (existente) {
      throw new ErroNegocio(
        `Já existe um cliente cadastrado com o e-mail ${dados.email}.`,
      );
    }

    const cliente = new Cliente(dados);
    return this.clienteRepository.create(cliente);
  }

  async listar(): Promise<Cliente[]> {
    return this.clienteRepository.findAll();
  }

  async buscarPorId(id: number): Promise<Cliente> {
    if (!isPositiveInteger(id)) {
      throw new ErroNegocio("ID inválido.");
    }
    const cliente = await this.clienteRepository.findById(id);
    if (!cliente) {
      throw new ErroNegocio(`Cliente com ID ${id} não encontrado.`);
    }
    return cliente;
  }

  async atualizar(id: number, dados: Partial<ClienteProps>): Promise<Cliente> {
    await this.buscarPorId(id);

    if (dados.nome !== undefined && !isNonEmptyString(dados.nome)) {
      throw new ErroNegocio("O nome do cliente não pode ser vazio.");
    }
    if (dados.email !== undefined) {
      if (!isValidEmail(dados.email)) {
        throw new ErroNegocio("Informe um e-mail válido.");
      }
      const existente = await this.clienteRepository.findByEmail(dados.email);
      if (existente && existente.id !== id) {
        throw new ErroNegocio(
          `Já existe outro cliente cadastrado com o e-mail ${dados.email}.`,
        );
      }
    }

    const atualizado = await this.clienteRepository.update(
      id,
      dados as Partial<Cliente>,
    );
    if (!atualizado) {
      throw new ErroNegocio(
        `Não foi possível atualizar o cliente com ID ${id}.`,
      );
    }
    return atualizado;
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);

    const possuiEmprestimos =
      await this.clienteRepository.possuiEmprestimosVinculados(id);
    if (possuiEmprestimos) {
      throw new ErroNegocio(
        "Não é possível remover este cliente pois existem empréstimos vinculados a ele.",
      );
    }

    await this.clienteRepository.delete(id);
  }
}
