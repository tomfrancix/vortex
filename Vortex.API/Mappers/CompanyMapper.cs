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
        private readonly InvitationMapper InvitationMapper;

        public CompanyMapper(UserMapper userMapper, ProjectMapper projectMapper, InvitationMapper invitationMapper)
        {
            UserMapper = userMapper;
            ProjectMapper = projectMapper;
            InvitationMapper = invitationMapper;
        }

        public CompanyViewModel Map(Company entity)
        {
            var model = new CompanyViewModel
            {
                CompanyId = entity.CompanyId,
                Name = entity.Name
            };

            if (entity.Projects is { Count: > 0 })
            {
                foreach (var project in entity.Projects)
                {
                    model.Projects.Add(ProjectMapper.Map(project));
                }
            }

            if (entity.Invitations is { Count: > 0 })
            {
                foreach (var invitation in entity.Invitations)
                {
                    model.Invitations.Add(InvitationMapper.Map(invitation));
                }
            }

            return model;
        }
    }
}
