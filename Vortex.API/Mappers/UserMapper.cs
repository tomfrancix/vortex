using Microsoft.AspNetCore.Identity;
using Vortex.API.Models;

namespace Vortex.API.Mappers
{
    /// <summary>
    /// Map model to view model.
    /// </summary>
    public class UserMapper
    {
        public UserViewModel Map(ApplicationUser entity)
        {
            return new UserViewModel
            {
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                Email = entity.Email,
                UserName = entity.UserName
            };
        }
    }
}
