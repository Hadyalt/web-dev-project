using Microsoft.AspNetCore.Mvc;
using StarterKit.Services;
using StarterKit.Models;
using StarterKit.Utils;
using System.Collections.Generic;

namespace StarterKit.Controllers
{
    [ApiController]
    [Route("Api/v1/controller")]
    public class EventsController : Controller
    {
        private readonly DatabaseContext _context;
        private readonly ILoginService _loginService;
        private readonly EventService _eventService;

        public EventsController(DatabaseContext context, ILoginService loginService)
        {
            _context = context;
            _loginService = loginService;
            _eventService = new EventService();
        }

        [HttpGet("Read")]
        public ActionResult<List<Event>> GetAllEvents()
        {
            var events = _eventService.GetAllEvents();
            return Ok(events);
        }

        [HttpGet("Read/{EventId}")]
        public ActionResult<Event> GetEventById([FromRoute] int EventId)
        {
            var singleEvent = _eventService.GetEventById(EventId);
            if (singleEvent is null)
            {
                return BadRequest("There is no event with that id");
            }
            return Ok(singleEvent);
        }

        [HttpPost("Create")]
        public IActionResult Create([FromBody] CreateEventRequest request)
        {
            if (!_loginService.IsAdminLoggedIn())
            {
                return Unauthorized("Only admins can create events.");
            }

            var newEvent = new Event
            {
                Title = request.Title,
                Description = request.Description,
                EventDate = request.Date,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                Location = request.Location,
                AdminApproval = true, 
                Event_Attendances = new List<Event_Attendance>() 
            };
            _context.Event.Add(newEvent);
            _context.SaveChanges();

            var createdEvent = new
            {
                newEvent.EventId,
                newEvent.Title,
                newEvent.Description,
                newEvent.EventDate,
                newEvent.StartTime,
                newEvent.EndTime,
                newEvent.Location,
                newEvent.AdminApproval
            };

            return Ok(new
            {
                Message = "Event created successfully.",
                EventDetails = createdEvent
            });
        }


        [HttpDelete("delete/{eventId}")]
        public IActionResult Delete(int eventId)
        {
            if (!_loginService.IsAdminLoggedIn())
            {
                return Unauthorized("Only admins can delete events.");
            }

            var eventToDelete = _context.Event.FirstOrDefault(e => e.EventId == eventId);

            if (eventToDelete == null)
            {
                return NotFound("Event not found.");
            }

            _context.Event.Remove(eventToDelete);
            _context.SaveChanges();

            return Ok("Event deleted successfully.");
        }

        [HttpPut("Update/{id}")]
        public IActionResult Update(int id, [FromBody] UpdateEventRequest request)
        {
            if (!_loginService.IsAdminLoggedIn())
            {
                return Unauthorized("Only admins can update events.");
            }

            var existingEvent = _context.Event.FirstOrDefault(e => e.EventId == id);
            if (existingEvent == null)
            {
                return NotFound("Event not found.");
            }

            existingEvent.Title = request.Title ?? existingEvent.Title;
            existingEvent.Description = request.Description ?? existingEvent.Description;
            existingEvent.EventDate = request.Date ?? existingEvent.EventDate;
            existingEvent.StartTime = request.StartTime ?? existingEvent.StartTime;
            existingEvent.EndTime = request.EndTime ?? existingEvent.EndTime;
            existingEvent.Location = request.Location ?? existingEvent.Location;

            _context.SaveChanges();

            return Ok("Event updated successfully.");
        }
    }
}
