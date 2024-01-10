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
    public class StepController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> UserManager;
        private readonly ApplicationDbContext Context;
        private readonly ICullingService CullingService;

        public StepController(UserManager<ApplicationUser> userManager, ApplicationDbContext context, ICullingService cullingService)
        {
            UserManager = userManager;
            Context = context;
            CullingService = cullingService;
        }

        [HttpPost("new")]
        public async Task<IActionResult> New([FromBody] CreateStepDescriptor model)
        {
            if (ModelState.IsValid)
            {
                var task = Context.Tasks.Include(c => c.Steps).FirstOrDefault(c => c.TaskItemId == model.TaskItemId);

                var step = new Step()
                {
                    Content = model.Content
                };

                task.Steps.Add(step);

                await Context.SaveChangesAsync();

                return Ok(step);
            }

            return BadRequest(ModelState);
        }

        [HttpPost("list")]
        public async Task<IActionResult> List([FromBody] int taskId)
        {
            if (ModelState.IsValid)
            {
                var steps = Context.Steps.Where(i => i.TaskId == taskId);

                return Ok(steps);
            }

            return BadRequest(ModelState);
        }

        [HttpPost("edit")]
        public async Task<IActionResult> Edit([FromBody] EditStepDescriptor model)
        {
            if (ModelState.IsValid)
            {
                var step = Context.Steps.Find(model.StepId);

                if (step != null)
                {
                    step.Status = model.Status;

                    await Context.SaveChangesAsync();

                    return Ok(step);
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
        public async Task<IActionResult> Delete([FromBody] int stepId)
        {
            if (ModelState.IsValid)
            {
                var result = await CullingService.DeleteStep(stepId);

                if (result > 0) { return Ok(result); }

                return NotFound();
            }

            return BadRequest(ModelState);
        }
    }
}
