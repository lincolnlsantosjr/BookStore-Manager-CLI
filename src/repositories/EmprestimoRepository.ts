import { pool } from '../database/connection';
import { Emprestimo, EmprestimoDetalhado } from '../models/Emprestimo';

export class EmprestimoRepository {
  async create(emprestimo: Emprestimo): Promise<Emprestimo> {
    const result = await pool.query(
      `INSERT INTO emprestimos (livro_id, cliente_id, status)
       VALUES ($1, $2, 'ativo')
       RETURNING *`,
      [emprestimo.livroId, emprestimo.clienteId]
    );
    return this.mapRow(result.rows[0]);
  }

  async findAll(): Promise<EmprestimoDetalhado[]> {
    const result = await pool.query(
      `SELECT e.id, l.titulo AS titulo_livro, c.nome AS nome_cliente,
              e.data_emprestimo, e.data_devolucao, e.status
       FROM emprestimos e
       INNER JOIN livros l ON l.id = e.livro_id
       INNER JOIN clientes c ON c.id = e.cliente_id
       ORDER BY e.id`
    );
    return result.rows.map(this.mapRowDetalhado);
  }

  async findById(id: number): Promise<Emprestimo | null> {
    const result = await pool.query(`SELECT * FROM emprestimos WHERE id = $1`, [id]);
    if (result.rows.length === 0) return null;
    return this.mapRow(result.rows[0]);
  }

  async registrarDevolucao(id: number): Promise<Emprestimo | null> {
    const result = await pool.query(
      `UPDATE emprestimos SET status = 'devolvido', data_devolucao = NOW()
       WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) return null;
    return this.mapRow(result.rows[0]);
  }

  private mapRow(row: any): Emprestimo {
    return new Emprestimo({
      id: row.id,
      livroId: row.livro_id,
      clienteId: row.cliente_id,
      dataEmprestimo: row.data_emprestimo,
      dataDevolucao: row.data_devolucao,
      status: row.status,
    });
  }

  private mapRowDetalhado(row: any): EmprestimoDetalhado {
    return {
      id: row.id,
      tituloLivro: row.titulo_livro,
      nomeCliente: row.nome_cliente,
      dataEmprestimo: row.data_emprestimo,
      dataDevolucao: row.data_devolucao,
      status: row.status,
    };
  }
}
