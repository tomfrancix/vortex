using System.ComponentModel.DataAnnotations;
using Vortex.API.Models;

namespace Vortex.API.ViewModels
{
    public class CompanyViewModel
    {
        public CompanyViewModel()
        {
            Users = new List<UserViewModel>();
            Projects = new List<ProjectViewModel>();
        }

        [Required]
        [Display(Name = "Name")]
        public string Name { get; set; }

        /// <summary>
        /// Users associated with the company.
        /// </summary>
        public ICollection<UserViewModel> Users { get; set; }

        /// <summary>
        /// Projects belonging to the company.
        /// </summary>
        public ICollection<ProjectViewModel> Projects { get; set; }

    }
}
