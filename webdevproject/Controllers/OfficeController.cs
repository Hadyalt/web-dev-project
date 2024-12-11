using Microsoft.AspNetCore.Mvc;
using StarterKit.Services;
using StarterKit.Models;
using StarterKit.Utils;
using System.Collections.Generic;
using System.Runtime.CompilerServices;

namespace StarterKit.Controllers
{
    [ApiController]
    [Route("api/v1/office")]
    public class OfficeController : Controller
    {
        private readonly DatabaseContext _context;
        private readonly ILoginService _loginService;
        private readonly IOfficeService _officeService;

        public OfficeController(DatabaseContext context, ILoginService loginService, IOfficeService officeService)
        {
            _context = context;
            _loginService = loginService;
            _officeService = officeService;
        }

        [HttpGet("read")]
        public ActionResult<List<Office>> GetAllOffices()
        {
            if (!_loginService.IsUserLoggedIn())
            {
                return Unauthorized("Only users can read offices.");
            }
            var offices = _officeService.GetAllOffices();
            return Ok(offices);
        }

        [HttpGet("read/{id}")]
        public ActionResult<Office> GetOfficeById([FromRoute] int id)
        {
            if (!_loginService.IsUserLoggedIn())
            {
                return Unauthorized("Only users can read offices.");
            }
            
            Office office = _officeService.GetOffice(id);
            if (office is null)
            {
                return BadRequest("There is no office with that id.");
            }
            return Ok(office); 
        }

        [HttpPost("create")]
        public ActionResult<Office> CreateOffice([FromBody] Office newOffice)
        {
            if (!_loginService.IsAdminLoggedIn())
            {
                return Unauthorized("Only admins can create offices.");
            }
            _officeService.CreateOffice(newOffice);
            return Ok("office created successfully.");
        }
        
        [HttpPut("update")]
        public ActionResult<Office> UpdateOffice([FromBody] Office OfficeToUpdate)
        {
            if(_loginService.IsUserLoggedIn())
            {
                var LoggedId = _loginService.GetLoggedInUserId();
                Office updatedOffice = _officeService.UpdateOffice(OfficeToUpdate);
                if (updatedOffice == null)
                {
                    return BadRequest("Office does not exist.");
                }
                else if (updatedOffice.UserId == LoggedId)
                {
                    return Ok("You have now reserved the office space");
                }
                else if (updatedOffice.UserId == default)
                {
                    return Ok("You have now unreserved the office space");
                }
                else if (updatedOffice.UserId != LoggedId)
                {
                    return BadRequest("The office space is already occupied");
                }
            }
            return BadRequest("You are not logged in.");
        }

        [HttpDelete("delete/{id}")]
        public ActionResult<Office> DeleteOffice([FromRoute]int id)
        {
            if (!_loginService.IsAdminLoggedIn())
            {
                return Unauthorized("Only admins can delete offices.");
            }
            if(_officeService.DeleteOffice(id))
            {
                return Ok("office deleted successfully.");
            }
            return BadRequest("Office does not exist");
        }
    }
}