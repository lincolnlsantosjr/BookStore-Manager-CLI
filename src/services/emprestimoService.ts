import { EmprestimoRepository } from "../repositories/emprestimoRepository";
import { LivroRepository } from "../repositories/livroRepository";
import { ClienteRepository } from "../repositories/clienteRepository";
import { Emprestimo, EmprestimoDetalhado } from "../models/emprestimo";
import { ErroNegocio } from "../utils/erros";
import { isPositiveInteger } from "../utils/validations";

export class EmprestimoService {
  constructor(
    private emprestimoRepository: EmprestimoRepository = new EmprestimoRepository(),
    private livroRepository: LivroRepository = new LivroRepository(),
    private clienteRepository: ClienteRepository = new ClienteRepository(),
  ) {}

  async realizarEmprestimo(
    livroId: number,
    clienteId: number,
  ): Promise<Emprestimo> {
    if (!isPositiveInteger(livroId) || !isPositiveInteger(clienteId)) {
      throw new ErroNegocio("IDs de livro e cliente inválidos.");
    }

    const livro = await this.livroRepository.findById(livroId);
    if (!livro) {
      throw new ErroNegocio(`Livro com ID ${livroId} não encontrado.`);
    }

    const cliente = await this.clienteRepository.findById(clienteId);
    if (!cliente) {
      throw new ErroNegocio(`Cliente com ID ${clienteId} não encontrado.`);
    }

    if (livro.quantidadeDisponivel <= 0) {
      throw new ErroNegocio(
        `O livro "${livro.titulo}" não possui exemplares disponíveis no momento.`,
      );
    }

    const emprestimo = await this.emprestimoRepository.create(
      new Emprestimo({ livroId, clienteId }),
    );
    await this.livroRepository.decrementarDisponibilidade(livroId);

    return emprestimo;
  }

  async registrarDevolucao(emprestimoId: number): Promise<Emprestimo> {
    if (!isPositiveInteger(emprestimoId)) {
      throw new ErroNegocio("ID de empréstimo inválido.");
    }

    const emprestimo = await this.emprestimoRepository.findById(emprestimoId);
    if (!emprestimo) {
      throw new ErroNegocio(
        `Empréstimo com ID ${emprestimoId} não encontrado.`,
      );
    }
    if (emprestimo.status === "devolvido") {
      throw new ErroNegocio("Este empréstimo já foi devolvido anteriormente.");
    }

    const atualizado =
      await this.emprestimoRepository.registrarDevolucao(emprestimoId);
    if (!atualizado) {
      throw new ErroNegocio("Não foi possível registrar a devolução.");
    }
    await this.livroRepository.incrementarDisponibilidade(emprestimo.livroId);

    return atualizado;
  }

  async listar(): Promise<EmprestimoDetalhado[]> {
    return this.emprestimoRepository.findAll();
  }
}
