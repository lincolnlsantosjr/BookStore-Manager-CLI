export interface ClienteProps {
  id?: number;
  nome: string;
  email: string;
  telefone?: string | null;
}

export class Cliente {
  id?: number;
  nome: string;
  email: string;
  telefone?: string | null;

  constructor(props: ClienteProps) {
    this.id = props.id;
    this.nome = props.nome;
    this.email = props.email;
    this.telefone = props.telefone ?? null;
  }
}
