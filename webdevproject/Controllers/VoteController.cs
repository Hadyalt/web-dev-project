using Microsoft.AspNetCore.Mvc;
using StarterKit.Services;
using StarterKit.Models;
using StarterKit.Utils;
using System.Collections.Generic;
using System.Runtime.CompilerServices;

namespace StarterKit.Controllers
{
    [Route("api/v1/vote")]
    [ApiController]
    public class VoteController : ControllerBase
    {
        private readonly IVoteService _votingService;
        
        private readonly ILoginService _loginService;

        public VoteController(IVoteService votingService, ILoginService loginService)
        {
            _votingService = votingService;
            _loginService = loginService;    
        }

        // 1.1 Create Voting Option (Admin Required)
        [HttpPost("options")]
        public IActionResult CreateVotingOption([FromBody] VotingOption option)
        {
            if (!_loginService.IsAdminLoggedIn())
            {
                return Unauthorized("Only admins can create voting option.");
            }
            if (option == null) return BadRequest("Invalid voting option");
            var createdOption = _votingService.CreateVotingOption(option);
            return Ok(createdOption);
        }

        // 1.2 Read Voting Options (Public)
        [HttpGet("options")]
        public IActionResult GetVotingOptions()
        {
            var options = _votingService.GetVotingOptions();
            return Ok(options);
        }

        [HttpGet("options/{voteId}")]
        public IActionResult GetVoteById([FromRoute] int voteId)
        {
            var options = _votingService.GetAllVotes();
            var option = options.Where(v => v.Id == voteId);
            return Ok(option);
        }

        // 1.3 Vote for an Event (Public)
        [HttpPost("vote")]
        public IActionResult VoteForEvent([FromBody] VoteRequest voteRequest)
        {
            var success = _votingService.VoteForEvent(voteRequest.VotingOptionId, voteRequest.UserId);
            if (success)
                return Ok("Vote successfully cast");
            return BadRequest("Failed to cast vote");
        }

        // 1.4 Get Current Voting Results (Public)
        [HttpGet("results")]
        public IActionResult GetVotingResults()
        {
            var results = _votingService.GetVotingResults();
            return Ok(results);
        }

        // 1.5 Update Voting Option (Admin Required)
        [HttpPut("options/update/{id}")]
        public IActionResult UpdateVotingOption([FromRoute]int id, [FromBody] VotingOption option)
        {
            if (!_loginService.IsAdminLoggedIn())
            {
                return Unauthorized("Only admins can update voting option.");
            }
            
            var success = _votingService.UpdateVotingOption(id, option);
            if (success)
                return Ok("Voting option updated successfully");
            return NotFound("Voting option not found");
        }

        // 1.6 Delete Voting Option (Admin Required)
        [HttpDelete("options/delete/{id}")]
        public IActionResult DeleteVotingOption([FromRoute]int id)
        {
            if (!_loginService.IsAdminLoggedIn())
            {
                return Unauthorized("Only admins can delete voting option.");
            }
            var success = _votingService.DeleteVotingOption(id);
            if (success)
                return Ok("Voting option deleted successfully");
            return NotFound("Voting option not found");
        }
    }

    // This class represents the body of the vote request
    public class VoteRequest
    {
        public int VotingOptionId { get; set; } // The event that is being voted for
        public int UserId { get; set; }  
    }
}