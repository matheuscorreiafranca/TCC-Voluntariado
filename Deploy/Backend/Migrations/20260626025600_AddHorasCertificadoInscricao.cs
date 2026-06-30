using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VoluntaMais.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddHorasCertificadoInscricao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "CertificadoGerado",
                table: "inscricoes",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "HorasComprovadas",
                table: "inscricoes",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CertificadoGerado",
                table: "inscricoes");

            migrationBuilder.DropColumn(
                name: "HorasComprovadas",
                table: "inscricoes");
        }
    }
}
