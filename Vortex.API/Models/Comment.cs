namespace Vortex.API.Models;

/// <summary>
/// A comment.
/// </summary>
public class Comment
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
    public TaskItem Task { get; set; }

    /// <summary>
    /// The id of the user who created the comment.
    /// </summary>
    public string UserId { get; set; }

    /// <summary>
    /// The user.
    /// </summary>
    public ApplicationUser User { get; set; }
}