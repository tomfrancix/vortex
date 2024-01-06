namespace Vortex.API.Models;

/// <summary>
/// The company.
/// </summary>
public class Company
{
    /// <summary>
    /// The company id.
    /// </summary>
    public int CompanyId { get; set; }

    /// <summary>
    /// The company name.
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// The user id of the user who created the company.
    /// </summary>
    public string UserId { get; set; }

    /// <summary>
    /// The user who created the company.
    /// </summary>
    public ApplicationUser User { get; set; }

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