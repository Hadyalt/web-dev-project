namespace StarterKit.Models
{    
    public class VotingOption
    {
        public int Id { get; set; }
        public string EventDetails { get; set; } 
        public DateTime StartTime { get; set; } 
        public DateTime EndTime { get; set; }   
        public int VoteCount { get; set; }      
    }

    public class Vote
    {
        public int Id { get; set; }
        public int VotingOptionId { get; set; }
        public int UserId { get; set; }      
    }
}