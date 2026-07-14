import { pool } from "../database/connection";
import { Autor } from "../models/autor";

export class AutorRepository {
  async criar(autor: Autor): Promise<Autor> {
    const result = await pool.query(
      `INSERT INTO autores (nome, nacionalidade, data_nascimento)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [autor.nome, autor.nacionalidade, autor.dataNascimento],
    );
    return this.mapRow(result.rows[0]);
  }

  async buscarTodos(): Promise<Autor[]> {
    const result = await pool.query(`SELECT * FROM autores ORDER BY id`);
    return result.rows.map(this.mapRow);
  }

  async buscarPorId(id: number): Promise<Autor | null> {
    const result = await pool.query(`SELECT * FROM autores WHERE id = $1`, [
      id,
    ]);
    if (result.rows.length === 0) return null;
    return this.mapRow(result.rows[0]);
  }

  async update(id: number, dados: Partial<Autor>): Promise<Autor | null> {
    const atual = await this.buscarPorId(id);
    if (!atual) return null;

    const nome = dados.nome ?? atual.nome;
    const nacionalidade = dados.nacionalidade ?? atual.nacionalidade;
    const dataNascimento = dados.dataNascimento ?? atual.dataNascimento;

    const result = await pool.query(
      `UPDATE autores SET nome = $1, nacionalidade = $2, data_nascimento = $3
       WHERE id = $4 RETURNING *`,
      [nome, nacionalidade, dataNascimento, id],
    );
    return this.mapRow(result.rows[0]);
  }

  async deletar(id: number): Promise<boolean> {
    const result = await pool.query(`DELETE FROM autores WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async possuiLivrosVinculados(id: number): Promise<boolean> {
    const result = await pool.query(
      `SELECT 1 FROM livros WHERE autor_id = $1 LIMIT 1`,
      [id],
    );
    return result.rows.length > 0;
  }

  private mapRow(row: any): Autor {
    return new Autor({
      id: row.id,
      nome: row.nome,
      nacionalidade: row.nacionalidade,
      dataNascimento: row.data_nascimento,
    });
  }
}
