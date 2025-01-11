using Microsoft.Data.Sqlite;
using System.Collections.Generic;
using StarterKit.Models;

public class EventService
{
    private readonly string _connectionString = "Data Source=webdevproject.db";

    // Method to get all events
    public List<Event> GetAllEvents()
    {
        var events = new List<Event>();

        using (var connection = new SqliteConnection(_connectionString))
        {
            connection.Open();

            var query = "SELECT * FROM Event"; 
            using (var command = new SqliteCommand(query, connection))
            {
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var eventId = reader.GetInt32(0);
                        var eventItem = new Event
                        {
                            EventId = eventId,
                            Title = reader.GetString(1),
                            Description = reader.GetString(2),
                            EventDate = DateOnly.FromDateTime(reader.GetDateTime(3)),
                            StartTime = reader.GetTimeSpan(4),
                            EndTime = reader.GetTimeSpan(5),
                            Location = reader.GetString(6),
                            AdminApproval = reader.GetBoolean(7),
                            Event_Attendances = GetEventAttendances(eventId) 
                        };

                        eventItem.AverageRating = eventItem.Event_Attendances.Any() ? 
                            eventItem.Event_Attendances.Average(ea => ea.Rating) : 0;

                        events.Add(eventItem);
                    }
                }
            }
        }

        return events;
    }

    public Event GetEventById(int id)
    {
        var allEvents = GetAllEvents();
        Event singleEvent = allEvents.FirstOrDefault(evnt => evnt.EventId == id);
        return singleEvent;
    }

    // Method to get all event attendances for a specific event
    private List<Event_Attendance> GetEventAttendances(int eventId)
    {
        var eventAttendances = new List<Event_Attendance>();

        using (var connection = new SqliteConnection(_connectionString))
        {
            connection.Open();

            var query = "SELECT * FROM Event_Attendance WHERE EventId = @EventId"; 
            using (var command = new SqliteCommand(query, connection))
            {
                command.Parameters.AddWithValue("@EventId", eventId);

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var attendance = new Event_Attendance
                        {
                            Event_AttendanceId = reader.GetInt32(0),
                            Rating = reader.GetInt32(1),
                            Feedback = reader.GetString(2),
                            UserId = reader.GetInt32(3),
                            EventId = reader.GetInt32(4)
                        };

                        eventAttendances.Add(attendance);
                    }
                }
            }
        }

        return eventAttendances;
    }

    // Method to create a new event
    public void CreateEvent(Event newEvent)
    {
        using (var connection = new SqliteConnection(_connectionString))
        {
            connection.Open();

            var query = "INSERT INTO Event (Title, Description, EventDate, StartTime, EndTime, Location, AdminApproval) VALUES (@Title, @Description, @EventDate, @StartTime, @EndTime, @Location, @AdminApproval)";
            using (var command = new SqliteCommand(query, connection))
            {
                command.Parameters.AddWithValue("@Title", newEvent.Title);
                command.Parameters.AddWithValue("@Description", newEvent.Description);
                command.Parameters.AddWithValue("@EventDate", newEvent.EventDate);
                command.Parameters.AddWithValue("@StartTime", newEvent.StartTime);
                command.Parameters.AddWithValue("@EndTime", newEvent.EndTime);
                command.Parameters.AddWithValue("@Location", newEvent.Location);
                command.Parameters.AddWithValue("@AdminApproval", newEvent.AdminApproval);

                command.ExecuteNonQuery();
            }
        }
    }
}