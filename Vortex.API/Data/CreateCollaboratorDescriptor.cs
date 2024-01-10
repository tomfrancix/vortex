using Vortex.API.Data;

namespace Vortex.API.Data;

/// <summary>
/// The company.
/// </summary>
public class CreateCollaboratorDescriptor
{
    /// <summary>
    /// The email.
    /// </summary>
    public string Email { get; set; }

    /// <summary>
    /// The company id.
    /// </summary>
    public int CompanyId { get; set; }
}