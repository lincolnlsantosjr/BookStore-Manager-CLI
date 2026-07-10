DROP TABLE IF EXISTS emprestimos CASCADE;
DROP TABLE IF EXISTS livros CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS autores CASCADE;

CREATE TABLE autores (
    id               SERIAL PRIMARY KEY,
    nome             VARCHAR(150) NOT NULL,
    nacionalidade    VARCHAR(100),
    data_nascimento  DATE
);

CREATE TABLE livros (
    id                     SERIAL PRIMARY KEY,
    titulo                 VARCHAR(200) NOT NULL,
    autor_id               INTEGER NOT NULL REFERENCES autores(id) ON DELETE CASCADE,
    genero                 VARCHAR(100),
    ano_publicacao         INTEGER,
    quantidade_total       INTEGER NOT NULL DEFAULT 1 CHECK (quantidade_total >= 0),
    quantidade_disponivel  INTEGER NOT NULL DEFAULT 1 CHECK (quantidade_disponivel >= 0)
);

CREATE TABLE clientes (
    id        SERIAL PRIMARY KEY,
    nome      VARCHAR(150) NOT NULL,
    email     VARCHAR(150) NOT NULL UNIQUE,
    telefone  VARCHAR(20)
);

CREATE TABLE emprestimos (
    id                SERIAL PRIMARY KEY,
    livro_id          INTEGER NOT NULL REFERENCES livros(id) ON DELETE CASCADE,
    cliente_id        INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    data_emprestimo   TIMESTAMP NOT NULL DEFAULT NOW(),
    data_devolucao    TIMESTAMP,
    status            VARCHAR(20) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'devolvido'))
);

CREATE INDEX idx_livros_autor_id ON livros(autor_id);
CREATE INDEX idx_emprestimos_livro_id ON emprestimos(livro_id);
CREATE INDEX idx_emprestimos_cliente_id ON emprestimos(cliente_id);
CREATE INDEX idx_emprestimos_status ON emprestimos(status);
