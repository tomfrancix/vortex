using Vortex.API.Data;

namespace Vortex.API.Data;

/// <summary>
/// The company.
/// </summary>
public class EditTaskDescriptor
{
    /// <summary>
    /// The value.
    /// </summary>
    public string Value { get; set; }

    /// <summary>
    /// The field.
    /// </summary>
    public string Field { get; set; }

    /// <summary>
    /// The task id.
    /// </summary>
    public int TaskItemId { get; set; }
}