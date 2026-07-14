import { pool } from '../database/connection';

export class RelatorioRepository {
  async livrosDisponiveis(): Promise<any[]> {
    const result = await pool.query(
      `SELECT l.id, l.titulo, a.nome AS nome_autor, l.quantidade_disponivel
       FROM livros l
       INNER JOIN autores a ON a.id = l.autor_id
       WHERE l.quantidade_disponivel > 0
       ORDER BY l.titulo`
    );
    return result.rows;
  }

  async livrosEmprestados(): Promise<any[]> {
    const result = await pool.query(
      `SELECT l.id, l.titulo, c.nome AS nome_cliente, e.data_emprestimo
       FROM emprestimos e
       INNER JOIN livros l ON l.id = e.livro_id
       INNER JOIN clientes c ON c.id = e.cliente_id
       WHERE e.status = 'ativo'
       ORDER BY e.data_emprestimo DESC`
    );
    return result.rows;
  }

  async livrosCadastradosPorAutor(): Promise<any[]> {
    const result = await pool.query(
      `SELECT a.nome AS nome_autor, COUNT(l.id) AS total_livros
       FROM autores a
       LEFT JOIN livros l ON l.autor_id = a.id
       GROUP BY a.nome
       ORDER BY total_livros DESC`
    );
    return result.rows;
  }

  async quantidadeEmprestimosPorLivro(limite: number = 10): Promise<any[]> {
    const result = await pool.query(
      `SELECT l.titulo, COUNT(e.id) AS total_emprestimos
       FROM livros l
       LEFT JOIN emprestimos e ON e.livro_id = l.id
       GROUP BY l.titulo
       ORDER BY total_emprestimos DESC
       LIMIT $1`,
      [limite]
    );
    return result.rows;
  }

  async clientesComEmprestimosAtivos(): Promise<any[]> {
    const result = await pool.query(
      `SELECT c.nome AS nome_cliente, c.email, COUNT(e.id) AS emprestimos_ativos
       FROM clientes c
       INNER JOIN emprestimos e ON e.cliente_id = c.id
       WHERE e.status = 'ativo'
       GROUP BY c.nome, c.email
       ORDER BY emprestimos_ativos DESC`
    );
    return result.rows;
  }
}
