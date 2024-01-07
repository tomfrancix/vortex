using Microsoft.AspNetCore.Identity;

namespace Vortex.API.Models
{
    /// <summary>
    /// The application user extends the Microsoft Identity User.
    /// </summary>
    public class ApplicationUser : IdentityUser
    {
        public ApplicationUser()
        {
            CreatedCompanies = new List<Company>();
            UserCompanies = new List<UserCompany>();
            CreatedProjects = new List<Project>();
            CreatedTasks = new List<TaskItem>();
            Comments = new List<Comment>();
        }

        /// <summary>
        /// The users first name.
        /// </summary>
        public string FirstName { get; set; }

        /// <summary>
        /// The users last name.
        /// </summary>
        public string LastName { get; set; }

        /// <summary>
        /// Companies created by the user.
        /// </summary>
        public ICollection<Company> CreatedCompanies { get; set; }

        /// <summary>
        /// Companies the user si associated with.
        /// </summary>
        public ICollection<UserCompany> UserCompanies { get; set; }

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
    }
}
