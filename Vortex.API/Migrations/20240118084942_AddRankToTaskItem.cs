using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vortex.API.Migrations
{
    public partial class AddRankToTaskItem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Rank",
                table: "Tasks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.Sql(@"
                WITH RankedTasks AS (
                    SELECT
                        TaskItemId,
                        ProjectId,
                        ROW_NUMBER() OVER (PARTITION BY ProjectId ORDER BY TaskItemId) AS TaskRank
                    FROM
                        Tasks
                )
                UPDATE Tasks
                SET Rank = RankedTasks.TaskRank
                FROM RankedTasks
                WHERE Tasks.TaskItemId = RankedTasks.TaskItemId;
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rank",
                table: "Tasks");
        }
    }
}
