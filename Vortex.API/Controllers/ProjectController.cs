using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vortex.API.Data;
using Vortex.API.Events;
using Vortex.API.Models;
using Vortex.API.Interfaces;
using Vortex.API.Mappers;
using Vortex.API.Services;

namespace Vortex.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> UserManager;
        private readonly ApplicationDbContext Context;
        private readonly ICullingService CullingService;
        private readonly ProjectMapper ProjectMapper;
        private readonly ISyncronisationService SyncronisationService;

        public ProjectController(UserManager<ApplicationUser> userManager, ApplicationDbContext context, ICullingService cullingService, ProjectMapper projectMapper, ISyncronisationService syncronisationService)
        {
            UserManager = userManager;
            Context = context;
            CullingService = cullingService;
            ProjectMapper = projectMapper;
            SyncronisationService = syncronisationService;
        }

        [HttpPost("new")]
        public async Task<IActionResult> New([FromBody] CreateProjectDescriptor model)
        {
            if (ModelState.IsValid)
            {
                var company = Context.Companies.Include(c => c.Projects).FirstOrDefault(c => c.CompanyId == model.CompanyId);

                var project = new Project()
                {
                    Name = model.Name
                };

                company.Projects.Add(project);

                var result = await Context.SaveChangesAsync();

                if (result > 0)
                {
                    return Ok(ProjectMapper.Map(project));
                }

                ModelState.AddModelError(string.Empty, "Failed to create the Project.");
                return BadRequest(ModelState);
            }

            return BadRequest(ModelState);
        }

        [HttpPost("read")]
        public async Task<IActionResult> Read([FromBody] int projectId)
        {
            if (ModelState.IsValid)
            {
                var project = Context.Projects.Find(projectId);

                if (project != null)
                {
                    // Load additional data related to the user, e.g., UserCompanies
                    await Context.Entry(project)
                        .Collection(u => u.Tasks)
                        .LoadAsync();

                    SyncronisationService.RaiseUserJoined(new UserJoinedEvent()
                    {
                        ConnectionId = HttpContext.Connection.Id,
                        ProjectIdentifier = $"{project.Name}-{project.ProjectId}"
                    });

                    return Ok(ProjectMapper.Map(project));
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
        public async Task<IActionResult> Delete([FromBody] int projectId)
        {
            if (ModelState.IsValid)
            {
                var result = await CullingService.DeleteProject(projectId);

                if (result > 0) { return Ok(result); }

                return NotFound();
            }

            return BadRequest(ModelState);
        }
    }
}
