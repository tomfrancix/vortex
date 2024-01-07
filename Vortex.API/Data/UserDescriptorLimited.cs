using Microsoft.AspNetCore.Identity;
using Vortex.API.Models;

namespace Vortex.API.Data
{
    /// <summary>
    /// The application user extends the Microsoft Identity User.
    /// </summary>
    public class UserDescriptorLimited
    {
        /// <summary>
        /// The users first name.
        /// </summary>
        public string FirstName { get; set; }

        /// <summary>
        /// The users last name.
        /// </summary>
        public string LastName { get; set; }

        /// <summary>
        /// The username.
        /// </summary>
        public string UserName { get; set; }
    }
}
