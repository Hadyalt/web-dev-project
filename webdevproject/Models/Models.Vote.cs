namespace StarterKit.Models
{    
    public class VotingOption
    {
        public int Id { get; set; }
        public string EventDetails { get; set; } // Details about the event
        public DateTime StartTime { get; set; } // When voting starts
        public DateTime EndTime { get; set; }   // When voting ends
        public int VoteCount { get; set; }      // Number of votes for the option
    }

    public class Vote
    {
        public int Id { get; set; }
        public int VotingOptionId { get; set; } // The event that is being voted for
        public int UserId { get; set; }      // The user who voted
    }
}