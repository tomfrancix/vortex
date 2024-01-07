using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vortex.API.Data;
using Vortex.API.Models;
using Vortex.API.Interfaces;

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
                var project = Context.Projects.Include(c => c.Tasks).FirstOrDefault(c => c.ProjectId == model.ProjectId);

                var taskItem = new TaskItem()
                {
                    Summary = model.Name
                };

                project.Tasks.Add(taskItem);

                var result = await Context.SaveChangesAsync();

                if (result > 0)
                {
                    return Ok(taskItem);
                }

                ModelState.AddModelError(string.Empty, "Failed to create the TaskItem.");
                return BadRequest(ModelState);;
            }

            return BadRequest(ModelState);
        }

        [HttpPost("list")]
        public async Task<IActionResult> List([FromBody] int projectId)
        {
            if (ModelState.IsValid)
            {
                var tasks = Context.Tasks.Where(i => i.ProjectId == projectId);

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
