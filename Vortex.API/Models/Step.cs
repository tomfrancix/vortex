namespace Vortex.API.Models;

/// <summary>
/// A step.
/// </summary>
public class Step
{
    /// <summary>
    /// The step id.
    /// </summary>
    public int StepId { get; set; }

    /// <summary>
    /// The content of the step.
    /// </summary>
    public string Content { get; set; }

    /// <summary>
    /// The step status.
    /// </summary>
    public bool Status { get; set; }

    /// <summary>
    /// The task id.
    /// </summary>
    public int TaskId { get; set; }

    /// <summary>
    /// The task.
    /// </summary>
    public TaskItem Task { get; set; }
}