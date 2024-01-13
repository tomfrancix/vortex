namespace Vortex.API.Models;

/// <summary>
/// The invitation class.
/// </summary>
public class InvitationViewModel
{
    /// <summary>
    /// The id of the invitation.
    /// </summary>
    public int InvitationId { get; set; }

    /// <summary>
    /// The email of the invited person.
    /// </summary>
    public string Email { get; set; }

    /// <summary>
    /// The id of the company.
    /// </summary>
    public int CompanyId { get; set; }

    /// <summary>
    /// The name of the company.
    /// </summary>
    public string CompanyName { get; set; }

    /// <summary>
    /// The company id.
    /// </summary>
    public bool AcceptedInvitation { get; set; }
}