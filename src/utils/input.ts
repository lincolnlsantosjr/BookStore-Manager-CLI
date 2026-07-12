import * as readline from 'readline';

export function criarInterface(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

export function perguntar(rl: readline.Interface, pergunta: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(pergunta, (resposta) => resolve(resposta.trim()));
  });
}

export async function pausar(rl: readline.Interface): Promise<void> {
  await perguntar(rl, '\nPressione ENTER para continuar...');
}
