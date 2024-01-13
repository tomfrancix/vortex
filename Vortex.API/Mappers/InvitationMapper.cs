using Microsoft.AspNetCore.Identity;
using Vortex.API.Models;

namespace Vortex.API.Mappers
{
    /// <summary>
    /// Map model to view model.
    /// </summary>
    public class InvitationMapper
    {
        public InvitationViewModel Map(Invitation entity)
        {
            return new InvitationViewModel
            {
                CompanyId = entity.CompanyId,
                Email = entity.Email,
                InvitationId = entity.InvitationId
            };
        }
    }
}
