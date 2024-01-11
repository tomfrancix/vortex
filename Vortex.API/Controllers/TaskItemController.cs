using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vortex.API.Data;
using Vortex.API.Enum;
using Vortex.API.Models;
using Vortex.API.Interfaces;
using System.Security.Claims;

namespace Vortex.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskItemController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> UserManager;
        private readonly ApplicationDbContext Context;
        private readonly ICullingService CullingService;

        public TaskItemController(UserManager<ApplicationUser> userManager, ApplicationDbContext context, ICullingService cullingService)
        {
            UserManager = userManager;
            Context = context;
            CullingService = cullingService;
        }

        [HttpPost("new")]
        public async Task<IActionResult> New([FromBody] CreateTaskItemDescriptor model)
        {
            if (ModelState.IsValid)
            {
                var project = Context.Projects.Include(c => c.Tasks).ThenInclude(c => c.Steps).FirstOrDefault(c => c.ProjectId == model.ProjectId);

                var user = await UserManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

                var taskItem = new TaskItem
                {
                    Summary = model.Name,
                    Description = "",
                    Creator = user.UserName,
                    Owner = "",
                    Status = TaskItemStatus.Requested,
                    ProjectId = project.ProjectId,
                    Project = project

                };

                project.Tasks.Add(taskItem);
                await Context.SaveChangesAsync();

                return Ok(taskItem);
            }

            return BadRequest(ModelState);
        }

        [HttpPost("list")]
        public async Task<IActionResult> List([FromBody] int projectId)
        {
            if (ModelState.IsValid)
            {
                var tasks = Context.Tasks
                    .Include(task => task.Steps)
                    .Where(i => i.ProjectId == projectId);

                if (tasks != null)
                {
                    return Ok(tasks);
                }
                else
                {
                    // User not found
                    return NotFound();
                }
            }

            return BadRequest(ModelState);
        }

        [HttpPost("read")]
        public async Task<IActionResult> Read([FromBody] int taskItemId)
        {
            if (ModelState.IsValid)
            {
                var taskItem = Context.Tasks.Find(taskItemId);

                if (taskItem != null)
                {
                    return Ok(taskItem);
                }
                else
                {
                    // User not found
                    return NotFound();
                }
            }

            return BadRequest(ModelState);
        }

        [HttpPost("edit")]
        public async Task<IActionResult> Edit([FromBody] EditTaskDescriptor model)
        {
            if (ModelState.IsValid)
            {
                var taskItem = Context.Tasks.Find(model.TaskItemId);

                if (taskItem != null)
                {
                    switch (model.Field)
                    {
                        case "summary": 
                            taskItem.Summary = model.Value;
                            break;
                        case "description": 
                            taskItem.Description = model.Value;
                            break;
                        case "status":
                            taskItem.Status = (TaskItemStatus)Convert.ToInt16(model.Value);
                            break;
                    }

                    await Context.SaveChangesAsync();

                    return Ok(taskItem);
                }
                else
                {
                    // Not found
                    return NotFound();
                }
            }

            return BadRequest(ModelState);
        }

        [HttpPost("delete")]
        public async Task<IActionResult> Delete([FromBody] int taskItemId)
        {
            if (ModelState.IsValid)
            {
                var result = await CullingService.DeleteTask(taskItemId);

                if (result > 0) { return Ok(result); }

                return NotFound();
            }

            return BadRequest(ModelState);
        }
    }
}
