using StarterKit.Models;
using StarterKit.Utils;
using System.Data.SQLite;
using System.Net.WebSockets;

namespace StarterKit.Services;

public class VotingService : IVoteService
{
    private readonly DatabaseContext _context;

    public VotingService(DatabaseContext context)
    {
        _context = context;
    }

    // Create a new voting option (Admin required)
    public VotingOption CreateVotingOption(VotingOption option)
    {
        _context.VotingOption.Add(option);
        _context.SaveChanges();
        return option;
    }

    // Read all voting options (Public)
    public List<VotingOption> GetVotingOptions()
    {
        return _context.VotingOption.Where(v => v.EndTime > DateTime.Now).ToList();
    }

    public List<VotingOption> GetAllVotes()
    {
        return _context.VotingOption.ToList();
    }

    // Vote for an event (Public)
    public bool VoteForEvent(int optionId, int userId)
    {
        var votingOption = _context.VotingOption.SingleOrDefault(v => v.Id == optionId);
        if (votingOption != null && votingOption.EndTime > DateTime.Now)
        {
            var vote = new Vote { VotingOptionId = optionId, UserId = userId };
            _context.Vote.Add(vote);
            votingOption.VoteCount += 1;
            _context.SaveChanges();
            return true;
        }
        return false;
    }

    // Get voting results (Public)
    public List<VotingOption> GetVotingResults()
    {
        return _context.VotingOption.ToList();
    }

    // Update a voting option (Admin required)
    public bool UpdateVotingOption(int id, VotingOption updatedOption)
    {
        var option = _context.VotingOption.SingleOrDefault(v => v.Id == id);
        if (option != null)
        {
            option.EventDetails = updatedOption.EventDetails;
            option.StartTime = updatedOption.StartTime;
            option.EndTime = updatedOption.EndTime;
            option.VoteCount = updatedOption.VoteCount;
            _context.SaveChanges();
            return true;
        }
        return false;
    }

    // Delete a voting option (Admin required)
    public bool DeleteVotingOption(int id)
    {
        var option = _context.VotingOption.SingleOrDefault(v => v.Id == id);
        if (option != null)
        {
            _context.VotingOption.Remove(option);
            _context.SaveChanges();
            return true;
        }
        return false;
    }
}