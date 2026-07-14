# 📚 BookStore Manager CLI

Aplicação de linha de comando (CLI) para gerenciamento completo de uma livraria: autores, livros, clientes e empréstimos, com persistência em **PostgreSQL**.

Projeto Final Avaliativo — Desenvolvedor(a) Back End Node — T1 e T2 — Módulo 01 — Semana 13.

---

## 📑 Sumário

- [Descrição](#-descrição)
- [Objetivo](#-objetivo)
- [Tecnologias utilizadas](#-tecnologias-utilizadas)
- [Arquitetura do projeto](#-arquitetura-do-projeto)
- [Estrutura de pastas](#-estrutura-de-pastas)
- [Requisitos para execução](#-requisitos-para-execução)
- [Configuração do banco de dados](#-configuração-do-banco-de-dados)
- [Instalação](#-instalação)
- [Execução](#-execução)
- [Funcionalidades implementadas](#-funcionalidades-implementadas)
- [Exemplos de utilização](#-exemplos-de-utilização)
- [Relatórios disponíveis](#-relatórios-disponíveis)
- [Tratamento de erros](#-tratamento-de-erros)
- [Integrantes da equipe](#-integrantes-da-equipe)
- [Link do Kanban](#-link-do-kanban)

---

## 📖 Descrição

O **BookStore Manager CLI** é um sistema executado via terminal que permite administrar autores, livros, clientes e empréstimos de uma livraria, substituindo o controle manual por uma aplicação estruturada, com regras de negócio, persistência em banco de dados relacional e relatórios gerenciais.

## 🎯 Objetivo

Consolidar, em um projeto próximo da realidade profissional, os conhecimentos de:

- Node.js e TypeScript;
- Programação Orientada a Objetos (classes, interfaces, tipagem estática, herança);
- Programação assíncrona (Promises / async-await);
- Arquitetura em camadas e separação de responsabilidades;
- Modelagem de banco de dados relacional com PostgreSQL;
- Comandos SQL (DDL, DML e consultas com JOIN, GROUP BY, ORDER BY, LIMIT e funções de agregação);
- Versionamento com Git, GitHub e GitFlow.

## 🛠 Tecnologias utilizadas

| Tecnologia      | Finalidade                                      |
| --------------- | ------------------------------------------------ |
| **Node.js**     | Ambiente de execução JavaScript                 |
| **TypeScript**  | Tipagem estática e POO                          |
| **PostgreSQL**  | Banco de dados relacional                       |
| **pg**          | Driver de conexão Node ↔ PostgreSQL             |
| **dotenv**      | Gerenciamento de variáveis de ambiente          |
| **ts-node-dev** | Execução em modo desenvolvimento com hot-reload |

## 🏗 Arquitetura do projeto

O projeto segue uma **arquitetura em camadas**, isolando responsabilidades e reduzindo o acoplamento entre os módulos:


Usuário (Terminal)
        │
        ▼
     Menus            → navegação (loop do menu, exibição de opções, tratamento de erro)
        │
        ▼
   Controllers        → executa as ações (cadastrar, listar, consultar, atualizar, remover)
        │
        ▼
    Services           → regras de negócio e validações
        │
        ▼
  Repositories         → acesso a dados (consultas SQL via pg)
        │
        ▼
    PostgreSQL          → persistência dos dados


**Responsabilidade das camadas**

| Camada         | Responsabilidade                                                                 |
| -------------- | ---------------------------------------------------------------------------------- |
| `main.ts`      | Inicia a aplicação, conecta ao banco e chama o menu principal                      |
| `menus`        | Um arquivo de menu por módulo: exibe as opções, controla o loop de navegação e trata erros |
| `controllers`  | Um arquivo por módulo: executa as ações de fato (perguntas ao usuário, chamadas ao Service, exibição de resultado) |
| `services`     | Implementa as regras de negócio e validações                                       |
| `repositories` | Executa comandos SQL (INSERT, UPDATE, DELETE, SELECT)                              |
| `models`       | Representa as entidades do sistema (classes e interfaces tipadas)                  |
| `database`     | Configuração de conexão e script de criação do banco                               |
| `utils`        | Funções auxiliares reutilizáveis (validações, leitura de terminal, erros)          |

### Decisões técnicas

- **Separação entre Menu e Controller**: cada módulo (Autores, Livros, Clientes, Empréstimos, Relatórios) tem um arquivo de `Menu` (cuida só da navegação: exibir opções, ler a escolha do usuário, decidir qual ação chamar, tratar erros) e um arquivo de `Controller` (cuida só da ação em si: fazer as perguntas específicas, chamar o `Service`, mostrar o resultado). Isso evita que uma única classe misture "como navegar" com "o que cada opção faz".
- **Injeção de dependência simples via construtor**: cada `Service` recebe seus `Repository` (com valor padrão), cada `Controller` recebe seu `Service`, e cada `Menu` recebe seu `Controller`. Isso facilita testes e reduz acoplamento direto às implementações.
- **Classe de erro de negócio (`ErroNegocio`)**: erros previstos pelas regras da aplicação (ex.: livro inexistente, e-mail duplicado) lançam essa exceção específica, capturada pelos `Menus` para exibir mensagens claras sem interromper a aplicação.
- **`BaseMenu` (herança)**: todos os menus (`AutorMenu`, `LivroMenu`, `ClienteMenu`, `EmprestimoMenu`, `RelatorioMenu`) estendem uma classe abstrata `BaseMenu`, que concentra o tratamento padrão de erros (`tratarErro`). Isso evita duplicar o mesmo bloco de código em cada menu — é um exemplo direto de herança em POO aplicado para eliminar repetição.
- **Camada `Repository` isolando SQL**: apenas os `Repositories` conhecem comandos SQL e a biblioteca `pg`, o que mantém `Services` livres de detalhes de persistência.
- **Controle de disponibilidade de livros**: a coluna `quantidade_disponivel` é decrementada/incrementada diretamente pelo `LivroRepository` nas operações de empréstimo/devolução, garantindo consistência via SQL.
- **Bloqueio de exclusões que quebrariam integridade referencial** (ex.: não remover autor com livros vinculados, não remover livro/cliente com empréstimos vinculados) é validado na camada de `Service`, antes de qualquer instrução `DELETE`.


## 📂 Estrutura de pastas

bookstore-manager-cli/
├── src/
│   ├── main.ts
│   ├── controllers/
│   │   ├── autorController.ts
│   │   ├── livroController.ts
│   │   ├── clienteController.ts
│   │   ├── emprestimoController.ts
│   │   └── relatorioController.ts
│   ├── menus/
│   │   ├── main.ts
│   │   ├── baseMenu.ts
│   │   ├── autorMenu.ts
│   │   ├── livroMenu.ts
│   │   ├── clienteMenu.ts
│   │   ├── emprestimoMenu.ts
│   │   └── relatorioMenu.ts
│   ├── services/
│   │   ├── autorService.ts
│   │   ├── livroService.ts
│   │   ├── clienteService.ts
│   │   ├── emprestimoService.ts
│   │   └── relatorioService.ts
│   ├── repositories/
│   │   ├── autorRepository.ts
│   │   ├── livroRepository.ts
│   │   ├── clienteRepository.ts
│   │   ├── emprestimoRepository.ts
│   │   └── relatorioRepository.ts
│   ├── models/
│   │   ├── autor.ts
│   │   ├── livro.ts
│   │   ├── cliente.ts
│   │   └── emprestimo.ts
│   ├── database/
│   │   ├── connection.ts
│   │   └── schema.sql
│   └── utils/
│       ├── input.ts
│       ├── validations.ts
│       └── erros.ts
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md

## ✅ Requisitos para execução

- [Node.js](https://nodejs.org/) v18 ou superior;
- [PostgreSQL](https://www.postgresql.org/) v13 ou superior instalado e em execução;
- npm (instalado junto com o Node.js).

## 🗄 Configuração do banco de dados

1. Certifique-se de que o serviço do PostgreSQL está em execução.

2. Crie o banco de dados que a aplicação irá utilizar.

   **Linux / Mac:**
   createdb bookstore_manager
   

   **Windows** (se os comandos `psql`/`createdb` não forem reconhecidos no terminal, use o caminho completo do executável, ajustando a versão instalada — neste projeto, PostgreSQL 18):
   powershell
   & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres
   
   Dentro do console do `psql`, crie o banco:
   CREATE DATABASE bookstore_manager;
   

   > 💡 **Dica:** para não precisar digitar o caminho completo toda vez, adicione `C:\Program Files\PostgreSQL\18\bin` às variáveis de ambiente (PATH) do Windows. Depois disso, os comandos `psql` e `createdb` funcionam normalmente em qualquer terminal.

3. Execute o script de criação das tabelas (localizado em `src/database/schema.sql`), a partir da **raiz do projeto** (não da pasta `src`):

   **Linux / Mac:**

   psql -U postgres -d bookstore_manager -f src/database/schema.sql
   

   **Windows** (sem PATH configurado):
   powershell
   & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d bookstore_manager -f src/database/schema.sql
   

   O script cria as tabelas `autores`, `livros`, `clientes` e `emprestimos`, já com chaves primárias, chaves estrangeiras e índices.

## 📥 Instalação

# 1. Clone o repositório
git clone <https://github.com/lincolnlsantosjr/BookStore-Manager-CLI.git>
cd bookstore-manager-cli

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env


Edite o arquivo `.env` com as credenciais do seu PostgreSQL:


DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=bookstore_manager


## ▶ Execução

**Modo desenvolvimento** (com hot-reload):

npm run dev


**Modo produção** (compilar e executar):

npm run build
npm start


Ao iniciar, a aplicação testa a conexão com o banco de dados e exibe o menu principal:


===================================
   BOOKSTORE MANAGER CLI
===================================
1 - Autores
2 - Livros
3 - Clientes
4 - Empréstimos
5 - Relatórios
0 - Encerrar aplicação


## 🧩 Funcionalidades implementadas

### Autores

- Cadastrar, listar, consultar por ID, atualizar e remover autores.
- Bloqueio de remoção quando o autor possui livros vinculados.

### Livros

- Cadastrar, listar, consultar por ID, atualizar e remover livros.
- Todo livro deve estar vinculado a um autor previamente cadastrado.
- Bloqueio de remoção quando o livro possui empréstimos vinculados.

### Clientes

- Cadastrar, listar, consultar por ID, atualizar e remover clientes.
- Validação de e-mail e bloqueio de e-mails duplicados.
- Bloqueio de remoção quando o cliente possui empréstimos vinculados.

### Empréstimos

- Registrar empréstimo (validando existência de livro/cliente e disponibilidade de exemplares).
- Registrar devolução (atualiza status e devolve o exemplar ao estoque).
- Consultar empréstimos, com dados do livro e do cliente via `JOIN`.

### Relatórios

- Livros disponíveis;
- Livros emprestados;
- Livros cadastrados por autor (`GROUP BY` + `COUNT`);
- Quantidade de empréstimos por livro (`GROUP BY`, `ORDER BY`, `LIMIT`);
- Clientes com empréstimos ativos.

## 💡 Exemplos de utilização

**Cadastrar um autor:**


Escolha uma opção: 1
1 - Cadastrar autor
Nome: Machado de Assis
Nacionalidade (opcional): Brasileiro
Data de nascimento AAAA-MM-DD (opcional): 1839-06-21

Autor cadastrado com sucesso! ID: 1


**Registrar um empréstimo:**


Escolha uma opção: 4
1 - Registrar empréstimo
ID do livro: 1
ID do cliente: 1

✔ Empréstimo registrado com sucesso! ID: 1


**Consultar relatório de livros cadastrados por autor:**


┌─────────┬────────────────────┬──────────────────┐
│ (index) │ Autor              │ Total de Livros   │
├─────────┼────────────────────┼──────────────────┤
│ 0       │ 'Machado de Assis' │ 1                 │
└─────────┴────────────────────┴──────────────────┘


## 📊 Relatórios disponíveis

| Relatório                       | Consulta SQL utilizada                              |
| -------------------------------- | ----------------------------------------------------- |
| Livros disponíveis              | `JOIN` autores + `WHERE quantidade_disponivel > 0`  |
| Livros emprestados              | `JOIN` livros + clientes + `WHERE status = 'ativo'` |
| Livros cadastrados por autor    | `LEFT JOIN` + `GROUP BY` + `COUNT`                  |
| Empréstimos por livro           | `LEFT JOIN` + `GROUP BY` + `ORDER BY` + `LIMIT`     |
| Clientes com empréstimos ativos | `JOIN` + `GROUP BY` + `COUNT`                       |

## ⚠ Tratamento de erros

Todas as operações críticas utilizam blocos `try/catch`. Situações inválidas (autor/livro/cliente/empréstimo inexistente, livro sem disponibilidade, e-mail duplicado, tentativa de remoção com vínculos ativos, etc.) lançam uma exceção de negócio (`ErroNegocio`), tratada de forma centralizada pela `BaseMenu` (herdada por todos os menus) para exibir mensagens claras ao usuário **sem interromper a execução da aplicação**.

