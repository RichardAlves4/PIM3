using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pim3.API.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarCamposEstoque : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DataFabricacao",
                table: "Estoques",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Unidade",
                table: "Estoques",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "Validade",
                table: "Estoques",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataFabricacao",
                table: "Estoques");

            migrationBuilder.DropColumn(
                name: "Unidade",
                table: "Estoques");

            migrationBuilder.DropColumn(
                name: "Validade",
                table: "Estoques");
        }
    }
}
