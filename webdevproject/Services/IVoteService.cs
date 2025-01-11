namespace StarterKit.Services;
using StarterKit.Models;
public interface IVoteService{
        VotingOption CreateVotingOption(VotingOption option);

        List<VotingOption> GetVotingOptions();
        List<VotingOption> GetAllVotes(); 
        bool VoteForEvent(int optionId, int userId);
        List<VotingOption> GetVotingResults();
        bool UpdateVotingOption(int id, VotingOption updatedOption);
        bool DeleteVotingOption(int id);
}