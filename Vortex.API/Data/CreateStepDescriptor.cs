using Vortex.API.Data;

namespace Vortex.API.Data;

/// <summary>
/// The step.
/// </summary>
public class CreateStepDescriptor
{

    /// <summary>
    /// The name.
    /// </summary>
    public string Content { get; set; }

    /// <summary>
    /// The task id.
    /// </summary>
    public int TaskItemId { get; set; }
}