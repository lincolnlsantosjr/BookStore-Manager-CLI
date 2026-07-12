import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export async function testarConexao(): Promise<void> {
  try {
    await pool.query('SELECT NOW()');
    console.log('Conexao com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', (error as Error).message);
    console.error('Verifique se o PostgreSQL esta em execucao e se as variaveis do arquivo .env estao corretas.');
    process.exit(1);
  }
}
