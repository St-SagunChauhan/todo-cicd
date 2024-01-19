using ST.ERP.Models.DAO;
using System.Text.Json.Serialization;

namespace ST.ERP.Models.DTO
{
    public class ConnectRequest
    {
        public Guid ConnectId { get; set; }
        public Guid EmployeeId { get; set; }
        public Guid DepartmentId { get; set; }
        public Guid MarketPlaceAccountId { get; set; }
        public int ConnectUsed { get; set; }
        public DateTime? Connect_Date { get; set; }
        public string? Week { get; set; }
        [JsonPropertyName("BidStatus")]
        public string? ConnectStatus { get; set; }
        public Employee? Employees { get; set; }
        public Department? Department { get; set; }
        public MarketPlaceAccount? MarketPlaceAccount { get; set; }
        public int? DealsWon { get; set; }
        public int? MarketingQualifiedLeads { get; set; }
        public int? SalesQualifiedLeads { get; set; }
        public string? Technology { get; set; }
        public string? JobUrl { get; set; }
    }
}
