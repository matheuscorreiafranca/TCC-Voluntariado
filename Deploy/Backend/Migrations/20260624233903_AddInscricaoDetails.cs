using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VoluntaMais.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddInscricaoDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Disponibilidade",
                table: "inscricoes",
                type: "varchar(255)",
                maxLength: 255,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Experiencia",
                table: "inscricoes",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Motivacao",
                table: "inscricoes",
                type: "varchar(1000)",
                maxLength: 1000,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Disponibilidade",
                table: "inscricoes");

            migrationBuilder.DropColumn(
                name: "Experiencia",
                table: "inscricoes");

            migrationBuilder.DropColumn(
                name: "Motivacao",
                table: "inscricoes");
        }
    }
}
