namespace StarterKit.Services;

public interface ILoginService
{
    public LoginStatus CheckPassword(string username, string password);
    int GetLoggedInUserId();
    bool IsAdminLoggedIn();
    bool IsUserLoggedIn()
    {
        return true;
    }
    
}