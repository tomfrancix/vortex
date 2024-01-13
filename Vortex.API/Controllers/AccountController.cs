using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web.Resource;
using Vortex.API.Data;
using Vortex.API.Mappers;
using Vortex.API.Models;
using Vortex.API.Services;
using Vortex.API.ViewModels;

namespace Vortex.API.Controllers
{
    [EnableCors("AllowSpecificOrigin")]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> UserManager;
        private readonly SignInManager<ApplicationUser> SignInManager;
        private readonly TokenService TokenService;
        private readonly ApplicationDbContext Context;
        private readonly InvitationMapper InvitationMapper;

        public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, TokenService tokenService, ApplicationDbContext context, InvitationMapper invitationMapper)
        {
            UserManager = userManager;
            SignInManager = signInManager;
            TokenService = tokenService;
            Context = context;
            InvitationMapper = invitationMapper;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser
                {
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    UserName = model.Username,
                    Email = model.Email
                };

                var result = await UserManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    await SignInManager.SignInAsync(user, isPersistent: false);

                    return Ok(GetUserDescriptor(user));
                }

                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }

                return BadRequest(ModelState);
            }

            return BadRequest(ModelState);
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await UserManager.FindByEmailAsync(model.Email);

                if (user != null)
                {
                    var result = await SignInManager.PasswordSignInAsync(user.UserName, model.Password, model.RememberMe, lockoutOnFailure: false);

                    if (result.Succeeded)
                    {
                        return Ok(GetUserDescriptor(user));
                    }
                    else
                    {
                        ModelState.AddModelError(string.Empty, "Invalid login attempt");
                        return Unauthorized(ModelState);
                    }
                }
                else
                {
                    ModelState.AddModelError(string.Empty, "Invalid login attempt");
                    return Unauthorized(ModelState);
                }
            }

            return BadRequest(ModelState);
        }

        [Authorize]
        [HttpGet("get-current-user")]
        public async Task<ActionResult<UserDescriptor>> GetCurrentUser()
        {
            var user = await UserManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

            var userModel = Context.Users
                .Include(applicationUser => applicationUser.UserCompanies)
                .ThenInclude(userCompanies => userCompanies.Company)
                .FirstOrDefault(u => u.Id == user.Id);

            user.UserCompanies = userModel.UserCompanies;
            
            return GetUserDescriptor(user);
        }

        private UserDescriptor GetUserDescriptor(ApplicationUser user)
        {
            var model = new UserDescriptor
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName,
                Token = TokenService.CreateToken(user),
                UserCompanies = new List<CompanyDescriptor>(),
                Invitations = new List<InvitationViewModel>()
            };

            var userModel = Context.Users
                .Include(applicationUser => applicationUser.UserCompanies)
                .ThenInclude(userCompanies => userCompanies.Company)
                .FirstOrDefault(u => u.Id == user.Id);

            foreach (var company in userModel.UserCompanies)
            {
                model.UserCompanies.Add(new CompanyDescriptor
                {
                    CompanyId = company.CompanyId,
                    Name = company.Company.Name,
                    UserId = company.UserId
                });
            }

            var invitations = Context.Invitations.Where(i => i.Email == user.Email);

            if (invitations.Any())
            {
                foreach (var invitation in invitations.Include(invitation => invitation.Company))
                {
                    var invite = InvitationMapper.Map(invitation);

                    invite.CompanyName = invitation.Company.Name;
                    model.Invitations.Add(invite);
                }
            }

            return model;
        }
    }
}
