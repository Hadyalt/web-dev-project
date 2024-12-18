using Microsoft.EntityFrameworkCore;
using StarterKit.Models;
using StarterKit.Services;

namespace StarterKit
{
    class Program
    {
        static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container
            builder.Services.AddControllersWithViews();
            builder.Services.AddDistributedMemoryCache();
            builder.Services.AddHttpContextAccessor();

            // Register scoped services
            builder.Services.AddScoped<ILoginService, LoginService>();
            builder.Services.AddScoped<IOfficeService, OfficeService>();
            builder.Services.AddScoped<IVoteService, VotingService>();

            // Configure session
            builder.Services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(20); // Session timeout
                options.Cookie.HttpOnly = true;                // Enhance security
                options.Cookie.IsEssential = true;             // Required for GDPR compliance
            });

            // Configure database context
            builder.Services.AddDbContext<DatabaseContext>(options =>
                options.UseSqlite(builder.Configuration.GetConnectionString("SqlLiteDb")));

            // Configure CORS policy
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp", corsBuilder =>
                {
                    corsBuilder.WithOrigins("http://localhost:3000") // React app's URL
                               .AllowAnyHeader()
                               .AllowAnyMethod()
                               .AllowCredentials(); // Enable cookies/session
                });
            });

            var app = builder.Build();
            app.Urls.Add("http://localhost:3001");

            // Configure the HTTP request pipeline
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts(); // Add HTTP Strict Transport Security
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            // Configure CORS
            app.UseCors("AllowReactApp");

            // Enable session middleware
            app.UseSession();

            // Add authorization
            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.Run();
        }
    }
}