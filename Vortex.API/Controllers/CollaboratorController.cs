using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vortex.API.Data;
using Vortex.API.Models;
using Vortex.API.Interfaces;
using Vortex.API.Mappers;

namespace Vortex.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CollaboratorController : ControllerBase
    {
        private readonly ApplicationDbContext Context;
        private readonly UserMapper UserMapper;
        private readonly InvitationMapper InvitationMapper;

        public CollaboratorController(UserManager<ApplicationUser> userManager, ApplicationDbContext context, ICullingService cullingService, UserMapper userMapper, InvitationMapper invitationMapper)
        {
            Context = context;
            UserMapper = userMapper;
            InvitationMapper = invitationMapper;
        }

        [HttpPost("add")]
        public async Task<IActionResult> New([FromBody] CreateCollaboratorDescriptor model)
        {
            if (ModelState.IsValid)
            {
                var existingInvitation = Context.Invitations.FirstOrDefault(c => c.CompanyId == model.CompanyId && c.Email == model.Email);

                if (existingInvitation is null)
                {
                    var invitation = new Invitation
                    {
                        Email = model.Email,
                        CompanyId = model.CompanyId,
                        AcceptedInvitation = false
                    };

                    Context.Invitations.Add(invitation);

                    var result = await Context.SaveChangesAsync();

                    if (result > 0)
                    {
                        return Ok(InvitationMapper.Map(invitation));
                    }

                    ModelState.AddModelError(string.Empty, "Failed to create the invitation.");
                    return BadRequest(ModelState);
                }
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
                    return Ok(UserMapper.Map(collaborator));
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
