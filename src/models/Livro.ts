export interface LivroProps {
  id?: number;
  titulo: string;
  autorId: number;
  genero?: string | null;
  anoPublicacao?: number | null;
  quantidadeTotal: number;
  quantidadeDisponivel: number;
}

export class Livro {
  id?: number;
  titulo: string;
  autorId: number;
  genero?: string | null;
  anoPublicacao?: number | null;
  quantidadeTotal: number;
  quantidadeDisponivel: number;

  constructor(props: LivroProps) {
    this.id = props.id;
    this.titulo = props.titulo;
    this.autorId = props.autorId;
    this.genero = props.genero ?? null;
    this.anoPublicacao = props.anoPublicacao ?? null;
    this.quantidadeTotal = props.quantidadeTotal;
    this.quantidadeDisponivel = props.quantidadeDisponivel;
  }
}

export interface LivroComAutor extends LivroProps {
  nomeAutor: string;
}
