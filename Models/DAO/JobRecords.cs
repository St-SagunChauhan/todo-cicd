using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ST.ERP.Models.DAO
{
    public class JobRecords : EntityBase
    {
        [Key]
        public Guid BidId { get; set; }
        public string ProjectName { get; set; }
        public Guid UpworkId { get; set; }
        public int AccountTypes { get; set; }
        public string? JobUrl { get; set; }
        public string Jobdescription { get; set; }
        public decimal Connects { get; set; }
        public string? ProjectUrl { get; set; }
        public string? ClientName { get; set; }
        public string CountryName { get; set; }
        public string? Email { get; set; }
        public string? Mobile { get; set; }
        [ForeignKey("DepartmentId")]
        public Guid? DepartmentId { get; set; }
        [ForeignKey("EmployeeId")]
        public Guid? EmployeeId { get; set; }
        public int? ContracType { get; set; }
        public decimal? WeeklyHours { get; set; }
        public int Status { get; set; }
        public DateTime? StartDate { get; set; }
        public bool IsActive { get; set; } = false;
        public int? BillingType { get; set; }
        public int? BillingStatus { get; set; }
        public Department? Department { get; set; }
        public Employee? Employee { get; set; }
        public string? CommunicationMode { get; set; }

    }
}
