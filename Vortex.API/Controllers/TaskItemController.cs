using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vortex.API.Data;
using Vortex.API.Enum;
using Vortex.API.Models;
using Vortex.API.Interfaces;
using System.Security.Claims;
using Vortex.API.Mappers;
using Vortex.API.ViewModels;
using System.Threading.Tasks;

namespace Vortex.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskItemController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> UserManager;
        private readonly ApplicationDbContext Context;
        private readonly ICullingService CullingService;
        private readonly TaskMapper TaskMapper;

        public TaskItemController(UserManager<ApplicationUser> userManager, ApplicationDbContext context, ICullingService cullingService, TaskMapper taskMapper)
        {
            UserManager = userManager;
            Context = context;
            CullingService = cullingService;
            TaskMapper = taskMapper;
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

                return Ok(TaskMapper.Map(taskItem));
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

                var viewModel = new List<TaskItemViewModel>();

                foreach (var task in tasks) {
                    viewModel.Add(TaskMapper.Map(task));
                }  
                
                return Ok(viewModel);
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
                    return Ok(TaskMapper.Map(taskItem));
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

                            switch (taskItem.Status)
                            {
                                case TaskItemStatus.Requested:
                                    taskItem.Owner = string.Empty;
                                    break;
                                case TaskItemStatus.InProgress:
                                    var user = await UserManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
                                    taskItem.Owner = user.UserName;
                                    break;
                            }

                            break;
                    }

                    await Context.SaveChangesAsync();

                    return Ok(TaskMapper.Map(taskItem));
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
