using StarterKit.Models;
using Microsoft.Data.Sqlite;
using StarterKit.Utils;
using System.Data.SQLite;
using System.Net.WebSockets;

namespace StarterKit.Services;

    public class OfficeService : IOfficeService
    {
        public readonly ILoginService _loginService;
        private readonly DatabaseContext _context;

        private string _connectionString  = "Data Source=webdevproject.db";

        public OfficeService(DatabaseContext context, ILoginService loginService)
        {
            _context = context;
            _loginService = loginService;
        }

        public List<Office> GetAllOffices()
        {
            var offices = new List<Office>();

            using (var connection = new SqliteConnection(_connectionString))
            {
                connection.Open();

                var query = "SELECT * FROM Office"; 
                using (var command = new SqliteCommand(query, connection))
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var officeItem = new Office
                            {
                                OfficeId = reader.GetInt32(0),
                                Date = DateOnly.FromDateTime(reader.GetDateTime(1)),
                                StartTime = reader.GetTimeSpan(2),
                                EndTime = reader.GetTimeSpan(3),
                                IsOccupied = reader.GetBoolean(4)
                            };
                            offices.Add(officeItem);
                        }
                    }
                }
            }

            return offices;
        }
        public Office GetOffice(int officeId)
        {
            var allOffices = GetAllOffices();
            Office singleOffice = allOffices.FirstOrDefault(evnt => evnt.OfficeId == officeId);
            return singleOffice;
        }

        public void CreateOffice(Office newOffice)
        {
            
            var Office = new Office
            {
                Date = newOffice.Date,
                StartTime = newOffice.StartTime,
                EndTime = newOffice.EndTime,
                IsOccupied = newOffice.IsOccupied,
                UserId = default
            };

            _context.Office.Add(Office);
            _context.SaveChanges();

        }
        public Office UpdateOffice(Office OfficeToUpdate)
        {
            var grabbedOffice = _context.Office.FirstOrDefault(_ => _.OfficeId == OfficeToUpdate.OfficeId);
            var userId = _loginService.GetLoggedInUserId();
            if(grabbedOffice is not null && grabbedOffice.IsOccupied == false)
            {
                grabbedOffice.Date = OfficeToUpdate.Date;
                grabbedOffice.StartTime = OfficeToUpdate.StartTime;
                grabbedOffice.EndTime = OfficeToUpdate.EndTime;
                grabbedOffice.IsOccupied = OfficeToUpdate.IsOccupied;
                grabbedOffice.UserId = userId;
                
                _context.SaveChanges();
            }
            else if(grabbedOffice is not null && grabbedOffice.UserId == userId)
            {
                grabbedOffice.Date = default;
                grabbedOffice.StartTime = default;
                grabbedOffice.EndTime = default;
                grabbedOffice.IsOccupied = false;
                grabbedOffice.UserId = default;

                _context.SaveChanges();
            }
            return grabbedOffice;
        }
        public bool DeleteOffice(int officeId)
        {
            var office = _context.Office.Find(officeId);
            if (office is null)
            {
                return false;
            }
            _context.Office.Remove(office);
            _context.SaveChanges();
            return true;
        }
    }