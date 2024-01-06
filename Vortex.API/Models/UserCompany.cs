namespace Vortex.API.Models;

/// <summary>
/// The user-company many-to-many class.
/// </summary>
public class UserCompany
{
    /// <summary>
    /// The user id of the user who created the company.
    /// </summary>
    public string UserId { get; set; }

    /// <summary>
    /// The user who created the company.
    /// </summary>
    public ApplicationUser User { get; set; }

    /// <summary>
    /// The company id.
    /// </summary>
    public int CompanyId { get; set; }

    /// <summary>
    /// The company.
    /// </summary>
    public Company Company { get; set; }
}