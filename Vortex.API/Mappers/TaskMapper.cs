using Microsoft.AspNetCore.Identity;
using Vortex.API.Enum;
using Vortex.API.Models;
using Vortex.API.ViewModels;

namespace Vortex.API.Mappers
{
    /// <summary>
    /// Map model to view model.
    /// </summary>
    public class TaskMapper
    {
        private readonly UserMapper UserMapper;
        private readonly StepMapper StepMapper;
        private readonly CommentMapper CommentMapper;

        public TaskMapper(UserMapper userMapper, StepMapper stepMapper, CommentMapper commentMapper)
        {
            UserMapper = userMapper;
            StepMapper = stepMapper;
            CommentMapper = commentMapper;
        }

        public TaskItemViewModel Map(TaskItem entity)
        {
            var model = new TaskItemViewModel
            {
                TaskItemId = entity.TaskItemId,
                Summary = entity.Summary,
                Description = entity.Description,
                Creator = entity.Creator,
                Owner = entity.Owner,
                Status = entity.Status
            };

            if (entity.Steps is { Count: > 0 })
            {
                foreach (var step in entity.Steps)
                {
                    model.Steps.Add(StepMapper.Map(step));
                }
            }

            if (entity.Comments is { Count: > 0 })
            {
                foreach (var comment in entity.Comments)
                {
                    model.Comments.Add(CommentMapper.Map(comment));
                }
            }

            return model;
        }
    }
}
