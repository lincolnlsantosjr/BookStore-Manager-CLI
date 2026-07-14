import { testarConexao, pool } from "./database/connection";
import { criarInterface } from "./utils/input";
import { MainMenu } from "./menus/main";

async function main(): Promise<void> {
  console.log("Iniciando BookStore Manager CLI...\n");

  await testarConexao();

  const rl = criarInterface();
  const mainMenu = new MainMenu(rl);

  await mainMenu.iniciar();

  rl.close();
  await pool.end();
  process.exit(0);
}

main().catch(async (erro) => {
  console.error("\nErro fatal na aplicação:", erro);
  await pool.end();
  process.exit(1);
});
