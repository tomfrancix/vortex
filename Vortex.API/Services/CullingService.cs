using Microsoft.EntityFrameworkCore;
using Vortex.API.Interfaces;
using Vortex.API.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Vortex.API.Services
{
    public class CullingService : ICullingService
    {
        private readonly ApplicationDbContext Context;

        public CullingService(ApplicationDbContext context)
        {
            Context = context;
        }

        public async Task<int> DeleteCompany(int id)
        {
            var company = await Context.Companies
                .Include(c => c.Projects)
                .ThenInclude(p => p.Tasks)
                .FirstOrDefaultAsync(c => c.CompanyId == id);

            foreach (var project in company.Projects)
            {
                await DeleteProject(project.ProjectId);
            }

            Context.Projects.RemoveRange(company.Projects);

            Context.Companies.Remove(company);
            return await Context.SaveChangesAsync();
        }

        public async Task<int> DeleteProject(int id)
        {
            var entity = await Context.Projects
                .Include(c => c.Tasks)
                .FirstOrDefaultAsync(c => c.ProjectId == id);

            Context.Tasks.RemoveRange(entity.Tasks);

            Context.Projects.Remove(entity);

            return await Context.SaveChangesAsync();
        }

        public async Task<int> DeleteTask(int id)
        {
            var entity = await Context.Tasks
                .Include(c => c.Steps)
                .FirstOrDefaultAsync(c => c.TaskItemId == id);

            Context.Steps.RemoveRange(entity.Steps);

            Context.Tasks.Remove(entity);

            return await Context.SaveChangesAsync();
        }

        public async Task<int> DeleteStep(int id)
        {
            var entity = await Context.Steps
                .FirstOrDefaultAsync(c => c.StepId == id);

            Context.Steps.Remove(entity);

            return await Context.SaveChangesAsync();
        }
    }
}
