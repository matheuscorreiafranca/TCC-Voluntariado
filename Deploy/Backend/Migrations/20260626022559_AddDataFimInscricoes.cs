using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VoluntaMais.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddDataFimInscricoes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DataFimInscricoes",
                table: "oportunidades",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Mensagem",
                table: "notificacoes",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(500)",
                oldMaxLength: 500)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataFimInscricoes",
                table: "oportunidades");

            migrationBuilder.AlterColumn<string>(
                name: "Mensagem",
                table: "notificacoes",
                type: "varchar(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }
    }
}
