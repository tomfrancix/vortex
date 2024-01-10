using Vortex.API.Enum;

namespace Vortex.API.Models;

/// <summary>
/// A task.
/// </summary>
public class TaskItem
{
    /// <summary>
    /// The task id.
    /// </summary>
    public int TaskItemId { get; set; }

    /// <summary>
    /// The task summary.
    /// </summary>
    public string Summary { get; set; }

    /// <summary>
    /// The task description.
    /// </summary>
    public string Description { get; set; }

    /// <summary>
    /// The name of the user who created the task.
    /// </summary>
    public string Creator { get; set; }

    /// <summary>
    /// The name of the user who created the task.
    /// </summary>
    public string Owner { get; set; }

    /// <summary>
    /// The name of the user who created the task.
    /// </summary>
    public TaskItemStatus Status { get; set; }

    /// <summary>
    /// The id of the project.
    /// </summary>
    public int ProjectId { get; set; }

    /// <summary>
    /// The project.
    /// </summary>
    public Project Project { get; set; }

    /// <summary>
    /// The comments associated with this task.
    /// </summary>
    public ICollection<Step> Steps { get; set; }

    /// <summary>
    /// The comments associated with this task.
    /// </summary>
    public ICollection<Comment> Comments { get; set; }
}