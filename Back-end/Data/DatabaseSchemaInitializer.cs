using Microsoft.EntityFrameworkCore;

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
                    `Id` BIGINT NOT NULL AUTO_INCREMENT,
                    `Nome` VARCHAR(150) NOT NULL,
                    `Email` VARCHAR(150) NOT NULL,
                    `Senha` VARCHAR(255) NOT NULL,
                    `Telefone` VARCHAR(30) NULL,
                    `Tipo` VARCHAR(32) NOT NULL,
                    `Cidade` VARCHAR(100) NULL,
                    `Estado` VARCHAR(2) NULL,
                    `Ativo` TINYINT(1) NOT NULL DEFAULT 1,
                    `CriadoEm` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                    PRIMARY KEY (`Id`),
                    UNIQUE KEY `IX_usuarios_Email` (`Email`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """,
                """
                CREATE TABLE IF NOT EXISTS `categorias` (
                    `Id` BIGINT NOT NULL AUTO_INCREMENT,
                    `Nome` VARCHAR(120) NOT NULL,
                    PRIMARY KEY (`Id`),
                    UNIQUE KEY `IX_categorias_Nome` (`Nome`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """,
                """
                CREATE TABLE IF NOT EXISTS `habilidades` (
                    `Id` BIGINT NOT NULL AUTO_INCREMENT,
                    `Nome` VARCHAR(120) NOT NULL,
                    PRIMARY KEY (`Id`),
                    UNIQUE KEY `IX_habilidades_Nome` (`Nome`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """,
                """
                CREATE TABLE IF NOT EXISTS `palavras_bloqueadas` (
                    `Id` BIGINT NOT NULL AUTO_INCREMENT,
                    `Palavra` VARCHAR(120) NOT NULL,
                    `Ativo` TINYINT(1) NOT NULL DEFAULT 1,
                    PRIMARY KEY (`Id`),
                    UNIQUE KEY `IX_palavras_bloqueadas_Palavra` (`Palavra`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """,
                """
                CREATE TABLE IF NOT EXISTS `ocupacoes` (
                    `Id` BIGINT NOT NULL AUTO_INCREMENT,
                    `Nome` VARCHAR(120) NOT NULL,
                    PRIMARY KEY (`Id`),
                    UNIQUE KEY `IX_ocupacoes_Nome` (`Nome`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """,
                """
                CREATE TABLE IF NOT EXISTS `instituicoes` (
                    `Id` BIGINT NOT NULL AUTO_INCREMENT,
                    `UsuarioId` BIGINT NOT NULL,
                    `Nome` VARCHAR(180) NOT NULL,
                    `Cnpj` VARCHAR(30) NULL,
                    `Responsavel` VARCHAR(150) NULL,
                    `Descricao` LONGTEXT NULL,
                    `Status` VARCHAR(32) NOT NULL,
                    `CriadoEm` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                    PRIMARY KEY (`Id`),
                    INDEX `IX_instituicoes_UsuarioId` (`UsuarioId`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """,
                """
                CREATE TABLE IF NOT EXISTS `voluntarios` (
                    `Id` BIGINT NOT NULL AUTO_INCREMENT,
                    `UsuarioId` BIGINT NOT NULL,
                    `DataNascimento` DATETIME(6) NULL,
                    `Genero` VARCHAR(30) NULL,
                    `Disponibilidade` VARCHAR(255) NULL,
                    `Habilidades` LONGTEXT NULL,
                    `Bio` LONGTEXT NULL,
                    `Experiencia` LONGTEXT NULL,
                    `Interesses` LONGTEXT NULL,
                    `PreferenciasAcessibilidade` LONGTEXT NULL,
                    `NecessitaAcessibilidade` TINYINT(1) NOT NULL DEFAULT 0,
                    `AceitaContatoWhatsapp` TINYINT(1) NOT NULL DEFAULT 1,
                    `CriadoEm` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                    `AtualizadoEm` DATETIME(6) NULL,
                    PRIMARY KEY (`Id`),
                    INDEX `IX_voluntarios_UsuarioId` (`UsuarioId`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """,
                """
                CREATE TABLE IF NOT EXISTS `oportunidades` (
                    `Id` BIGINT NOT NULL AUTO_INCREMENT,
                    `InstituicaoId` BIGINT NOT NULL,
                    `CategoriaId` BIGINT NULL,
                    `Titulo` VARCHAR(180) NOT NULL,
                    `Tipo` VARCHAR(32) NOT NULL,
                    `Descricao` LONGTEXT NULL,
                    `ImagemUrl` LONGTEXT NULL,
                    `Objetivo` LONGTEXT NULL,
                    `Cidade` VARCHAR(100) NULL,
                    `Estado` VARCHAR(2) NULL,
                    `DataInicio` DATETIME(6) NOT NULL,
                    `DataFim` DATETIME(6) NULL,
                    `Vagas` INT NOT NULL DEFAULT 1,
                    `Status` VARCHAR(32) NOT NULL,
                    `Requisitos` LONGTEXT NULL,
                    `Turno` VARCHAR(60) NULL,
                    `LocalDetalhado` VARCHAR(180) NULL,
                    `AceitaSemFormacao` TINYINT(1) NOT NULL DEFAULT 1,
                    `PrecisaApoioCriancas` TINYINT(1) NOT NULL DEFAULT 0,
                    `CriadoEm` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                    PRIMARY KEY (`Id`),
                    INDEX `IX_oportunidades_InstituicaoId` (`InstituicaoId`),
                    INDEX `IX_oportunidades_CategoriaId` (`CategoriaId`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """,
                """
                CREATE TABLE IF NOT EXISTS `inscricoes` (
                    `Id` BIGINT NOT NULL AUTO_INCREMENT,
                    `OportunidadeId` BIGINT NOT NULL,
                    `VoluntarioId` BIGINT NOT NULL,
                    `Status` VARCHAR(32) NOT NULL,
                    `MotivoReprovacao` VARCHAR(500) NULL,
                    `CriadoEm` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                    `AtualizadoEm` DATETIME(6) NULL,
                    PRIMARY KEY (`Id`),
                    UNIQUE KEY `IX_inscricoes_OportunidadeId_VoluntarioId` (`OportunidadeId`, `VoluntarioId`),
                    INDEX `IX_inscricoes_VoluntarioId` (`VoluntarioId`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """,
                """
                CREATE TABLE IF NOT EXISTS `feedbacks` (
                    `Id` BIGINT NOT NULL AUTO_INCREMENT,
                    `InscricaoId` BIGINT NOT NULL,
                    `Autor` VARCHAR(32) NOT NULL,
                    `Nota` TINYINT UNSIGNED NOT NULL,
                    `Comentario` VARCHAR(500) NULL,
                    `RespostasJson` VARCHAR(4000) NULL,
                    `CriadoEm` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                    PRIMARY KEY (`Id`),
                    INDEX `IX_feedbacks_InscricaoId` (`InscricaoId`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """,
                """
                CREATE TABLE IF NOT EXISTS `notificacoes` (
                    `Id` BIGINT NOT NULL AUTO_INCREMENT,
                    `UsuarioId` BIGINT NOT NULL,
                    `Titulo` VARCHAR(180) NOT NULL,
                    `Mensagem` VARCHAR(500) NOT NULL,
                    `Lida` TINYINT(1) NOT NULL DEFAULT 0,
                    `CriadoEm` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                    PRIMARY KEY (`Id`),
                    INDEX `IX_notificacoes_UsuarioId` (`UsuarioId`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """
            };

            foreach (var command in commands)
            {
                await db.Database.ExecuteSqlRawAsync(command);
            }

            var columnsByTable = new Dictionary<string, HashSet<string>>(StringComparer.OrdinalIgnoreCase);
            var schema = db.Database.GetDbConnection().Database;
            await using (var connection = db.Database.GetDbConnection())
            {
                if (connection.State != System.Data.ConnectionState.Open)
                {
                    await connection.OpenAsync();
                }

                await using var command = connection.CreateCommand();
                command.CommandText = """
                    SELECT TABLE_NAME, COLUMN_NAME
                    FROM information_schema.COLUMNS
                    WHERE TABLE_SCHEMA = @schema;
                    """;

                var parameter = command.CreateParameter();
                parameter.ParameterName = "@schema";
                parameter.Value = schema;
                command.Parameters.Add(parameter);

                await using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    var table = reader.GetString(0);
                    var column = reader.GetString(1);
                    if (!columnsByTable.TryGetValue(table, out var columns))
                    {
                        columns = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
                        columnsByTable[table] = columns;
                    }

                    columns.Add(column);
                }
            }

            var columnCommands = new (string Table, string Column, string Definition)[]
            {
                ("usuarios", "Nome", "`Nome` VARCHAR(150) NOT NULL DEFAULT ''"),
                ("usuarios", "Email", "`Email` VARCHAR(150) NOT NULL DEFAULT ''"),
                ("usuarios", "Senha", "`Senha` VARCHAR(255) NOT NULL DEFAULT ''"),
                ("usuarios", "Telefone", "`Telefone` VARCHAR(30) NULL"),
                ("usuarios", "Tipo", "`Tipo` VARCHAR(32) NOT NULL DEFAULT 'Voluntario'"),
                ("usuarios", "Cidade", "`Cidade` VARCHAR(100) NULL"),
                ("usuarios", "Estado", "`Estado` VARCHAR(2) NULL"),
                ("usuarios", "Ativo", "`Ativo` TINYINT(1) NOT NULL DEFAULT 1"),
                ("usuarios", "CriadoEm", "`CriadoEm` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)"),
                ("instituicoes", "UsuarioId", "`UsuarioId` BIGINT NOT NULL DEFAULT 0"),
                ("instituicoes", "Nome", "`Nome` VARCHAR(180) NOT NULL DEFAULT ''"),
                ("instituicoes", "Cnpj", "`Cnpj` VARCHAR(30) NULL"),
                ("instituicoes", "Responsavel", "`Responsavel` VARCHAR(150) NULL"),
                ("instituicoes", "Descricao", "`Descricao` LONGTEXT NULL"),
                ("instituicoes", "Status", "`Status` VARCHAR(32) NOT NULL DEFAULT 'Pendente'"),
                ("instituicoes", "CriadoEm", "`CriadoEm` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)"),
                ("voluntarios", "UsuarioId", "`UsuarioId` BIGINT NOT NULL DEFAULT 0"),
                ("voluntarios", "DataNascimento", "`DataNascimento` DATETIME(6) NULL"),
                ("voluntarios", "Genero", "`Genero` VARCHAR(30) NULL"),
                ("voluntarios", "Disponibilidade", "`Disponibilidade` VARCHAR(255) NULL"),
                ("voluntarios", "Habilidades", "`Habilidades` LONGTEXT NULL"),
                ("voluntarios", "Bio", "`Bio` LONGTEXT NULL"),
                ("voluntarios", "Experiencia", "`Experiencia` LONGTEXT NULL"),
                ("voluntarios", "Interesses", "`Interesses` LONGTEXT NULL"),
                ("voluntarios", "PreferenciasAcessibilidade", "`PreferenciasAcessibilidade` LONGTEXT NULL"),
                ("voluntarios", "NecessitaAcessibilidade", "`NecessitaAcessibilidade` TINYINT(1) NOT NULL DEFAULT 0"),
                ("voluntarios", "AceitaContatoWhatsapp", "`AceitaContatoWhatsapp` TINYINT(1) NOT NULL DEFAULT 1"),
                ("voluntarios", "CriadoEm", "`CriadoEm` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)"),
                ("voluntarios", "AtualizadoEm", "`AtualizadoEm` DATETIME(6) NULL"),
                ("oportunidades", "ImagemUrl", "`ImagemUrl` LONGTEXT NULL"),
                ("oportunidades", "Requisitos", "`Requisitos` LONGTEXT NULL"),
                ("oportunidades", "Turno", "`Turno` VARCHAR(60) NULL"),
                ("oportunidades", "LocalDetalhado", "`LocalDetalhado` VARCHAR(180) NULL"),
                ("oportunidades", "AceitaSemFormacao", "`AceitaSemFormacao` TINYINT(1) NOT NULL DEFAULT 1"),
                ("oportunidades", "PrecisaApoioCriancas", "`PrecisaApoioCriancas` TINYINT(1) NOT NULL DEFAULT 0"),
                ("inscricoes", "MotivoReprovacao", "`MotivoReprovacao` VARCHAR(500) NULL"),
                ("inscricoes", "AtualizadoEm", "`AtualizadoEm` DATETIME(6) NULL"),
                ("feedbacks", "RespostasJson", "`RespostasJson` VARCHAR(4000) NULL"),
                ("notificacoes", "Lida", "`Lida` TINYINT(1) NOT NULL DEFAULT 0")
            };

            foreach (var (table, column, definition) in columnCommands)
            {
                if (!columnsByTable.TryGetValue(table, out var columns) || !columns.Contains(column))
                {
                    var sql = $"ALTER TABLE `{table}` ADD COLUMN {definition};";
                    await db.Database.ExecuteSqlRawAsync(sql);
                }
            }
        }
    }
}
