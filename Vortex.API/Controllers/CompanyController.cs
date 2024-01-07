using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Vortex.API.Interfaces;
using Vortex.API.Models;
using Vortex.API.ViewModels;

namespace Vortex.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompanyController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> UserManager;
        private readonly ApplicationDbContext Context;
        private readonly ICullingService CullingService;

        public CompanyController(UserManager<ApplicationUser> userManager, ApplicationDbContext context, ICullingService cullingService)
        {
            UserManager = userManager;
            Context = context;
            CullingService = cullingService;
        }

        [HttpPost("new")]
        public async Task<IActionResult> New([FromBody] string name)
        {
            if (ModelState.IsValid)
            {
                var user = await UserManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

                var company = new Company
                {
                    Name = name,
                    User = user,
                    Users = new List<ApplicationUser> { user },
                    UserCompanies = new List<UserCompany>{new UserCompany
                        {
                            User = user
                        }
                    },
                };

                Context.Companies.Add(company);

                var result = await Context.SaveChangesAsync();

                if (result > 0)
                {
                    return Ok(company);
                }

                ModelState.AddModelError(string.Empty, "Failed to create the company.");
                return BadRequest(ModelState);;
            }

            return BadRequest(ModelState);
        }

        [HttpPost("read")]
        public async Task<IActionResult> Read([FromBody] int companyId)
        {
            if (ModelState.IsValid)
            {
                var company = Context.Companies.Find(companyId);

                if (company != null)
                {
                    // Load additional data related to the user, e.g., UserCompanies
                    await Context.Entry(company)
                        .Collection(u => u.UserCompanies)
                        .LoadAsync();

                    await Context.Entry(company)
                        .Collection(u => u.Projects)
                        .LoadAsync();

                    return Ok(company);
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
        public async Task<IActionResult> Delete([FromBody] int companyId)
        {
            if (ModelState.IsValid)
            {
                var result = await CullingService.DeleteCompany(companyId);
                
                if (result > 0) { return Ok(result); }

                return NotFound();
            }

            return BadRequest(ModelState);
        }
    }
}
