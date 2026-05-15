-- voluntariado_minimo.sql
-- Modelagem minima para cumprir os requisitos principais do sistema de voluntariado.
-- MySQL 8+ / MariaDB 10.4+
-- Sem views, sem tabelas de status separadas, sem complexidade desnecessaria.

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS feedbacks;
DROP TABLE IF EXISTS notificacoes;
DROP TABLE IF EXISTS inscricoes;
DROP TABLE IF EXISTS oportunidades;
DROP TABLE IF EXISTS voluntarios;
DROP TABLE IF EXISTS instituicoes;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS habilidades;
DROP TABLE IF EXISTS palavras_bloqueadas;

SET FOREIGN_KEY_CHECKS = 1;

-- Usuarios do sistema: Superadmin, Admin da instituicao e Voluntario
CREATE TABLE usuarios (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(150) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    Senha VARCHAR(255) NOT NULL,
    Telefone VARCHAR(30),
    Tipo ENUM('Superadmin', 'Admin', 'Instituicao', 'Voluntario') NOT NULL,
    Cidade VARCHAR(100),
    Estado CHAR(2),
    Ativo BOOLEAN NOT NULL DEFAULT TRUE,
    CriadoEm DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Cadastro da instituicao
CREATE TABLE instituicoes (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    UsuarioId BIGINT UNSIGNED NOT NULL,
    Nome VARCHAR(180) NOT NULL,
    Cnpj VARCHAR(30),
    Responsavel VARCHAR(150),
    Descricao TEXT,
    Status ENUM('Pendente', 'Aprovada', 'Reprovada') NOT NULL DEFAULT 'Pendente',
    CriadoEm DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UsuarioId) REFERENCES usuarios(Id)
);

-- Cadastro do voluntario
CREATE TABLE voluntarios (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    UsuarioId BIGINT UNSIGNED NOT NULL,
    DataNascimento DATE,
    Genero VARCHAR(30),
    Disponibilidade VARCHAR(255),
    Habilidades TEXT,
    CriadoEm DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UsuarioId) REFERENCES usuarios(Id)
);

-- Categorias para campanhas, eventos e projetos
CREATE TABLE categorias (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(120) NOT NULL UNIQUE
);

-- Habilidades/funcoes simples para filtro e compatibilidade
CREATE TABLE habilidades (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(120) NOT NULL UNIQUE
);

-- Tabela unica para campanha, evento e projeto
CREATE TABLE oportunidades (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    InstituicaoId BIGINT UNSIGNED NOT NULL,
    CategoriaId BIGINT UNSIGNED,
    Titulo VARCHAR(180) NOT NULL,
    Tipo ENUM('Campanha', 'Evento', 'Projeto') NOT NULL,
    Descricao TEXT,
    Objetivo TEXT,
    Cidade VARCHAR(100),
    Estado CHAR(2),
    DataInicio DATETIME NOT NULL,
    DataFim DATETIME,
    Vagas INT UNSIGNED NOT NULL DEFAULT 1,
    Status ENUM('Pendente', 'Aprovada', 'Reprovada', 'Ativa', 'Encerrada') NOT NULL DEFAULT 'Pendente',
    CriadoEm DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (InstituicaoId) REFERENCES instituicoes(Id),
    FOREIGN KEY (CategoriaId) REFERENCES categorias(Id)
);

-- Inscricao do voluntario em campanha/evento/projeto
CREATE TABLE inscricoes (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    OportunidadeId BIGINT UNSIGNED NOT NULL,
    VoluntarioId BIGINT UNSIGNED NOT NULL,
    Status ENUM('Pendente', 'Aprovada', 'Reprovada', 'Concluida', 'Cancelada') NOT NULL DEFAULT 'Pendente',
    MotivoReprovacao VARCHAR(500),
    CriadoEm DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    AtualizadoEm DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (OportunidadeId) REFERENCES oportunidades(Id),
    FOREIGN KEY (VoluntarioId) REFERENCES voluntarios(Id),
    UNIQUE KEY inscricao_unica (OportunidadeId, VoluntarioId)
);

-- Feedback para voluntario ou instituicao apos participacao
CREATE TABLE feedbacks (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    InscricaoId BIGINT UNSIGNED NOT NULL,
    Autor ENUM('Instituicao', 'Voluntario') NOT NULL,
    Nota TINYINT UNSIGNED NOT NULL,
    Comentario VARCHAR(500),
    CriadoEm DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (InscricaoId) REFERENCES inscricoes(Id)
);

-- Notificacoes simples
CREATE TABLE notificacoes (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    UsuarioId BIGINT UNSIGNED NOT NULL,
    Titulo VARCHAR(180) NOT NULL,
    Mensagem VARCHAR(500) NOT NULL,
    Lida BOOLEAN NOT NULL DEFAULT FALSE,
    CriadoEm DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UsuarioId) REFERENCES usuarios(Id)
);

-- Filtro de palavras inadequadas
CREATE TABLE palavras_bloqueadas (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Palavra VARCHAR(120) NOT NULL UNIQUE,
    Ativo BOOLEAN NOT NULL DEFAULT TRUE
);

-- Dados basicos para testes

INSERT INTO categorias (Nome) VALUES
('Assistencia Social'),
('Acolhimento Familiar'),
('Inclusao'),
('Cuidado'),
('Formacao');

INSERT INTO habilidades (Nome) VALUES
('Acolhimento'),
('Organizacao de eventos'),
('Cuidado de criancas'),
('Atendimento a familias'),
('Apoio operacional');

INSERT INTO palavras_bloqueadas (Palavra) VALUES
('ofensa'),
('xingamento'),
('discriminacao');

INSERT INTO usuarios (Nome, Email, Senha, Tipo, Cidade, Estado) VALUES
('Superadmin IVG', 'superadmin@ivg.local', '123456', 'Superadmin', 'Santos', 'SP'),
('Admin Instituto Vitor Gabriel', 'admin@ivg.local', '123456', 'Instituicao', 'Santos', 'SP'),
('Voluntario IVG', 'voluntario@ivg.local', '123456', 'Voluntario', 'Santos', 'SP');

INSERT INTO instituicoes (UsuarioId, Nome, Cnpj, Responsavel, Descricao, Status) VALUES
(2, 'Instituto Vitor Gabriel', NULL, 'Instituto Vitor Gabriel', 'Acoes que promovem o protagonismo da pessoa com deficiencia e o cuidado a sua familia.', 'Aprovada');

INSERT INTO voluntarios (UsuarioId, DataNascimento, Genero, Disponibilidade, Habilidades) VALUES
(3, '2000-01-01', 'nao informado', 'Eventos e encontros', 'Acolhimento, apoio operacional, cuidado de criancas');

INSERT INTO oportunidades (
    InstituicaoId, CategoriaId, Titulo, Tipo, Descricao, Objetivo,
    Cidade, Estado, DataInicio, DataFim, Vagas, Status
) VALUES
(1, 3, 'Programa de Protagonismo da Pessoa com Deficiencia', 'Campanha',
 'Acao voltada ao fortalecimento do protagonismo da pessoa com deficiencia.',
 'Promover protagonismo, autonomia e participacao social da pessoa com deficiencia.',
 'Santos', 'SP', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 20, 'Ativa'),

(1, 2, 'Encontro de Acolhimento para Maes Atipicas', 'Evento',
 'Encontro de acolhimento, escuta e orientacao para maes atipicas e familiares.',
 'Acolher maes atipicas, fortalecer vinculos e orientar sobre cuidado, direitos e rede de apoio.',
 'Santos', 'SP', DATE_ADD(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 8 DAY), 15, 'Ativa'),

(1, 3, 'Projeto Autonomia e Vida Independente', 'Projeto',
 'Projeto para estimular autonomia, autoestima, convivencia comunitaria e participacao ativa.',
 'Incentivar independencia, confianca e inclusao social da pessoa com deficiencia.',
 'Santos', 'SP', DATE_ADD(NOW(), INTERVAL 3 DAY), DATE_ADD(NOW(), INTERVAL 90 DAY), 30, 'Aprovada');

-- Mapeamento dos requisitos atendidos:
-- 1. Cadastrar instituicao              -> usuarios + instituicoes
-- 2. Cadastrar voluntario               -> usuarios + voluntarios
-- 3. Criar campanha sazonal             -> oportunidades.Tipo = 'Campanha'
-- 4. Criar evento                       -> oportunidades.Tipo = 'Evento'
-- 5. Criar projeto                      -> oportunidades.Tipo = 'Projeto'
-- 6. Inscrever-se como voluntario       -> inscricoes
-- 7. Notificar usuario                  -> notificacoes
-- 8. Notificar instituicao de pedidos   -> notificacoes + inscricoes.Status = 'Pendente'
-- 9. Aprovar voluntario                 -> inscricoes.Status = 'Aprovada'
-- 10. Feedback ao voluntario            -> feedbacks.Autor = 'Instituicao'
-- 11. Feedback a instituicao            -> feedbacks.Autor = 'Voluntario'
-- 12. Fechar eventos apos prazo         -> oportunidades.Status = 'Encerrada'
-- 13. Gerenciar voluntarios             -> voluntarios + inscricoes
-- 14. Gerar relatorios                  -> SELECTs em oportunidades/inscricoes/feedbacks
-- 15. Campanhas aprovadas/reprovadas    -> oportunidades.Status
-- 16. Filtrar por categoria/funcao      -> categorias + habilidades/texto
-- 17. Filtro de palavras inadequadas    -> palavras_bloqueadas
