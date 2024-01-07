using System.ComponentModel.DataAnnotations;
using Vortex.API.Models;

namespace Vortex.API.ViewModels
{
    public class CompanyViewModel
    {
        [Required]
        [Display(Name = "Name")]
        public string Name { get; set; }

        /// <summary>
        /// Users associated with the company.
        /// </summary>
        public ICollection<ApplicationUser> Users { get; set; }

        /// <summary>
        /// Projects belonging to the company.
        /// </summary>
        public ICollection<Project> Projects { get; set; }

        /// <summary>
        /// Users that belong to the company.
        /// </summary>
        public ICollection<UserCompany> UserCompanies { get; set; }

    }
}
