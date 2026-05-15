using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace VoluntaMais.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddOcupacaoTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Ocupacoes",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", maxLength: 120, nullable: false),
                    DataInsercao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DataAtualizacao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DataDelecao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Excluido = table.Column<bool>(type: "INTEGER", nullable: false),
                    VersaoRegistro = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ocupacoes", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Ocupacoes",
                columns: new[] { "Id", "DataAtualizacao", "DataDelecao", "DataInsercao", "Excluido", "Nome", "VersaoRegistro" },
                values: new object[,]
                {
                    { 1L, null, null, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Estudante", new Guid("10000001-0000-0000-0000-000000000001") },
                    { 2L, null, null, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Empregado(a)", new Guid("10000001-0000-0000-0000-000000000002") },
                    { 3L, null, null, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Autônomo(a)", new Guid("10000001-0000-0000-0000-000000000003") },
                    { 4L, null, null, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Empresário(a)", new Guid("10000001-0000-0000-0000-000000000004") },
                    { 5L, null, null, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Aposentado(a)", new Guid("10000001-0000-0000-0000-000000000005") },
                    { 6L, null, null, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Desempregado(a)", new Guid("10000001-0000-0000-0000-000000000006") },
                    { 7L, null, null, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Outro", new Guid("10000001-0000-0000-0000-000000000007") }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Ocupacoes_Nome",
                table: "Ocupacoes",
                column: "Nome",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Ocupacoes");
        }
    }
}
