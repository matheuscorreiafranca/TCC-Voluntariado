using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using VoluntaMais.Api.Data;

namespace VoluntaMais.Api.Controllers
{
    [ApiController]
    [Route("internal")]
    public class InternalMaintenanceController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;

        public InternalMaintenanceController(AppDbContext db, IConfiguration configuration, IWebHostEnvironment env)
        {
            _db = db;
            _configuration = configuration;
            _env = env;
        }

        [HttpPost("schema")]
        public async Task<IActionResult> ApplySchema()
        {
            if (!IsAuthorized())
            {
                return Unauthorized(new { message = "Invalid maintenance key." });
            }

            try
            {
                await DatabaseSchemaInitializer.EnsureSchemaAsync(_db);
                return Ok(new { status = "schema-applied" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, BuildError("schema-failed", ex));
            }
        }

        [HttpPost("seed-homologacao")]
        public async Task<IActionResult> SeedHomologacao()
        {
            if (!IsAuthorized())
            {
                return Unauthorized(new { message = "Invalid maintenance key." });
            }

            try
            {
                await DatabaseSchemaInitializer.EnsureSchemaAsync(_db);
                var result = await HomologationDataSeeder.SeedAsync(_db, _env);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, BuildError("seed-failed", ex));
            }
        }

        [HttpGet("db-check")]
        public async Task<IActionResult> DbCheck()
        {
            if (!IsAuthorized())
            {
                return Unauthorized(new { message = "Invalid maintenance key." });
            }

            try
            {
                var connectionString = _configuration.GetConnectionString("DefaultConnection")
                    ?? throw new InvalidOperationException("ConnectionStrings__DefaultConnection is required.");
                var builder = new MySqlConnectionStringBuilder(connectionString);
                var canConnect = await _db.Database.CanConnectAsync();

                var tableCount = canConnect ? await CountTablesAsync() : 0;

                return Ok(new
                {
                    status = canConnect ? "connected" : "not-connected",
                    server = builder.Server,
                    port = builder.Port,
                    database = builder.Database,
                    userId = builder.UserID,
                    sslMode = builder.SslMode.ToString(),
                    tableCount
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, BuildError("db-check-failed", ex));
            }
        }

        private bool IsAuthorized()
        {
            var expected = _configuration["Maintenance:Key"];
            if (string.IsNullOrWhiteSpace(expected))
            {
                return false;
            }

            return Request.Headers.TryGetValue("X-Maintenance-Key", out var provided)
                && string.Equals(provided.ToString(), expected, StringComparison.Ordinal);
        }

        private static object BuildError(string status, Exception ex)
        {
            return new
            {
                status,
                exception = ex.GetType().FullName,
                message = ex.Message,
                innerException = ex.InnerException?.GetType().FullName,
                innerMessage = ex.InnerException?.Message
            };
        }

        private async Task<int> CountTablesAsync()
        {
            var connection = _db.Database.GetDbConnection();
            if (connection.State != System.Data.ConnectionState.Open)
            {
                await connection.OpenAsync();
            }

            await using var command = connection.CreateCommand();
            command.CommandText = "SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()";
            var result = await command.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }
    }
}
