import { pool } from '../database/connection';
import { Cliente } from '../models/Cliente';

export class ClienteRepository {
  async create(cliente: Cliente): Promise<Cliente> {
    const result = await pool.query(
      `INSERT INTO clientes (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *`,
      [cliente.nome, cliente.email, cliente.telefone]
    );
    return this.mapRow(result.rows[0]);
  }

  async findAll(): Promise<Cliente[]> {
    const result = await pool.query(`SELECT * FROM clientes ORDER BY id`);
    return result.rows.map(this.mapRow);
  }

  async findById(id: number): Promise<Cliente | null> {
    const result = await pool.query(`SELECT * FROM clientes WHERE id = $1`, [id]);
    if (result.rows.length === 0) return null;
    return this.mapRow(result.rows[0]);
  }

  async findByEmail(email: string): Promise<Cliente | null> {
    const result = await pool.query(`SELECT * FROM clientes WHERE email = $1`, [email]);
    if (result.rows.length === 0) return null;
    return this.mapRow(result.rows[0]);
  }

  async update(id: number, dados: Partial<Cliente>): Promise<Cliente | null> {
    const atual = await this.findById(id);
    if (!atual) return null;

    const nome = dados.nome ?? atual.nome;
    const email = dados.email ?? atual.email;
    const telefone = dados.telefone ?? atual.telefone;

    const result = await pool.query(
      `UPDATE clientes SET nome = $1, email = $2, telefone = $3 WHERE id = $4 RETURNING *`,
      [nome, email, telefone, id]
    );
    return this.mapRow(result.rows[0]);
  }

  async delete(id: number): Promise<boolean> {
    const result = await pool.query(`DELETE FROM clientes WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async possuiEmprestimosVinculados(id: number): Promise<boolean> {
    const result = await pool.query(`SELECT 1 FROM emprestimos WHERE cliente_id = $1 LIMIT 1`, [id]);
    return result.rows.length > 0;
  }

  private mapRow(row: any): Cliente {
    return new Cliente({
      id: row.id,
      nome: row.nome,
      email: row.email,
      telefone: row.telefone,
    });
  }
}
