namespace Vortex.API.Models;

/// <summary>
/// The invitation class.
/// </summary>
public class Invitation
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
    /// The company.
    /// </summary>
    public Company Company { get; set; }

    /// <summary>
    /// The id of the company.
    /// </summary>
    public int CompanyId { get; set; }

    /// <summary>
    /// The company id.
    /// </summary>
    public bool AcceptedInvitation { get; set; }
}