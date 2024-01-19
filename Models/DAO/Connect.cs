using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static ST.ERP.Helper.Enums;

namespace ST.ERP.Models.DAO
{
    public class Connect : EntityBase
    {
        [Key]
        public Guid ConnectId { get; set; }
        [ForeignKey("EmployeeId")]
        public Guid? EmployeeId { get; set; }

        [ForeignKey("DepartmentId")]
        public Guid? DepartmentId { get; set; }
        [ForeignKey("MarketPlaceAccountId")]
        public Guid? MarketPlaceAccountId { get; set; }
		public int? ConnectUsed { get; set; }
        public DateTime? Connect_Date { get; set; }
        public Employee? Employees { get; set; }
        public Department? Department { get; set; }
        public MarketPlaceAccount? MarketPlaceAccount { get; set; }
        public int? ConnectStatus { get; set; }
		public string? JobUrl { get; set; }
        public int? DealsWon { get; set; }
        public int? MarketingQualifiedLeads { get; set; }
        public int? SalesQualifiedLeads { get; set; }
        public string? Technology { get; set; }
        public bool IsActive { get; set; }
    }
}
