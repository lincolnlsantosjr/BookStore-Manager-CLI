export interface AutorProps {
  id?: number;
  nome: string;
  nacionalidade?: string | null;
  dataNascimento?: string | null;
}

export class Autor {
  id?: number;
  nome: string;
  nacionalidade?: string | null;
  dataNascimento?: string | null;

  constructor(props: AutorProps) {
    this.id = props.id;
    this.nome = props.nome;
    this.nacionalidade = props.nacionalidade ?? null;
    this.dataNascimento = props.dataNascimento ?? null;
  }
}
