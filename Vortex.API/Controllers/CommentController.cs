using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vortex.API.Data;
using Vortex.API.Models;
using Vortex.API.Interfaces;
using System.Security.Claims;
using Vortex.API.Mappers;
using Vortex.API.ViewModels;

namespace Vortex.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> UserManager;
        private readonly ApplicationDbContext Context;
        private readonly ICullingService CullingService;
        private readonly CommentMapper CommentMapper;

        public CommentController(UserManager<ApplicationUser> userManager, ApplicationDbContext context, ICullingService cullingService, CommentMapper commentMapper)
        {
            UserManager = userManager;
            Context = context;
            CullingService = cullingService;
            CommentMapper = commentMapper;
        }

        [HttpPost("new")]
        public async Task<IActionResult> New([FromBody] CreateCommentDescriptor model)
        {
            if (ModelState.IsValid)
            {
                var user = await UserManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

                if (user != null)
                {
                    var task = Context.Tasks.Include(c => c.Comments)
                        .FirstOrDefault(c => c.TaskItemId == model.TaskItemId);

                    var comment = new Comment()
                    {
                        Content = model.Text,
                        UserId = user.Id
                    };

                    task.Comments.Add(comment);

                    await Context.SaveChangesAsync();

                    return Ok(CommentMapper.Map(comment));
                }
            }

            return BadRequest(ModelState);
        }

        [HttpPost("list")]
        public async Task<IActionResult> List([FromBody] int taskId)
        {
            if (ModelState.IsValid)
            {
                var comments = Context.Comments.Where(i => i.TaskId == taskId);

                var viewModel = new List<CommentViewModel>();

                foreach (var comment in comments)
                {
                    viewModel.Add(CommentMapper.Map(comment));
                }

                return Ok(viewModel);
            }

            return BadRequest(ModelState);
        }

        [HttpPost("edit")]
        public async Task<IActionResult> Edit([FromBody] EditCommentDescriptor model)
        {
            if (ModelState.IsValid)
            {
                var comment = Context.Comments.Find(model.CommentId);

                if (comment != null)
                {
                    comment.Content = model.Text;

                    await Context.SaveChangesAsync();

                    return Ok(CommentMapper.Map(comment));
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
        public async Task<IActionResult> Delete([FromBody] int commentId)
        {
            if (ModelState.IsValid)
            {
                var result = await CullingService.DeleteComment(commentId);

                if (result > 0) { return Ok(result); }

                return NotFound();
            }

            return BadRequest(ModelState);
        }
    }
}
