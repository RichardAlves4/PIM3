using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pim3.API.Migrations
{
    /// <inheritdoc />
    public partial class AdicionaValorPadraoSenha : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Senha",
                table: "Propriedades",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "123mudar",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Senha",
                table: "Propriedades",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldDefaultValue: "123mudar");
        }
    }
}
