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
    public class CollaboratorController : ControllerBase
    {
        private readonly ApplicationDbContext Context;

        public CollaboratorController(UserManager<ApplicationUser> userManager, ApplicationDbContext context, ICullingService cullingService)
        {
            Context = context;
        }

        [HttpPost("add")]
        public async Task<IActionResult> New([FromBody] CreateCollaboratorDescriptor model)
        {
            if (ModelState.IsValid)
            {
                var company = Context.Companies.Include(c => c.Collaborators).FirstOrDefault(c => c.CompanyId == model.CompanyId);

                var user = Context.Users.FirstOrDefault(u => u.Email == model.Email);

                if (company != null && user != null)
                {
                    // Check if the collaborator is already in the context, and if so, update it.
                    var existingCollaborator = Context.Users.Local.FirstOrDefault(u => u.Id == user.Id);

                    if (existingCollaborator != null)
                    {
                        Context.Entry(existingCollaborator).CurrentValues.SetValues(user);
                    }
                    else
                    {
                        // If not, attach the collaborator to the context.
                        Context.Users.Attach(user);
                    }

                    company.Collaborators.Add(user);

                    try
                    {
                        await Context.SaveChangesAsync();
                        return Ok(new ApplicationUser()
                        {
                            Id = user.Id,
                            FirstName = user.FirstName,
                            LastName = user.LastName,
                            UserName = user.UserName,
                            Email = user.Email
                        });
                    }
                    catch (Exception ex)
                    {
                        // Handle the exception appropriately, log it, and return a BadRequest response.
                        ModelState.AddModelError(string.Empty, $"Failed to create the Collaborator. {ex.Message}");
                        return BadRequest(ModelState);
                    }
                }

                ModelState.AddModelError(string.Empty, "Company or user not found.");
                return BadRequest(ModelState);
            }

            return BadRequest(ModelState);
        }

        [HttpPost("read")]
        public async Task<IActionResult> Read([FromBody] QueryCollaboratorDescriptor model)
        {
            if (ModelState.IsValid)
            {
                var company = Context.Companies.Include(c => c.Collaborators).FirstOrDefault(c => c.CompanyId == model.CompanyId);

                var collaborator = company.Collaborators.FirstOrDefault(c => c.Id == model.CollaboratorId);

                if (collaborator != null)
                {
                    // Load additional data related to the user, e.g., UserCompanies
                    await Context.Entry(company)
                        .Collection(u => u.Collaborators)
                        .LoadAsync();

                    company.Collaborators.Remove(collaborator);

                    return Ok();
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
        public async Task<IActionResult> Delete([FromBody] QueryCollaboratorDescriptor model)
        {
            if (ModelState.IsValid)
            {
                var company = Context.Companies.Include(c => c.Collaborators).FirstOrDefault(c => c.CompanyId == model.CompanyId);

                var collaborator = company.Collaborators.FirstOrDefault(c => c.Id == model.CollaboratorId);

                if (collaborator != null)
                {
                    // Load additional data related to the user, e.g., UserCompanies
                    await Context.Entry(company)
                        .Collection(u => u.Collaborators)
                        .LoadAsync();

                    company.Collaborators.Remove(collaborator);

                    return Ok();
                }
                else
                {
                    // User not found
                    return NotFound();
                }
            }

            return BadRequest(ModelState);
        }
    }
}
