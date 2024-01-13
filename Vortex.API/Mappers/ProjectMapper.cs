using Microsoft.AspNetCore.Identity;
using Vortex.API.Models;
using Vortex.API.ViewModels;

namespace Vortex.API.Mappers
{
    /// <summary>
    /// Map model to view model.
    /// </summary>
    public class ProjectMapper
    {
        private readonly UserMapper UserMapper;
        private readonly TaskMapper TaskMapper;

        public ProjectMapper(UserMapper userMapper, TaskMapper taskMapper)
        {
            UserMapper = userMapper;
            TaskMapper = taskMapper;
        }

        public ProjectViewModel Map(Project entity)
        {
            var model = new ProjectViewModel
            {
                ProjectId = entity.ProjectId,
                Name = entity.Name,
            };

            if (entity.Tasks is { Count: > 0 })
            {
                foreach (var task in entity.Tasks)
                {
                    model.Tasks.Add(TaskMapper.Map(task));
                }
            }

            return model;
        }
    }
}
