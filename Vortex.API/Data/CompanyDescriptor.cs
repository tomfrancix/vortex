using Vortex.API.Data;

namespace Vortex.API.Data;

/// <summary>
/// The company.
/// </summary>
public class CompanyDescriptor
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
    /// Users associated with the company.
    /// </summary>
    public ICollection<UserDescriptorLimited> UserDecriptors { get; set; }
}