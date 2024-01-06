namespace Vortex.API.Models;

/// <summary>
/// The project.
/// </summary>
public class Project
{
    /// <summary>
    /// The project id.
    /// </summary>
    public int ProjectId { get; set; }

    /// <summary>
    /// The project name.
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// The id of the company.
    /// </summary>
    public int CompanyId { get; set; }

    /// <summary>
    /// The company.
    /// </summary>
    public Company Company { get; set; }

    /// <summary>
    /// Tasks associated with the Project.
    /// </summary>
    public ICollection<TaskItem> Tasks { get; set; }
}