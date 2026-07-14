import { pool } from "../database/connection";
import { Livro, LivroComAutor } from "../models/livro";

export class LivroRepository {
  async create(livro: Livro): Promise<Livro> {
    const result = await pool.query(
      `INSERT INTO livros (titulo, autor_id, genero, ano_publicacao, quantidade_total, quantidade_disponivel)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        livro.titulo,
        livro.autorId,
        livro.genero,
        livro.anoPublicacao,
        livro.quantidadeTotal,
        livro.quantidadeDisponivel,
      ],
    );
    return this.mapRow(result.rows[0]);
  }

  async findAll(): Promise<LivroComAutor[]> {
    const result = await pool.query(
      `SELECT l.*, a.nome AS nome_autor
       FROM livros l
       INNER JOIN autores a ON a.id = l.autor_id
       ORDER BY l.id`,
    );
    return result.rows.map(this.mapRowComAutor);
  }

  async findById(id: number): Promise<Livro | null> {
    const result = await pool.query(`SELECT * FROM livros WHERE id = $1`, [id]);
    if (result.rows.length === 0) return null;
    return this.mapRow(result.rows[0]);
  }

  async update(id: number, dados: Partial<Livro>): Promise<Livro | null> {
    const atual = await this.findById(id);
    if (!atual) return null;

    const titulo = dados.titulo ?? atual.titulo;
    const autorId = dados.autorId ?? atual.autorId;
    const genero = dados.genero ?? atual.genero;
    const anoPublicacao = dados.anoPublicacao ?? atual.anoPublicacao;
    const quantidadeTotal = dados.quantidadeTotal ?? atual.quantidadeTotal;
    const quantidadeDisponivel =
      dados.quantidadeDisponivel ?? atual.quantidadeDisponivel;

    const result = await pool.query(
      `UPDATE livros
       SET titulo = $1, autor_id = $2, genero = $3, ano_publicacao = $4,
           quantidade_total = $5, quantidade_disponivel = $6
       WHERE id = $7 RETURNING *`,
      [
        titulo,
        autorId,
        genero,
        anoPublicacao,
        quantidadeTotal,
        quantidadeDisponivel,
        id,
      ],
    );
    return this.mapRow(result.rows[0]);
  }

  async delete(id: number): Promise<boolean> {
    const result = await pool.query(`DELETE FROM livros WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async decrementarDisponibilidade(id: number): Promise<void> {
    await pool.query(
      `UPDATE livros SET quantidade_disponivel = quantidade_disponivel - 1 WHERE id = $1`,
      [id],
    );
  }

  async incrementarDisponibilidade(id: number): Promise<void> {
    await pool.query(
      `UPDATE livros SET quantidade_disponivel = quantidade_disponivel + 1 WHERE id = $1`,
      [id],
    );
  }

  async possuiEmprestimosVinculados(id: number): Promise<boolean> {
    const result = await pool.query(
      `SELECT 1 FROM emprestimos WHERE livro_id = $1 LIMIT 1`,
      [id],
    );
    return result.rows.length > 0;
  }

  private mapRow(row: any): Livro {
    return new Livro({
      id: row.id,
      titulo: row.titulo,
      autorId: row.autor_id,
      genero: row.genero,
      anoPublicacao: row.ano_publicacao,
      quantidadeTotal: row.quantidade_total,
      quantidadeDisponivel: row.quantidade_disponivel,
    });
  }

  private mapRowComAutor(row: any): LivroComAutor {
    return {
      id: row.id,
      titulo: row.titulo,
      autorId: row.autor_id,
      genero: row.genero,
      anoPublicacao: row.ano_publicacao,
      quantidadeTotal: row.quantidade_total,
      quantidadeDisponivel: row.quantidade_disponivel,
      nomeAutor: row.nome_autor,
    };
  }
}
