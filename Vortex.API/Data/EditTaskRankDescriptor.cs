using Vortex.API.Data;

namespace Vortex.API.Data;

/// <summary>
/// The company.
/// </summary>
public class EditTaskRankDescriptor
{
    /// <summary>
    /// The task id.
    /// </summary>
    public int TaskItemId { get; set; }

    /// <summary>
    /// The tasks old rank.
    /// </summary>
    public int OldRank { get; set; }

    /// <summary>
    /// The tasks new rank.
    /// </summary>
    public int NewRank { get; set; }
}