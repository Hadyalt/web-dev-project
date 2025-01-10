using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace webdevproject.Migrations
{
    /// <inheritdoc />
    public partial class addedofficeattendance7 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AttendanceDate",
                table: "Office_Attendance");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "AttendanceDate",
                table: "Office_Attendance",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));
        }
    }
}
