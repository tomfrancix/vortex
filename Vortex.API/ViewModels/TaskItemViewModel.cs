using System.Threading.Tasks;
using Vortex.API.Enum;

namespace Vortex.API.ViewModels;

/// <summary>
/// A task.
/// </summary>
public class TaskItemViewModel
{
    public TaskItemViewModel()
    {
        Steps = new List<StepViewModel>();
        Comments = new List<CommentViewModel>();
    }

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
    /// The task rank.
    /// </summary>
    public int Rank { get; set; }

    /// <summary>
    /// The name of the user who created the task.
    /// </summary>
    public TaskItemStatus Status { get; set; }

    /// <summary>
    /// The comments associated with this task.
    /// </summary>
    public ICollection<StepViewModel> Steps { get; set; }

    /// <summary>
    /// The comments associated with this task.
    /// </summary>
    public ICollection<CommentViewModel> Comments { get; set; }
}