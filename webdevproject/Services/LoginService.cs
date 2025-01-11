using StarterKit.Models;
using StarterKit.Utils;
using System.Data.SQLite;
using System.Net.WebSockets;

namespace StarterKit.Services;

public enum LoginStatus { IncorrectPassword, IncorrectUsername, Success }

public enum ADMIN_SESSION_KEY { adminLoggedIn }

public class LoginService : ILoginService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    private readonly DatabaseContext _context;

    public string connectionString = "Data Source=webdevproject.db";

    public LoginService(DatabaseContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

     
    public int GetLoggedInUserId()
    {
        var userIdString = _httpContextAccessor.HttpContext.Session.GetString("UserId");
        if (int.TryParse(userIdString, out int userId))
        {
            return userId;
        }
        throw new Exception("User is not logged in or UserId is not set in session.");
    }

    public LoginStatus CheckPassword(string username, string inputPassword)
    {
        Console.WriteLine($"Received Username: {username}");
        Console.WriteLine($"Received Password: {inputPassword}");
        if (_httpContextAccessor.HttpContext == null)
        {
            throw new Exception("HttpContext is null. Make sure HttpContextAccessor is properly registered and available.");
        }

        string encypInputPassword = EncryptionHelper.EncryptPassword(inputPassword);
        string storedHashedPassword = GetStoredPasswordHashFromAdmin(username);

        if (storedHashedPassword == null)
        {   
            storedHashedPassword = GetStoredPasswordHashFromUser(username);

            if (storedHashedPassword == null)
            {

                return LoginStatus.IncorrectUsername;
            }
        }

        if (encypInputPassword == storedHashedPassword)
        {
            var admin = _context.Admin.FirstOrDefault(u => u.UserName == username);

            if (admin == null)
            {
                var user1 = _context.User.FirstOrDefault(u => u.UserName == username);
                
                if (user1 == null)
                {
                return LoginStatus.IncorrectUsername; 
                }
                
                else{
                    _httpContextAccessor.HttpContext.Session.SetString("Username", user1.UserName);
                    _httpContextAccessor.HttpContext.Session.SetString("UserRole", user1.UserRole);
                    _httpContextAccessor.HttpContext.Session.SetString("UserId", user1.UserId.ToString());
                    
                    return LoginStatus.Success; 
                }
            }

            _httpContextAccessor.HttpContext.Session.SetString("Username", admin.UserName);
            _httpContextAccessor.HttpContext.Session.SetString("UserRole", admin.UserRole);
            _httpContextAccessor.HttpContext.Session.SetString("UserId", admin.AdminId.ToString());

            
            return LoginStatus.Success;
        }
        else
        {
            return LoginStatus.IncorrectPassword;
        }
    }

    private string GetStoredPasswordHashFromAdmin(string username)
    {
        string query = @"SELECT Password FROM Admin WHERE UserName = @Username";

        using (SQLiteConnection connection = new SQLiteConnection(connectionString))
        {
            connection.Open();
            using (SQLiteCommand command = new SQLiteCommand(query, connection))
            {
                command.Parameters.AddWithValue("@Username", username);

                using (SQLiteDataReader reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return reader.GetString(0); 
                    }
                    else
                    {
                        return null; 
                    }
                }
            }
        }
    }

    private string GetStoredPasswordHashFromUser(string username)
    {
        string query = @"SELECT Password FROM User WHERE UserName = @Username";

        using (SQLiteConnection connection = new SQLiteConnection(connectionString))
        {
            connection.Open();
            using (SQLiteCommand command = new SQLiteCommand(query, connection))
            {
                command.Parameters.AddWithValue("@Username", username);

                using (SQLiteDataReader reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return reader.GetString(0); 
                    }
                    else
                    {
                        return null; 
                    }
                }
            }
        }
    }
    public bool IsAdminLoggedIn()
    {
        var userRole = _httpContextAccessor.HttpContext.Session.GetString("UserRole");
        return userRole == "admin";
    }
}