using Vortex.API.ViewModels;

namespace Vortex.API.ViewModels;

/// <summary>
/// The project.
/// </summary>
public class ProjectViewModel
{
    public ProjectViewModel()
    {
        Tasks = new List<TaskItemViewModel>();
    }

    /// <summary>
    /// The project id.
    /// </summary>
    public int ProjectId { get; set; }

    /// <summary>
    /// The project name.
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// Tasks associated with the Project.
    /// </summary>
    public ICollection<TaskItemViewModel> Tasks { get; set; }
}