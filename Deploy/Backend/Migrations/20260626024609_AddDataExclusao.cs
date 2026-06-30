using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VoluntaMais.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddDataExclusao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DataExclusao",
                table: "usuarios",
                type: "datetime(6)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataExclusao",
                table: "usuarios");
        }
    }
}
