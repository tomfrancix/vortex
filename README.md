# Vortex

A task management application build with React using an ASP.NET Core API backend with Microsoft Identity Platform authentication and T-SQL database server.

## Website

The website was bootstrapped using `create-react-app` and then customised.

- Build: `npm run build`
- Run locally: `npm start`

## API

The API uses EntityFramework. To add a migration:

- Update the models and ApplicationDbContext.
- Add migration: `dotnet ef migrations add MigrationName`
- Run migration: `dotnet ef database update`

May need to update EntityFramework tools: `dotnet tool update --global dotnet-ef`

# Running the project 

- C:\Source\vortex\Vortex.API\bin\Release\net8.0> dotnet Vortex.API.dll
- C:\Source\vortex\Vortex.Website\build>serve -s .
- C:\Source\vortex\Vortex.Website\src>npm start