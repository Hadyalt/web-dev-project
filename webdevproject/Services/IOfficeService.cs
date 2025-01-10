namespace StarterKit.Services;
using StarterKit.Models;

public interface IOfficeService
{
    List<Office> GetAllOffices();
    Office GetOffice(int id);
    void CreateOffice(Office newOffice);
    Office UpdateOffice(Office OfficeToUpdated);
    bool DeleteOffice(int id);
    void SaveAttendance(Office_attendance attendance);
}