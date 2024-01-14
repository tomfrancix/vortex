using Vortex.API.Data;

namespace Vortex.API.Data;

/// <summary>
/// The invitation response.
/// </summary>
public class RespondToInvitationDescriptor
{
    /// <summary>
    /// The response.
    /// </summary>
    public bool Response { get; set; }

    /// <summary>
    /// The company id.
    /// </summary>
    public int CompanyId { get; set; }
}