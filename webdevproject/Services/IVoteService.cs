namespace StarterKit.Services;
using StarterKit.Models;
public interface IVoteService{
        // Create a new voting option (Admin required)
        VotingOption CreateVotingOption(VotingOption option);

        // Read all voting options (Public)
        List<VotingOption> GetVotingOptions();

        // Vote for an event (Public)
        bool VoteForEvent(int optionId, int userId);

        // Get current voting results (Public)
        List<VotingOption> GetVotingResults();

        // Update a voting option (Admin required)
        bool UpdateVotingOption(int id, VotingOption updatedOption);

        // Delete a voting option (Admin required)
        bool DeleteVotingOption(int id);
}