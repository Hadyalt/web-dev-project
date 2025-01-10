using System.Text.Json.Serialization;

namespace StarterKit.Models
{
    public class User
    {
        public int UserId { get; set; }
        public required string UserName { get; set; }
        public required string UserRole { get; set; }

        public required string FirstName { get; set; }

        public required string LastName { get; set; }

        public required string Email { get; set; }

        public required string Password { get; set; }

        // A comma sepparated string that could look like this: "mo,tu,we,th,fr"
        public required string RecuringDays { get; set; }

        public required List<Attendance> Attendances { get; set; }

        public required List<Event_Attendance> Event_Attendances { get; set; }
    }

    public class Attendance
    {
        public int AttendanceId { get; set; }

        public DateTime AttendanceDate { get; set; }

        public required int UserId { get; set; }
    }

    public class Event_Attendance
    {
        public int Event_AttendanceId { get; set; }
        public int Rating { get; set; }
        public required string Feedback { get; set; }
        public required int UserId { get; set; }
        public required int EventId { get; set; }
    }

    public class Event
    {
        public int EventId { get; set; }

        public required string Title { get; set; }

        public required string Description { get; set; }

        public DateOnly EventDate { get; set; }

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }

        public required string Location { get; set; }

        public bool AdminApproval { get; set; }

        public required List<Event_Attendance> Event_Attendances { get; set; }

        public double AverageRating { get; set; }
    }

    public class Office
    {
        public int OfficeId { get; set; }

        public DateOnly Date { get; set; }

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }
    }

    public class Office_attendance
    {
        public int Id { get; set; }
        public int OfficeId { get; set; }
        public int UserId { get; set; }
    }
}