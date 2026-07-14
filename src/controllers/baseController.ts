import { ErroNegocio } from "../utils/erros";

export abstract class BaseController {
  protected tratarErro(erro: unknown): void {
    if (erro instanceof ErroNegocio) {
      console.log(`\n✘ ${erro.message}`);
      return;
    }
    console.log("\nOcorreu um erro inesperado:", (erro as Error).message);
  }
}
