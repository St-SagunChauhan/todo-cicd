using AutoMapper.Configuration.Annotations;
using ST.ERP.Models.DTO;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ST.ERP.Models.DAO
{
    public class Project : EntityBase
    {
        [Key]
        public Guid Id { get; set; }
        public int Accounts { get; set; }
        [ForeignKey("Clients")]
        public Guid ClientId { get; set; }
        [SourceMember(nameof(BidRequest.ProjectName))]
        public string ContractName { get; set; }
        [SourceMember(nameof(BidRequest.ContracType))]
        public int ContractType { get; set; }
        [SourceMember(nameof(BidRequest.WeeklyHours))]
        public string HoursPerWeek { get; set; }
        public string? ProjectReview { get; set; }
        public string? ProjectUrl { get; set; }
        public decimal? Rating { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int BillingType { get; set; }
        public int? BillingStatus { get; set; }
        public Client? Client { get; set; }
        public bool IsActive { get; set; }
        public int Status { get; set; }
        public virtual ProjectHealth? ProjectHealth { get; set; }
        public virtual ICollection<EmployeeProject>? EmployeeProjects { get; set; }
        public virtual ICollection<ProjectDepartment>? ProjectDepartments { get; set; }
        public virtual ICollection<Department>? Departments { get; set; }
        public virtual ICollection<ProjectBilling>? ProjectBillings { get; set; }

        [SourceMember(nameof(BidRequest.UpworkId))]
        public Guid? UpworkId { get; set; }
        public string? Country { get; set; }
        public string? CommunicationMode { get; set; }
        public string? Reason { get; set; }
        public MarketPlaceAccount? Upworks { get; set; }
        public Project()
        {
            EmployeeProjects = new List<EmployeeProject>();
            ProjectBillings = new List<ProjectBilling>();
            Departments = new List<Department>();
        }
    }
}
