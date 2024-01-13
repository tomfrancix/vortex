using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vortex.API.Migrations
{
    public partial class ConfigureCopanyInvitationRelationship : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Invitations_CompanyId",
                table: "Invitations",
                column: "CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Invitations_Companies_CompanyId",
                table: "Invitations",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "CompanyId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Invitations_Companies_CompanyId",
                table: "Invitations");

            migrationBuilder.DropIndex(
                name: "IX_Invitations_CompanyId",
                table: "Invitations");
        }
    }
}
