-- SQL de referência do modelo mínimo solicitado.
-- A API usa EF Core Code First + SQLite e cria voluntariado.db automaticamente no primeiro dotnet run.
-- Este arquivo fica como documentação da modelagem original do prompt.

CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    telefone TEXT,
    tipo TEXT NOT NULL,
    cidade TEXT,
    estado TEXT,
    ativo INTEGER NOT NULL DEFAULT 1,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE instituicoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    nome TEXT NOT NULL,
    cnpj TEXT,
    responsavel TEXT,
    descricao TEXT,
    status TEXT NOT NULL DEFAULT 'Pendente',
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE voluntarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    data_nascimento TEXT,
    genero TEXT,
    disponibilidade TEXT,
    habilidades TEXT,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE
);

CREATE TABLE habilidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE
);

CREATE TABLE oportunidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    instituicao_id INTEGER NOT NULL,
    categoria_id INTEGER,
    titulo TEXT NOT NULL,
    tipo TEXT NOT NULL,
    descricao TEXT,
    objetivo TEXT,
    cidade TEXT,
    estado TEXT,
    data_inicio TEXT NOT NULL,
    data_fim TEXT,
    vagas INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'Pendente',
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instituicao_id) REFERENCES instituicoes(id),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

CREATE TABLE inscricoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    oportunidade_id INTEGER NOT NULL,
    voluntario_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pendente',
    motivo_reprovacao TEXT,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TEXT,
    FOREIGN KEY (oportunidade_id) REFERENCES oportunidades(id),
    FOREIGN KEY (voluntario_id) REFERENCES voluntarios(id),
    UNIQUE (oportunidade_id, voluntario_id)
);

CREATE TABLE feedbacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inscricao_id INTEGER NOT NULL,
    autor TEXT NOT NULL,
    nota INTEGER NOT NULL,
    comentario TEXT,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inscricao_id) REFERENCES inscricoes(id)
);

CREATE TABLE notificacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    lida INTEGER NOT NULL DEFAULT 0,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE palavras_bloqueadas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    palavra TEXT NOT NULL UNIQUE,
    ativo INTEGER NOT NULL DEFAULT 1
);
