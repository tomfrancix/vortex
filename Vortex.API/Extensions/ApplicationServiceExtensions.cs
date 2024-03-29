﻿using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Vortex.API.Interfaces;
using Vortex.API.Mappers;
using Vortex.API.Models;
using Vortex.API.Services;

namespace Vortex.API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration Configuration)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("CoreDatabaseConnection"));
            });

            services.AddDefaultIdentity<ApplicationUser>(options =>
                {
                    // Configure identity options if needed
                })
                .AddEntityFrameworkStores<ApplicationDbContext>();

            services.AddCors();

            services.ConfigureApplicationCookie(options =>
            {
                options.Cookie.Domain = "localhost"; // Set to your domain
                options.Cookie.Path = "/"; // Set to your path
                options.Cookie.SameSite = SameSiteMode.None;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            });

            services.AddIdentityCore<ApplicationUser>(options =>
            {
                options.Password.RequireNonAlphanumeric = false;
            });

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenKey"]));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });

            services.AddScoped<TokenService>();

            services.AddTransient<ICullingService, CullingService>();
            services.AddTransient<ISyncronisationService, SyncronisationService>();

            services.AddControllersWithViews();

            services.AddSingleton<UserMapper, UserMapper>();
            services.AddSingleton<CompanyMapper, CompanyMapper>();
            services.AddSingleton<ProjectMapper, ProjectMapper>();
            services.AddSingleton<TaskMapper, TaskMapper>();
            services.AddSingleton<StepMapper, StepMapper>();
            services.AddSingleton<CommentMapper, CommentMapper>();
            services.AddSingleton<InvitationMapper, InvitationMapper>();

            return services;
        }
    }
}
