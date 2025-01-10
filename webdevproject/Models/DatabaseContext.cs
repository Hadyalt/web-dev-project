using Microsoft.EntityFrameworkCore;
using StarterKit.Utils;

namespace StarterKit.Models
{
    public class DatabaseContext : DbContext
    {
        // The admin table will be used in both cases
        public DbSet<Admin> Admin { get; set; }

        // You can comment out or remove the case you are not going to use.

    
        // Tables for the event calendar case

        public DbSet<User> User { get; set; }
        public DbSet<Attendance> Attendance { get; set; }
        public DbSet<Event_Attendance> Event_Attendance { get; set; }
        public DbSet<Event> Event { get; set; }
        public DbSet<Office> Office { get; set; }
        
        public DbSet<VotingOption> VotingOption { get; set; }
        public DbSet<Vote> Vote { get; set; }
        public DbSet<Office_attendance> Office_Attendance { get; set; }

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<VotingOption>()
                .HasIndex(p => p.Id).IsUnique();
            modelBuilder.Entity<VotingOption>()
                .HasData(new VotingOption { Id = 1, EventDetails = "Event 1", StartTime = new DateTime(2022, 1, 1), EndTime = new DateTime(2022, 1, 2), VoteCount = 0 });
            modelBuilder.Entity<Vote>()
                .HasIndex(p => p.Id).IsUnique();
            modelBuilder.Entity<Vote>()
                .HasData(new Vote { Id = 1, VotingOptionId = 1, UserId = 1 });
            modelBuilder.Entity<Office>()
                .HasIndex(p => p.OfficeId).IsUnique();
            modelBuilder.Entity<Office>()
                .HasData(new Office { OfficeId = 1, Date = new DateOnly(2022, 1, 1), StartTime =new TimeSpan(10, 0, 0), EndTime = new TimeSpan(11, 0, 0), IsOccupied = false, UserId = 0});
            
            modelBuilder.Entity<Event>()
                .HasIndex(p => p.EventId).IsUnique();

             modelBuilder.Entity<Event>()
                .HasData(new Event { EventId = 1, Title = "Event 1", Description = "Description of event 1", EventDate = new DateOnly(2022, 1, 1), StartTime = new TimeSpan(10, 0, 0), EndTime = new TimeSpan(12, 0, 0), Location = "Location 1", AdminApproval = true, Event_Attendances = null });
            modelBuilder.Entity<Event>()
                .HasData(new Event { EventId = 2, Title = "Event 2", Description = "Description of event 2", EventDate = new DateOnly(2023, 1, 1), StartTime = new TimeSpan(11, 0, 0), EndTime = new TimeSpan(13, 0, 0), Location = "Location 2", AdminApproval = true, Event_Attendances = null });

            modelBuilder.Entity<User>()
                .HasIndex(p => p.UserId).IsUnique();
             modelBuilder.Entity<User>()
                .HasData(new User { UserId = 1,UserName ="hady" ,UserRole = "user", FirstName = "User 1", LastName = "User 1", Email = "10@gmail.com",  Password = EncryptionHelper.EncryptPassword("password"), Event_Attendances = null, Attendances = null, RecuringDays = "mo,tu,we,th,fr" });
            
            modelBuilder.Entity<Attendance>()
                .HasIndex(p => p.AttendanceId).IsUnique();
             modelBuilder.Entity<Attendance>()
                .HasData(new Attendance { AttendanceId = 1, AttendanceDate = new DateTime(2022, 1, 1), UserId = 1 });

            modelBuilder.Entity<Event_Attendance>()
                .HasIndex(p => p.Event_AttendanceId).IsUnique();
             modelBuilder.Entity<Event_Attendance>()
                .HasData(new Event_Attendance { Event_AttendanceId = 1, Rating = 5, Feedback = "Feedback 1", UserId = 1, EventId = 1 });
            
            modelBuilder.Entity<Admin>()
                .HasIndex(p => p.UserName).IsUnique();

            modelBuilder.Entity<Admin>()
                .HasData(new Admin { AdminId = 1, Email = "admin1@example.com", UserName = "admin1", Password = EncryptionHelper.EncryptPassword("password"), UserRole = "admin" });
            modelBuilder.Entity<Admin>()
                .HasData(new Admin { AdminId = 2, Email = "admin2@example.com", UserName = "admin2", Password = EncryptionHelper.EncryptPassword("tooeasytooguess"), UserRole = "admin" });
            modelBuilder.Entity<Admin>()
                .HasData(new Admin { AdminId = 3, Email = "admin3@example.com", UserName = "admin3", Password = EncryptionHelper.EncryptPassword("helloworld"), UserRole = "admin" });
            modelBuilder.Entity<Admin>()                
                .HasData(new Admin { AdminId = 4, Email = "admin4@example.com", UserName = "admin4", Password = EncryptionHelper.EncryptPassword("Welcome123"), UserRole = "admin" });
            modelBuilder.Entity<Admin>()
                .HasData(new Admin { AdminId = 5, Email = "admin5@example.com", UserName = "admin5", Password = EncryptionHelper.EncryptPassword("Whatisapassword?"), UserRole = "admin" });
        }
        

    }

}