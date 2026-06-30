using Microsoft.EntityFrameworkCore;
using System.Data;

namespace VoluntaMais.Api.Data
{
    public static class DatabaseSchemaInitializer
    {
        public static async Task EnsureSchemaAsync(AppDbContext db)
        {
            var commands = new[]
            {
                """
                CREATE TABLE IF NOT EXISTS `usuarios` (
                    `Id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                    `Nome` VARCHAR(150) NOT NULL,
                    `Email` VARCHAR(150) NOT NULL,
                    `Senha` VARCHAR(255) NOT NULL,
                    `Telefone` VARCHAR(30) NULL,
                    `Tipo` ENUM('Superadmin','Admin','Instituicao','Voluntario') NOT NULL,
                    `Cidade` VARCHAR(100) NULL,
                    `Estado` CHAR(2) NULL,
                    `Ativo` TINYINT(1) NOT NULL DEFAULT 1,
                    `CriadoEm` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (`Id`),
                    UNIQUE KEY `IX_usuarios_Email` (`Email`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """,
                """
                CREATE TABLE IF NOT EXISTS `categorias` (
                    `Id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                    `Nome` VARCHAR(120) NOT NULL,
                    PRIMARY KEY (`Id`),
                    UNIQUE KEY `IX_categorias_Nome` (`Nome`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """,
                """
                CREATE TABLE IF NOT EXISTS `habilidades` (
                    `Id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                    `Nome` VARCHAR(120) NOT NULL,
                    PRIMARY KEY (`Id`),
                    UNIQUE KEY `IX_habilidades_Nome` (`Nome`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """,
                """
                CREATE TABLE IF NOT EXISTS `palavras_bloqueadas` (
                    `Id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                    `Palavra` VARCHAR(120) NOT NULL,
                    `Ativo` TINYINT(1) NOT NULL DEFAULT 1,
                    PRIMARY KEY (`Id`),
                    UNIQUE KEY `IX_palavras_bloqueadas_Palavra` (`Palavra`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """,
                """
                CREATE TABLE IF NOT EXISTS `ocupacoes` (
                    `Id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                    `Nome` VARCHAR(120) NOT NULL,
                    PRIMARY KEY (`Id`),
                    UNIQUE KEY `IX_ocupacoes_Nome` (`Nome`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """,
                """
                CREATE TABLE IF NOT EXISTS `instituicoes` (
                    `Id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                    `UsuarioId` BIGINT UNSIGNED NOT NULL,
                    `Nome` VARCHAR(180) NOT NULL,
                    `Cnpj` VARCHAR(30) NULL,
                    `Responsavel` VARCHAR(150) NULL,
                    `Descricao` TEXT NULL,
                    `Status` ENUM('Pendente','Aprovada','Reprovada') NOT NULL DEFAULT 'Pendente',
                    `CriadoEm` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (`Id`),
                    INDEX `IX_instituicoes_UsuarioId` (`UsuarioId`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """,
                """
                CREATE TABLE IF NOT EXISTS `voluntarios` (
                    `Id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                    `UsuarioId` BIGINT UNSIGNED NOT NULL,
                    `DataNascimento` DATE NULL,
                    `Genero` VARCHAR(30) NULL,
                    `Disponibilidade` VARCHAR(255) NULL,
                    `Habilidades` TEXT NULL,
                    `CriadoEm` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    `Bio` TEXT NULL,
                    `Experiencia` TEXT NULL,
                    `Interesses` TEXT NULL,
                    `PreferenciasAcessibilidade` TEXT NULL,
                    `NecessitaAcessibilidade` TINYINT(1) NOT NULL DEFAULT 0,
                    `AceitaContatoWhatsapp` TINYINT(1) NOT NULL DEFAULT 1,
                    `AtualizadoEm` DATETIME NULL,
                    PRIMARY KEY (`Id`),
                    INDEX `IX_voluntarios_UsuarioId` (`UsuarioId`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """,
                """
                CREATE TABLE IF NOT EXISTS `oportunidades` (
                    `Id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                    `InstituicaoId` BIGINT UNSIGNED NOT NULL,
                    `CategoriaId` BIGINT UNSIGNED NULL,
                    `Titulo` VARCHAR(180) NOT NULL,
                    `Tipo` ENUM('Campanha','Evento','Projeto') NOT NULL,
                    `Descricao` TEXT NULL,
                    `ImagemUrl` LONGTEXT NULL,
                    `Objetivo` TEXT NULL,
                    `Cidade` VARCHAR(100) NULL,
                    `Estado` CHAR(2) NULL,
                    `DataInicio` DATETIME NOT NULL,
                    `DataFim` DATETIME NULL,
                    `Vagas` INT UNSIGNED NOT NULL DEFAULT 1,
                    `Status` ENUM('Pendente','Aprovada','Reprovada','Ativa','Encerrada') NOT NULL DEFAULT 'Pendente',
                    `CriadoEm` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    `Requisitos` TEXT NULL,
                    `Turno` VARCHAR(60) NULL,
                    `LocalDetalhado` VARCHAR(180) NULL,
                    `AceitaSemFormacao` TINYINT(1) NOT NULL DEFAULT 1,
                    `PrecisaApoioCriancas` TINYINT(1) NOT NULL DEFAULT 0,
                    PRIMARY KEY (`Id`),
                    INDEX `IX_oportunidades_InstituicaoId` (`InstituicaoId`),
                    INDEX `IX_oportunidades_CategoriaId` (`CategoriaId`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """,
                """
                CREATE TABLE IF NOT EXISTS `inscricoes` (
                    `Id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                    `OportunidadeId` BIGINT UNSIGNED NOT NULL,
                    `VoluntarioId` BIGINT UNSIGNED NOT NULL,
                    `Status` ENUM('Pendente','Aprovada','Reprovada','Concluida','Cancelada') NOT NULL DEFAULT 'Pendente',
                    `MotivoReprovacao` VARCHAR(500) NULL,
                    `CriadoEm` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    `AtualizadoEm` DATETIME NULL,
                    PRIMARY KEY (`Id`),
                    UNIQUE KEY `IX_inscricoes_OportunidadeId_VoluntarioId` (`OportunidadeId`, `VoluntarioId`),
                    INDEX `IX_inscricoes_VoluntarioId` (`VoluntarioId`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """,
                """
                CREATE TABLE IF NOT EXISTS `feedbacks` (
                    `Id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                    `InscricaoId` BIGINT UNSIGNED NOT NULL,
                    `Autor` ENUM('Instituicao','Voluntario') NOT NULL,
                    `Nota` TINYINT UNSIGNED NOT NULL,
                    `Comentario` VARCHAR(500) NULL,
                    `RespostasJson` VARCHAR(4000) NULL,
                    `CriadoEm` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (`Id`),
                    INDEX `IX_feedbacks_InscricaoId` (`InscricaoId`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """,
                """
                CREATE TABLE IF NOT EXISTS `notificacoes` (
                    `Id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                    `UsuarioId` BIGINT UNSIGNED NOT NULL,
                    `Titulo` VARCHAR(180) NOT NULL,
                    `Mensagem` VARCHAR(500) NOT NULL,
                    `Lida` TINYINT(1) NOT NULL DEFAULT 0,
                    `CriadoEm` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (`Id`),
                    INDEX `IX_notificacoes_UsuarioId` (`UsuarioId`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """,
                """
                CREATE TABLE IF NOT EXISTS `voluntario_habilidades` (
                    `Id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                    `VoluntarioId` BIGINT UNSIGNED NOT NULL,
                    `HabilidadeId` BIGINT UNSIGNED NOT NULL,
                    `NivelInteresse` VARCHAR(30) NOT NULL DEFAULT 'Interesse',
                    `CriadoEm` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (`Id`),
                    UNIQUE KEY `IX_voluntario_habilidades_VoluntarioId_HabilidadeId` (`VoluntarioId`, `HabilidadeId`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """,
                """
                CREATE TABLE IF NOT EXISTS `seed_history` (
                    `Id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                    `Nome` VARCHAR(120) NOT NULL,
                    `AplicadoEm` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (`Id`),
                    UNIQUE KEY `IX_seed_history_Nome` (`Nome`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """
            };

            foreach (var command in commands)
            {
                await db.Database.ExecuteSqlRawAsync(command);
            }

            var columns = new[]
            {
                new ColumnSpec("oportunidades", "ImagemUrl", "LONGTEXT NULL"),
                new ColumnSpec("oportunidades", "Requisitos", "TEXT NULL"),
                new ColumnSpec("oportunidades", "Turno", "VARCHAR(60) NULL"),
                new ColumnSpec("oportunidades", "LocalDetalhado", "VARCHAR(180) NULL"),
                new ColumnSpec("oportunidades", "DataFimInscricoes", "DATETIME NULL"),
                new ColumnSpec("oportunidades", "AceitaSemFormacao", "TINYINT(1) NOT NULL DEFAULT 1"),
                new ColumnSpec("oportunidades", "PrecisaApoioCriancas", "TINYINT(1) NOT NULL DEFAULT 0"),
                new ColumnSpec("usuarios", "Anonimizado", "TINYINT(1) NOT NULL DEFAULT 0"),
                new ColumnSpec("usuarios", "DataExclusao", "DATETIME NULL"),
                new ColumnSpec("voluntarios", "Cpf", "VARCHAR(14) NULL"),
                new ColumnSpec("voluntarios", "Etnia", "VARCHAR(50) NULL"),
                new ColumnSpec("voluntarios", "Bio", "TEXT NULL"),
                new ColumnSpec("voluntarios", "Experiencia", "TEXT NULL"),
                new ColumnSpec("voluntarios", "Interesses", "TEXT NULL"),
                new ColumnSpec("voluntarios", "PreferenciasAcessibilidade", "TEXT NULL"),
                new ColumnSpec("voluntarios", "NecessitaAcessibilidade", "TINYINT(1) NOT NULL DEFAULT 0"),
                new ColumnSpec("voluntarios", "AceitaContatoWhatsapp", "TINYINT(1) NOT NULL DEFAULT 1"),
                new ColumnSpec("voluntarios", "AtualizadoEm", "DATETIME NULL"),
                new ColumnSpec("inscricoes", "Motivacao", "VARCHAR(1000) NULL"),
                new ColumnSpec("inscricoes", "Disponibilidade", "VARCHAR(255) NULL"),
                new ColumnSpec("inscricoes", "Experiencia", "TEXT NULL"),
                new ColumnSpec("inscricoes", "MotivoReprovacao", "VARCHAR(500) NULL"),
                new ColumnSpec("inscricoes", "AtualizadoEm", "DATETIME NULL"),
                new ColumnSpec("inscricoes", "HorasComprovadas", "INT NULL"),
                new ColumnSpec("inscricoes", "CertificadoGerado", "TINYINT(1) NOT NULL DEFAULT 0"),
                new ColumnSpec("feedbacks", "RespostasJson", "VARCHAR(4000) NULL"),
                new ColumnSpec("notificacoes", "Lida", "TINYINT(1) NOT NULL DEFAULT 0")
            };

            foreach (var column in columns)
            {
                if (!await ColumnExistsAsync(db, column.Table, column.Name))
                {
                    await ExecuteNonQueryAsync(
                        db,
                        $"ALTER TABLE `{column.Table}` ADD COLUMN `{column.Name}` {column.Definition};");
                }
            }

            await SeedLookupDataAsync(db);
        }

        private static async Task SeedLookupDataAsync(AppDbContext db)
        {
            await ExecuteNonQueryAsync(
                db,
                """
                INSERT INTO `ocupacoes` (`Id`, `Nome`) VALUES
                    (1, 'Estudante'),
                    (2, 'Empregado(a)'),
                    (3, 'Autônomo(a)'),
                    (4, 'Empresário(a)'),
                    (5, 'Aposentado(a)'),
                    (6, 'Desempregado(a)'),
                    (7, 'Outro')
                ON DUPLICATE KEY UPDATE `Nome` = VALUES(`Nome`);
                """);

            await ExecuteNonQueryAsync(
                db,
                """
                INSERT INTO `categorias` (`Id`, `Nome`) VALUES
                    (1, 'Educacao'),
                    (2, 'Saude'),
                    (3, 'Meio Ambiente'),
                    (4, 'Assistencia Social'),
                    (5, 'Cultura'),
                    (6, 'Esporte'),
                    (7, 'Tecnologia'),
                    (8, 'Protecao Animal'),
                    (9, 'Idosos'),
                    (10, 'Seguranca Alimentar'),
                    (11, 'Empregabilidade'),
                    (12, 'Inclusao'),
                    (13, 'Educacao Inclusiva'),
                    (14, 'Eventos'),
                    (15, 'Lazer'),
                    (16, 'Administrativo')
                ON DUPLICATE KEY UPDATE `Nome` = VALUES(`Nome`);
                """);

            await ExecuteNonQueryAsync(
                db,
                """
                INSERT INTO `habilidades` (`Id`, `Nome`) VALUES
                    (1, 'Comunicacao'),
                    (2, 'Organizacao'),
                    (3, 'Ensino'),
                    (4, 'Atendimento'),
                    (5, 'Logistica'),
                    (6, 'Primeiros Socorros'),
                    (7, 'Redes Sociais'),
                    (8, 'Mentoria'),
                    (9, 'Cozinha'),
                    (10, 'Fotografia'),
                    (11, 'Transporte'),
                    (12, 'Tecnologia'),
                    (13, 'Recreacao'),
                    (14, 'Captacao de Recursos'),
                    (15, 'Triagem'),
                    (16, 'Acolhimento'),
                    (17, 'Organização de eventos'),
                    (18, 'Cuidado de crianças'),
                    (19, 'Escuta ativa'),
                    (20, 'Apoio operacional'),
                    (21, 'Tecnologia assistiva'),
                    (22, 'Recepção'),
                    (23, 'Acolhimento familiar'),
                    (24, 'Orientação social')
                ON DUPLICATE KEY UPDATE `Nome` = VALUES(`Nome`);
                """);
        }

        private static async Task ExecuteNonQueryAsync(AppDbContext db, string sql)
        {
            var connection = db.Database.GetDbConnection();
            if (connection.State != ConnectionState.Open)
            {
                await connection.OpenAsync();
            }

            await using var command = connection.CreateCommand();
            command.CommandText = sql;
            await command.ExecuteNonQueryAsync();
        }

        private static async Task<bool> ColumnExistsAsync(AppDbContext db, string table, string column)
        {
            var connection = db.Database.GetDbConnection();
            if (connection.State != ConnectionState.Open)
            {
                await connection.OpenAsync();
            }

            await using var command = connection.CreateCommand();
            command.CommandText = """
                SELECT COUNT(*)
                FROM information_schema.COLUMNS
                WHERE TABLE_SCHEMA = DATABASE()
                  AND TABLE_NAME = @table
                  AND COLUMN_NAME = @column;
                """;

            var tableParameter = command.CreateParameter();
            tableParameter.ParameterName = "@table";
            tableParameter.Value = table;
            command.Parameters.Add(tableParameter);

            var columnParameter = command.CreateParameter();
            columnParameter.ParameterName = "@column";
            columnParameter.Value = column;
            command.Parameters.Add(columnParameter);

            var result = await command.ExecuteScalarAsync();
            return Convert.ToInt32(result) > 0;
        }

        private sealed record ColumnSpec(string Table, string Name, string Definition);
    }
}
