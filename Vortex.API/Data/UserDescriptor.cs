using Microsoft.AspNetCore.Identity;
using Vortex.API.Models;

namespace Vortex.API.Data
{
    /// <summary>
    /// The application user extends the Microsoft Identity User.
    /// </summary>
    public class UserDescriptor
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

        /// <summary>
        /// The user token.
        /// </summary>
        public string Token { get; set; }

        /// <summary>
        /// Companies created by the user.
        /// </summary>
        public ICollection<Company> CreatedCompanies { get; set; }

        /// <summary>
        /// Companies the user si associated with.
        /// </summary>
        public ICollection<CompanyDescriptor> UserCompanies { get; set; }

        /// <summary>
        /// Projects created by the user.
        /// </summary>
        public ICollection<Project> CreatedProjects { get; set; }

        /// <summary>
        /// Tasks created by the user.
        /// </summary>
        public ICollection<TaskItem> CreatedTasks { get; set; }

        /// <summary>
        /// Comments by the user.
        /// </summary>
        public ICollection<Comment> Comments { get; set; }

        /// <summary>
        /// Invitations to companies.
        /// </summary>
        public ICollection<InvitationViewModel> Invitations { get; set; }
    }
}
