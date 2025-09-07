using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class InitFixPhieuTiem1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "maDiaDiem",
                table: "PhieuDangKyLichTiem",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PhieuDangKyLichTiem_maDiaDiem",
                table: "PhieuDangKyLichTiem",
                column: "maDiaDiem");

            migrationBuilder.AddForeignKey(
                name: "FK__PhieuDan__maDiaDiem__NewConstraint3",
                table: "PhieuDangKyLichTiem",
                column: "maDiaDiem",
                principalTable: "DiaDiem",
                principalColumn: "maDiaDiem",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__PhieuDan__maDiaDiem__NewConstraint3",
                table: "PhieuDangKyLichTiem");

            migrationBuilder.DropIndex(
                name: "IX_PhieuDangKyLichTiem_maDiaDiem",
                table: "PhieuDangKyLichTiem");

            migrationBuilder.DropColumn(
                name: "maDiaDiem",
                table: "PhieuDangKyLichTiem");
        }
    }
}
