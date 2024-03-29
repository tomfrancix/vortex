﻿namespace Vortex.API.Interfaces
{
    public interface ICullingService
    {
        Task<int> DeleteCompany(int id);
        Task<int> DeleteProject(int id);
        Task<int> DeleteTask(int id);
        Task<int> DeleteStep(int id);
        Task<int> DeleteComment(int id);
    }
}
