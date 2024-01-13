using Vortex.API.Models;
using Vortex.API.ViewModels;

namespace Vortex.API.Mappers
{
    /// <summary>
    /// Map model to view model.
    /// </summary>
    public class StepMapper
    {
        public StepViewModel Map(Step entity)
        {
            var model = new StepViewModel
            {
                StepId = entity.StepId,
                Status = entity.Status,
                Content = entity.Content
            };

            return model;
        }
    }
}
