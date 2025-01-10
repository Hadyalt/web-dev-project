using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace webdevproject.Migrations
{
    /// <inheritdoc />
    public partial class addedofficeattendance6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsOccupied",
                table: "Office");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Office");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsOccupied",
                table: "Office",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Office",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Office",
                keyColumn: "OfficeId",
                keyValue: 1,
                columns: new[] { "IsOccupied", "UserId" },
                values: new object[] { false, 0 });
        }
    }
}
