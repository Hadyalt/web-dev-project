using System.Security.Cryptography.Xml;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using StarterKit.Models;
using StarterKit.Services;
using StarterKit.Utils;

namespace StarterKit.Controllers;


[Route("api/v1/Login")]
public class LoginController : Controller
{
    private readonly ILoginService _loginService;
    private readonly DatabaseContext _context;

    private readonly IHttpContextAccessor _httpContextAccessor;

    public LoginController(ILoginService loginService, DatabaseContext databaseContext,  IHttpContextAccessor httpContextAccessor)
    {
        _loginService = loginService;
        _context = databaseContext;
        _httpContextAccessor = httpContextAccessor;
    }
    
    [HttpPost("Register")]
    public IActionResult Register([FromBody] RegisterBody registerBody)
    {
        //return a bad request if there is no db connection or User entity in the db
        if (_context == null || _context.User == null)
        {
            return StatusCode(500, "Database context or User entity is not available.");
        }

        //Make a new user from the request body
        var NewUser = new User
        {
            UserName = registerBody.UserName,
            UserRole = registerBody.UserRole,
            FirstName = registerBody.FirstName,
            LastName = registerBody.LastName,
            Email = registerBody.Email,
            Password = EncryptionHelper.EncryptPassword(registerBody.Password),
            RecuringDays = registerBody.RecuringDays,
            Attendances = new List<Attendance>(),
            Event_Attendances = new List<Event_Attendance>()
        };
        
        //add it to the db and save it
        _context.User.Add(NewUser);
        _context.SaveChanges();

        return Ok("User created successfully.");
    }

    [HttpPost("Login")]
    public IActionResult Login([FromBody] LoginBody loginBody)
    {
        if (string.IsNullOrEmpty(loginBody.Username) || string.IsNullOrEmpty(loginBody.Password))
        {
            return BadRequest(new { success = false, message = "Username or password is missing" });
        }

        // TODO: Implement login method
        var loginStatus = _loginService.CheckPassword(loginBody.Username, loginBody.Password);

        if (loginStatus == LoginStatus.Success)
        {
            var userRole = _httpContextAccessor.HttpContext?.Session.GetString("UserRole");
            var userId = _httpContextAccessor.HttpContext?.Session.GetString("UserId");
            return Ok(new { success = true, message = "Login Successful", loginBody.Username, userRole, userId });
        }
        else if (loginStatus == LoginStatus.IncorrectUsername)
        {
            return Unauthorized(new { success = false, message = $"Incorrect username: {loginBody.Username}" });
        }
        else
        {
            return Unauthorized(new { success = false, message = $"Incorrect password for username: {loginBody.Username}" });
        }
    }


    [HttpGet("IsAdminLoggedIn")]
    public IActionResult IsAdminLoggedIn()
    {
        // TODO: This method should return a status 200 OK when logged in, else 403, unauthorized
        if (HttpContext.Session.GetString("UserRole") == "admin") return Ok($"Admin is logged in");
        return Unauthorized("You are not logged in");
    }

    [HttpGet("Logout")]
    public IActionResult Logout()
    {
        HttpContext.Session.Clear();
        return Ok("Logged out");
    }

}

public class LoginBody
{
    public string? Username { get; set; }
    public string? Password { get; set; }
}

public class RegisterBody
{
    public int UserId { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string? RecuringDays { get; set; }
    public string? UserName { get; set; }
    public string? UserRole { get; set; }
}