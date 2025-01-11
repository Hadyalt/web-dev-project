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
            var loggedInUserId = _httpContextAccessor.HttpContext.Session.GetString("UserId");
            if (string.IsNullOrEmpty(loggedInUserId))
            {
                return Unauthorized("User is not logged in.");
            }
            var evnt = _context.Event.FirstOrDefault(e => e.EventId == request.EventId);
            if (evnt == null)
            {

                return NotFound("Event not found.");
            }
            if (evnt.EventDate < DateOnly.FromDateTime(DateTime.Now) || 
                (evnt.EventDate == DateOnly.FromDateTime(DateTime.Now) && evnt.StartTime < TimeSpan.FromTicks(DateTime.Now.TimeOfDay.Ticks)))
            {
                return BadRequest("Event has already started or passed.");
            }
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

        [HttpPost("review")]
        public IActionResult Review([FromBody] AttendRequest request)
        {
            var loggedInUserId = _httpContextAccessor.HttpContext.Session.GetString("UserId");
            if (string.IsNullOrEmpty(loggedInUserId))
            {
                return Unauthorized("User is not logged in.");
            }
            var evnt = _context.Event.FirstOrDefault(e => e.EventId == request.EventId);
            if (evnt == null)
            {

                return NotFound("Event not found.");
            }
            if (evnt.EventDate > DateOnly.FromDateTime(DateTime.Now) || 
                (evnt.EventDate == DateOnly.FromDateTime(DateTime.Now) && evnt.StartTime > TimeSpan.FromTicks(DateTime.Now.TimeOfDay.Ticks)))
            {
                return BadRequest("Event has already started or passed.");
            }
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
            var loggedInUserId = _httpContextAccessor.HttpContext.Session.GetString("UserId");
            if (string.IsNullOrEmpty(loggedInUserId))
            {
                return Unauthorized("User is not logged in.");
            }
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
    
    // GET endpoint to view the list of events attended by a specific user do that by first lookin gin the event_attendance table and using the found event id look in the event table
    [HttpGet("events/user")]
    public IActionResult GetEvents()
    {
        var loggedInUserId = _httpContextAccessor.HttpContext.Session.GetString("UserId");
        if (string.IsNullOrEmpty(loggedInUserId))
        {
            return Unauthorized("User is not logged in.");
        }
        var eventsId = _context.Event_Attendance
            .Where(ea => ea.UserId == int.Parse(loggedInUserId))
            .Select(ea => ea.EventId)
            .ToList();

        var events = _context.Event
            .Where(e => eventsId.Contains(e.EventId))
            .Select(e => new
            {
                e.EventId,
                e.Title,
                e.Location,
                e.EventDate,
                e.Description,
                e.StartTime,
                e.EndTime,
                e.AdminApproval
            })
            .ToList();

        return Ok(events);
    }

    // DELETE endpoint to remove a user's attendance for a specific event
    [HttpDelete("remove/{eventId}")]
    public IActionResult RemoveAttendance(int eventId)
    {
        var loggedInUserId = _httpContextAccessor.HttpContext.Session.GetString("UserId");
        if (string.IsNullOrEmpty(loggedInUserId))
        {
            return Unauthorized("User is not logged in.");
        }
        var attendance = _context.Event_Attendance
            .FirstOrDefault(ea => ea.UserId == int.Parse(loggedInUserId) && ea.EventId == eventId);

        if (attendance == null)
        {
            return NotFound("No attendance found for the event.");
        }
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
        public DateTime AttendanceDate { get; set; }

    }
}
