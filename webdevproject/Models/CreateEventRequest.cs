namespace StarterKit.Models
{
	public class CreateEventRequest
	{
		public string Title { get; set; }
		public string Description { get; set; }
		public DateOnly Date { get; set; }
		public TimeSpan StartTime { get; set; }
		public TimeSpan EndTime { get; set; }
		public string Location { get; set; }
		public int? ReviewRating { get; set; }
		public string ReviewFeedback { get; set; }
		
		public List<Event_Attendance> Event_Attendances { get; set; }
	}

	public class UpdateEventRequest
	{
		public string? Title { get; set; }
		public string? Description { get; set; }
		public DateOnly? Date { get; set; }
		public TimeSpan? StartTime { get; set; }
		public TimeSpan? EndTime { get; set; }
		public string? Location { get; set; }
	}
}