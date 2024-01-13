using Vortex.API.Data;

namespace Vortex.API.Data;

/// <summary>
/// The comment.
/// </summary>
public class CreateCommentDescriptor
{
    /// <summary>
    /// The text.
    /// </summary>
    public string Text { get; set; }

    /// <summary>
    /// The task id.
    /// </summary>
    public int TaskItemId { get; set; }
}