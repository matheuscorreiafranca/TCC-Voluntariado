-- Migration aditiva para o Portal Premium do Voluntario IVG.
-- Segura para reaplicar: verifica colunas e indices antes de criar.

DELIMITER $$

DROP PROCEDURE IF EXISTS add_column_if_missing $$
CREATE PROCEDURE add_column_if_missing(
    IN p_table VARCHAR(64),
    IN p_column VARCHAR(64),
    IN p_definition TEXT
)
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = p_table
          AND COLUMN_NAME = p_column
    ) THEN
        SET @sql = CONCAT('ALTER TABLE `', p_table, '` ADD COLUMN `', p_column, '` ', p_definition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END $$

DROP PROCEDURE IF EXISTS add_index_if_missing $$
CREATE PROCEDURE add_index_if_missing(
    IN p_table VARCHAR(64),
    IN p_index VARCHAR(64),
    IN p_columns TEXT
)
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.STATISTICS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = p_table
          AND INDEX_NAME = p_index
    ) THEN
        SET @sql = CONCAT('CREATE INDEX `', p_index, '` ON `', p_table, '` (', p_columns, ')');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END $$

DELIMITER ;

ALTER TABLE usuarios
  MODIFY Tipo ENUM('Superadmin','Admin','Instituicao','Voluntario') NOT NULL;

CALL add_column_if_missing('voluntarios', 'Bio', 'TEXT NULL');
CALL add_column_if_missing('voluntarios', 'Experiencia', 'TEXT NULL');
CALL add_column_if_missing('voluntarios', 'Interesses', 'TEXT NULL');
CALL add_column_if_missing('voluntarios', 'PreferenciasAcessibilidade', 'TEXT NULL');
CALL add_column_if_missing('voluntarios', 'NecessitaAcessibilidade', 'TINYINT(1) NOT NULL DEFAULT 0');
CALL add_column_if_missing('voluntarios', 'AceitaContatoWhatsapp', 'TINYINT(1) NOT NULL DEFAULT 1');
CALL add_column_if_missing('voluntarios', 'AtualizadoEm', 'DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP');

CALL add_column_if_missing('oportunidades', 'Requisitos', 'TEXT NULL');
CALL add_column_if_missing('oportunidades', 'Turno', 'VARCHAR(60) NULL');
CALL add_column_if_missing('oportunidades', 'LocalDetalhado', 'VARCHAR(180) NULL');
CALL add_column_if_missing('oportunidades', 'AceitaSemFormacao', 'TINYINT(1) NOT NULL DEFAULT 1');
CALL add_column_if_missing('oportunidades', 'PrecisaApoioCriancas', 'TINYINT(1) NOT NULL DEFAULT 0');

CREATE TABLE IF NOT EXISTS voluntario_habilidades (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    VoluntarioId BIGINT UNSIGNED NOT NULL,
    HabilidadeId BIGINT UNSIGNED NOT NULL,
    NivelInteresse VARCHAR(30) NOT NULL DEFAULT 'Interesse',
    CriadoEm DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_voluntario_habilidades_voluntario
        FOREIGN KEY (VoluntarioId) REFERENCES voluntarios(Id)
        ON DELETE CASCADE,
    CONSTRAINT fk_voluntario_habilidades_habilidade
        FOREIGN KEY (HabilidadeId) REFERENCES habilidades(Id)
        ON DELETE CASCADE,
    UNIQUE KEY ux_voluntario_habilidade (VoluntarioId, HabilidadeId)
);

CALL add_index_if_missing('oportunidades', 'ix_oportunidades_instituicao_tipo_status', '`InstituicaoId`, `Tipo`, `Status`');
CALL add_index_if_missing('oportunidades', 'ix_oportunidades_categoria_data', '`CategoriaId`, `DataInicio`');
CALL add_index_if_missing('inscricoes', 'ix_inscricoes_voluntario_status', '`VoluntarioId`, `Status`');
CALL add_index_if_missing('notificacoes', 'ix_notificacoes_usuario_lida', '`UsuarioId`, `Lida`');

INSERT IGNORE INTO habilidades (Nome) VALUES
('Acolhimento'),
('Organização de eventos'),
('Cuidado de crianças'),
('Escuta ativa'),
('Apoio operacional'),
('Tecnologia assistiva'),
('Recepção'),
('Comunicação'),
('Acolhimento familiar'),
('Orientação social');

UPDATE oportunidades
SET
    Requisitos = COALESCE(Requisitos, 'Disponibilidade para atuação voluntária, postura acolhedora e compromisso com a inclusão.'),
    Turno = COALESCE(Turno, 'Conforme programação'),
    LocalDetalhado = COALESCE(LocalDetalhado, 'Santos/SP - local definido pela organização do IVG'),
    AceitaSemFormacao = 1,
    PrecisaApoioCriancas = CASE
        WHEN Titulo LIKE '%Mães%' OR Titulo LIKE '%Família%' OR Titulo LIKE '%Crianças%' OR Descricao LIKE '%crianças%' THEN 1
        ELSE PrecisaApoioCriancas
    END
WHERE InstituicaoId = 6;

UPDATE voluntarios
SET
    Bio = COALESCE(Bio, 'Voluntário disponível para ações sociais, acolhimento e apoio operacional.'),
    Experiencia = COALESCE(Experiencia, Habilidades),
    Interesses = COALESCE(Interesses, Habilidades),
    AceitaContatoWhatsapp = 1
WHERE Id > 0;

INSERT IGNORE INTO voluntario_habilidades (VoluntarioId, HabilidadeId, NivelInteresse)
SELECT v.Id, h.Id, 'Interesse'
FROM voluntarios v
JOIN habilidades h
  ON LOWER(CONCAT(',', REPLACE(v.Habilidades, ', ', ','), ',')) LIKE CONCAT('%,', LOWER(h.Nome), ',%')
WHERE v.Habilidades IS NOT NULL;

DROP PROCEDURE IF EXISTS add_column_if_missing;
DROP PROCEDURE IF EXISTS add_index_if_missing;
