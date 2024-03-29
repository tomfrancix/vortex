﻿using Vortex.API.Data;

namespace Vortex.API.Data;

/// <summary>
/// The task.
/// </summary>
public class CreateTaskItemDescriptor
{

    /// <summary>
    /// The name.
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// The project id.
    /// </summary>
    public int ProjectId { get; set; }
}