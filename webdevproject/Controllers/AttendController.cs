using Microsoft.AspNetCore.Mvc;
using StarterKit.Models;
using StarterKit.Services;
using System.Linq;

namespace StarterKit.Controllers
{
    [Route("api/v1/attendance")]
    [ApiController]
    public class AttendController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AttendController(DatabaseContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        // POST endpoint to submit attendance
        [HttpPost("attend")]
        public IActionResult Attend([FromBody] AttendRequest request)
        {
            // Retrieve the logged-in user
            var loggedInUserId = _httpContextAccessor.HttpContext.Session.GetString("UserId");
            if (string.IsNullOrEmpty(loggedInUserId))
            {
                return Unauthorized("User is not logged in.");
            }
            // Retrieve the event to check availability
            var evnt = _context.Event.FirstOrDefault(e => e.EventId == request.EventId);
            if (evnt == null)
            {

                return NotFound("Event not found.");
            }
            // Check if the event is still available (based on date and start time)
            if (evnt.EventDate < DateOnly.FromDateTime(DateTime.Now) || 
                (evnt.EventDate == DateOnly.FromDateTime(DateTime.Now) && evnt.StartTime < TimeSpan.FromTicks(DateTime.Now.TimeOfDay.Ticks)))
            {
                return BadRequest("Event has already started or passed.");
            }
            // Record the attendance
            var attendance = new Event_Attendance
            {

                EventId = request.EventId,
                UserId = request.UserId,
                Feedback = request.Feedback,
                Rating = request.Rating
            };
            
            _context.Event_Attendance.Add(attendance);
            _context.SaveChanges();
            return Ok(new { Message = "You have successfully attended the event.", Event = evnt });
        }

        // GET endpoint to view the list of attendees for a specific event
        [HttpGet("attendees/{eventId}")]
        public IActionResult GetAttendees(int eventId)
        {
            // Retrieve the logged-in user
            var loggedInUserId = _httpContextAccessor.HttpContext.Session.GetString("UserId");
            if (string.IsNullOrEmpty(loggedInUserId))
            {
                return Unauthorized("User is not logged in.");
            }

            // Retrieve the event attendees
            var attendees = _context.Event_Attendance
                .Where(ea => ea.EventId == eventId)
                .Select(ea => new
                {
                    ea.UserId,
                    ea.Feedback,
                    ea.Rating
                }).ToList();

            return Ok(attendees);
        }
        // GET endpoint to view the list of events attended by a specific user
        [HttpGet("events/user")]
        public IActionResult GetEvents(int userId)
        {
            // Retrieve the logged-in user
            var loggedInUserId = _httpContextAccessor.HttpContext.Session.GetString("UserId");
            if (string.IsNullOrEmpty(loggedInUserId))
            {
                return Unauthorized("User is not logged in.");
            }

            // Retrieve the events attended by the user
            var events = _context.Event_Attendance
                .Where(ea => ea.UserId == userId)
                .Select(ea => new
                {
                    ea.EventId,
                    ea.Feedback,
                    ea.Rating
                }).ToList();

            return Ok(events);
        }
        // DELETE endpoint to remove a user's attendance for a specific event
        [HttpDelete("remove/{eventId}")]
        public IActionResult RemoveAttendance(int eventId)
        {
            // Retrieve the logged-in user
            var loggedInUserId = _httpContextAccessor.HttpContext.Session.GetString("UserId");
            if (string.IsNullOrEmpty(loggedInUserId))
            {
                return Unauthorized("User is not logged in.");
            }

            // Find the attendance record for the user and event
            var attendance = _context.Event_Attendance
                .FirstOrDefault(ea => ea.UserId == int.Parse(loggedInUserId) && ea.EventId == eventId);

            if (attendance == null)
            {
                return NotFound("No attendance found for the event.");
            }

            // Remove the attendance
            _context.Event_Attendance.Remove(attendance);
            _context.SaveChanges();

            return Ok("You have successfully removed your attendance for the event.");
        }
    }

    // Request model for submitting attendance
    public class AttendRequest
    {
        public int UserId { get; set; }
        public int EventId { get; set; }
        public string Feedback { get; set; }
        public int Rating { get; set; }

    }
}
