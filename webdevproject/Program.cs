using StarterKit.Models;
using StarterKit.Services;
using Microsoft.EntityFrameworkCore;

namespace StarterKit
{
    class Program
    {
        static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddControllersWithViews();
            builder.Services.AddDistributedMemoryCache();
            builder.Services.AddHttpContextAccessor();

            builder.Services.AddScoped<ILoginService, LoginService>();
            builder.Services.AddScoped<IOfficeService, OfficeService>();
            builder.Services.AddScoped<IVoteService, VotingService>();

            builder.Services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(20); 
                options.Cookie.HttpOnly = true;                
                options.Cookie.IsEssential = true;             
            });

            builder.Services.AddDbContext<DatabaseContext>(options =>
                options.UseSqlite(builder.Configuration.GetConnectionString("SqlLiteDb")));

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp", corsBuilder =>
                {
                    corsBuilder.WithOrigins("http://localhost:3000")
                               .AllowAnyHeader()
                               .AllowAnyMethod()
                               .AllowCredentials();
                });
            });

            var app = builder.Build();
            app.Urls.Add("http://localhost:3001");

            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();
            app.UseCors("AllowReactApp");

            app.UseSession();
            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.Run();
        }
    }
}