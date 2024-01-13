using Microsoft.AspNetCore.Identity;
using Vortex.API.Models;
using Vortex.API.ViewModels;

namespace Vortex.API.Mappers
{
    /// <summary>
    /// Map model to view model.
    /// </summary>
    public class CompanyMapper
    {
        private readonly UserMapper UserMapper;
        private readonly ProjectMapper ProjectMapper;

        public CompanyMapper(UserMapper userMapper, ProjectMapper projectMapper)
        {
            UserMapper = userMapper;
            ProjectMapper = projectMapper;
        }

        public CompanyViewModel Map(Company entity)
        {
            var model = new CompanyViewModel
            {
                Name = entity.Name
            };

            if (entity.Projects is { Count: > 0 })
            {
                foreach (var project in entity.Projects)
                {
                    model.Projects.Add(ProjectMapper.Map(project));
                }
            }

            return model;
        }
    }
}
