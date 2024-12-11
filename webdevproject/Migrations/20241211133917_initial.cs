using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace webdevproject.Migrations
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Admin",
                columns: table => new
                {
                    AdminId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserName = table.Column<string>(type: "TEXT", nullable: false),
                    Password = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    UserRole = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admin", x => x.AdminId);
                });

            migrationBuilder.CreateTable(
                name: "Event",
                columns: table => new
                {
                    EventId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    EventDate = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    StartTime = table.Column<TimeSpan>(type: "TEXT", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "TEXT", nullable: false),
                    Location = table.Column<string>(type: "TEXT", nullable: false),
                    AdminApproval = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Event", x => x.EventId);
                });

            migrationBuilder.CreateTable(
                name: "Office",
                columns: table => new
                {
                    OfficeId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Date = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    StartTime = table.Column<TimeSpan>(type: "TEXT", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "TEXT", nullable: false),
                    IsOccupied = table.Column<bool>(type: "INTEGER", nullable: false),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Office", x => x.OfficeId);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserName = table.Column<string>(type: "TEXT", nullable: false),
                    UserRole = table.Column<string>(type: "TEXT", nullable: false),
                    FirstName = table.Column<string>(type: "TEXT", nullable: false),
                    LastName = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    Password = table.Column<string>(type: "TEXT", nullable: false),
                    RecuringDays = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "Vote",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    VotingOptionId = table.Column<int>(type: "INTEGER", nullable: false),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vote", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VotingOption",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    EventDetails = table.Column<string>(type: "TEXT", nullable: false),
                    StartTime = table.Column<DateTime>(type: "TEXT", nullable: false),
                    EndTime = table.Column<DateTime>(type: "TEXT", nullable: false),
                    VoteCount = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VotingOption", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Attendance",
                columns: table => new
                {
                    AttendanceId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AttendanceDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attendance", x => x.AttendanceId);
                    table.ForeignKey(
                        name: "FK_Attendance_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Event_Attendance",
                columns: table => new
                {
                    Event_AttendanceId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Rating = table.Column<int>(type: "INTEGER", nullable: false),
                    Feedback = table.Column<string>(type: "TEXT", nullable: false),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    EventId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Event_Attendance", x => x.Event_AttendanceId);
                    table.ForeignKey(
                        name: "FK_Event_Attendance_Event_EventId",
                        column: x => x.EventId,
                        principalTable: "Event",
                        principalColumn: "EventId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Event_Attendance_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Admin",
                columns: new[] { "AdminId", "Email", "Password", "UserName", "UserRole" },
                values: new object[,]
                {
                    { 1, "admin1@example.com", "^�H��(qQ��o��)'s`=\rj���*�rB�", "admin1", "admin" },
                    { 2, "admin2@example.com", "\\N@6��G��Ae=j_��a%0�QU��\\", "admin2", "admin" },
                    { 3, "admin3@example.com", "�j\\��f������x�s+2��D�o���", "admin3", "admin" },
                    { 4, "admin4@example.com", "�].��g��Պ��t��?��^�T��`aǳ", "admin4", "admin" },
                    { 5, "admin5@example.com", "E�=���:�-����gd����bF��80]�", "admin5", "admin" }
                });

            migrationBuilder.InsertData(
                table: "Event",
                columns: new[] { "EventId", "AdminApproval", "Description", "EndTime", "EventDate", "Location", "StartTime", "Title" },
                values: new object[,]
                {
                    { 1, true, "Description of event 1", new TimeSpan(0, 12, 0, 0, 0), new DateOnly(2022, 1, 1), "Location 1", new TimeSpan(0, 10, 0, 0, 0), "Event 1" },
                    { 2, true, "Description of event 2", new TimeSpan(0, 13, 0, 0, 0), new DateOnly(2023, 1, 1), "Location 2", new TimeSpan(0, 11, 0, 0, 0), "Event 2" }
                });

            migrationBuilder.InsertData(
                table: "Office",
                columns: new[] { "OfficeId", "Date", "EndTime", "IsOccupied", "StartTime", "UserId" },
                values: new object[] { 1, new DateOnly(2022, 1, 1), new TimeSpan(0, 11, 0, 0, 0), false, new TimeSpan(0, 10, 0, 0, 0), 0 });

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "UserId", "Email", "FirstName", "LastName", "Password", "RecuringDays", "UserName", "UserRole" },
                values: new object[] { 1, "10@gmail.com", "User 1", "User 1", "^�H��(qQ��o��)'s`=\rj���*�rB�", "mo,tu,we,th,fr", "hady", "user" });

            migrationBuilder.InsertData(
                table: "Vote",
                columns: new[] { "Id", "UserId", "VotingOptionId" },
                values: new object[] { 1, 1, 1 });

            migrationBuilder.InsertData(
                table: "VotingOption",
                columns: new[] { "Id", "EndTime", "EventDetails", "StartTime", "VoteCount" },
                values: new object[] { 1, new DateTime(2022, 1, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), "Event 1", new DateTime(2022, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0 });

            migrationBuilder.InsertData(
                table: "Attendance",
                columns: new[] { "AttendanceId", "AttendanceDate", "UserId" },
                values: new object[] { 1, new DateTime(2022, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1 });

            migrationBuilder.InsertData(
                table: "Event_Attendance",
                columns: new[] { "Event_AttendanceId", "EventId", "Feedback", "Rating", "UserId" },
                values: new object[] { 1, 1, "Feedback 1", 5, 1 });

            migrationBuilder.CreateIndex(
                name: "IX_Admin_UserName",
                table: "Admin",
                column: "UserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Attendance_AttendanceId",
                table: "Attendance",
                column: "AttendanceId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Attendance_UserId",
                table: "Attendance",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Event_EventId",
                table: "Event",
                column: "EventId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Event_Attendance_Event_AttendanceId",
                table: "Event_Attendance",
                column: "Event_AttendanceId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Event_Attendance_EventId",
                table: "Event_Attendance",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_Event_Attendance_UserId",
                table: "Event_Attendance",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Office_OfficeId",
                table: "Office",
                column: "OfficeId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_User_UserId",
                table: "User",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Vote_Id",
                table: "Vote",
                column: "Id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VotingOption_Id",
                table: "VotingOption",
                column: "Id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Admin");

            migrationBuilder.DropTable(
                name: "Attendance");

            migrationBuilder.DropTable(
                name: "Event_Attendance");

            migrationBuilder.DropTable(
                name: "Office");

            migrationBuilder.DropTable(
                name: "Vote");

            migrationBuilder.DropTable(
                name: "VotingOption");

            migrationBuilder.DropTable(
                name: "Event");

            migrationBuilder.DropTable(
                name: "User");
        }
    }
}
