using MySqlConnector;

namespace VoluntaMais.Api.Data
{
    public static class DatabaseBootstrapper
    {
        public static async Task EnsureDatabaseExistsAsync(string connectionString)
        {
            var builder = new MySqlConnectionStringBuilder(connectionString);
            var databaseName = builder.Database;

            if (string.IsNullOrWhiteSpace(databaseName))
            {
                return;
            }

            builder.Database = string.Empty;
            await using var connection = new MySqlConnection(builder.ConnectionString);
            await connection.OpenAsync();

            await using var command = connection.CreateCommand();
            command.CommandText = $"""
                CREATE DATABASE IF NOT EXISTS `{EscapeIdentifier(databaseName)}`
                CHARACTER SET utf8mb4
                COLLATE utf8mb4_unicode_ci;
                """;
            await command.ExecuteNonQueryAsync();
        }

        private static string EscapeIdentifier(string value)
        {
            return value.Replace("`", "``", StringComparison.Ordinal);
        }
    }
}
