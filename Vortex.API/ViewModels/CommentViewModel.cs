using Vortex.API.Models;

namespace Vortex.API.ViewModels;

/// <summary>
/// A comment.
/// </summary>
public class CommentViewModel
{
    /// <summary>
    /// The comment id.
    /// </summary>
    public int CommentId { get; set; }

    /// <summary>
    /// The content of the comment.
    /// </summary>
    public string Content { get; set; }

    /// <summary>
    /// The task id.
    /// </summary>
    public int TaskId { get; set; }

    /// <summary>
    /// The task.
    /// </summary>
    public TaskItemViewModel Task { get; set; }

    /// <summary>
    /// The id of the user who created the comment.
    /// </summary>
    public string UserId { get; set; }

    /// <summary>
    /// The user.
    /// </summary>
    public UserViewModel User { get; set; }
}