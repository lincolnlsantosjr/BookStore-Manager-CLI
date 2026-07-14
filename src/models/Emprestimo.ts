export type StatusEmprestimo = "ativo" | "devolvido";

export interface EmprestimoProps {
  id?: number;
  livroId: number;
  clienteId: number;
  dataEmprestimo?: Date;
  dataDevolucao?: Date | null;
  status?: StatusEmprestimo;
}

export class Emprestimo {
  id?: number;
  livroId: number;
  clienteId: number;
  dataEmprestimo?: Date;
  dataDevolucao?: Date | null;
  status: StatusEmprestimo;

  constructor(props: EmprestimoProps) {
    this.id = props.id;
    this.livroId = props.livroId;
    this.clienteId = props.clienteId;
    this.dataEmprestimo = props.dataEmprestimo;
    this.dataDevolucao = props.dataDevolucao ?? null;
    this.status = props.status ?? "ativo";
  }
}

export interface EmprestimoDetalhado {
  id: number;
  tituloLivro: string;
  nomeCliente: string;
  dataEmprestimo: Date;
  dataDevolucao: Date | null;
  status: StatusEmprestimo;
}
