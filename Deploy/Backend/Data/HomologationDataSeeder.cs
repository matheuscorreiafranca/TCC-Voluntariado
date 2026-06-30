using System.Data;
using Microsoft.EntityFrameworkCore;

namespace VoluntaMais.Api.Data
{
    public static class HomologationDataSeeder
    {
        private const string SeedName = "homologacao-voluntariado-tccem-2026-06-08";
        private const string ExpectedOpportunityTitle = "Programa de Protagonismo da Pessoa com Deficiência";

        public static async Task<object> SeedAsync(AppDbContext db, IWebHostEnvironment env)
        {
            var path = Path.Combine(env.ContentRootPath, "Data", "SeedData", "homologacao.sql");
            if (!File.Exists(path))
            {
                Console.WriteLine($"[HomologationDataSeeder] Seed file not found at {path}.");
                return new { status = "seed-file-not-found", path };
            }

            var script = await File.ReadAllTextAsync(path);
            var statements = script
                .Split("-- statement-break", StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Select(TrimStatement)
                .Where(statement => !string.IsNullOrWhiteSpace(statement));

            var connection = db.Database.GetDbConnection();
            if (connection.State != ConnectionState.Open)
            {
                await connection.OpenAsync();
            }

            await EnsureSeedHistoryTableAsync(connection);
            if (!await RequiredTablesExistAsync(connection))
            {
                Console.WriteLine("[HomologationDataSeeder] Required tables are not ready yet. Skipping homologation seed.");
                return new { status = "required-tables-not-ready" };
            }

            if (await HomologationDataIsAppliedAsync(connection))
            {
                await MarkSeedRunAsync(connection);
                Console.WriteLine("[HomologationDataSeeder] Homologation data already applied.");
                return new { status = "already-applied" };
            }

            var executed = 0;

            foreach (var statement in statements)
            {
                await using var command = connection.CreateCommand();
                command.CommandText = statement;
                await command.ExecuteNonQueryAsync();
                executed++;
            }

            await MarkSeedRunAsync(connection);
            Console.WriteLine("[HomologationDataSeeder] Homologation data imported successfully.");
            return new { status = "imported", statements = executed };
        }

        private static string TrimStatement(string statement)
        {
            var trimmed = statement.Trim();
            return trimmed.EndsWith(';') ? trimmed[..^1].TrimEnd() : trimmed;
        }

        private static async Task<bool> RequiredTablesExistAsync(IDbConnection connection)
        {
            await using var command = (System.Data.Common.DbCommand)connection.CreateCommand();
            command.CommandText = """
                SELECT COUNT(*)
                FROM information_schema.TABLES
                WHERE TABLE_SCHEMA = DATABASE()
                  AND TABLE_NAME IN ('usuarios', 'instituicoes', 'categorias', 'oportunidades');
                """;

            var result = await command.ExecuteScalarAsync();
            return Convert.ToInt32(result) == 4;
        }

        private static async Task<bool> HomologationDataIsAppliedAsync(IDbConnection connection)
        {
            await using var command = (System.Data.Common.DbCommand)connection.CreateCommand();
            command.CommandText = """
                SELECT COUNT(*)
                FROM `oportunidades`
                WHERE `Id` = 1
                  AND `InstituicaoId` = 6
                  AND `CategoriaId` = 1
                  AND `Titulo` = @title;
                """;

            var parameter = command.CreateParameter();
            parameter.ParameterName = "@title";
            parameter.Value = ExpectedOpportunityTitle;
            command.Parameters.Add(parameter);

            var result = await command.ExecuteScalarAsync();
            return Convert.ToInt32(result) > 0;
        }

        private static async Task EnsureSeedHistoryTableAsync(IDbConnection connection)
        {
            await using var command = (System.Data.Common.DbCommand)connection.CreateCommand();
            command.CommandText = """
                CREATE TABLE IF NOT EXISTS `seed_history` (
                    `Id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                    `Nome` VARCHAR(120) NOT NULL,
                    `AplicadoEm` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (`Id`),
                    UNIQUE KEY `IX_seed_history_Nome` (`Nome`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """;
            await command.ExecuteNonQueryAsync();
        }

        private static async Task MarkSeedRunAsync(IDbConnection connection)
        {
            await using var command = (System.Data.Common.DbCommand)connection.CreateCommand();
            command.CommandText = """
                INSERT INTO `seed_history` (`Nome`)
                VALUES (@name)
                ON DUPLICATE KEY UPDATE `AplicadoEm` = `AplicadoEm`;
                """;

            var parameter = command.CreateParameter();
            parameter.ParameterName = "@name";
            parameter.Value = SeedName;
            command.Parameters.Add(parameter);

            await command.ExecuteNonQueryAsync();
        }
    }
}
