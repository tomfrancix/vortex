using Microsoft.AspNetCore.Identity;

namespace Vortex.API.Models
{
    /// <summary>
    /// The user view model.
    /// </summary>
    public class UserViewModel
    {
        /// <summary>
        /// The users first name.
        /// </summary>
        public string FirstName { get; set; }

        /// <summary>
        /// The users last name.
        /// </summary>
        public string LastName { get; set; }

        public string Email { get; set; }
        public string UserName { get; set; }
    }
}
