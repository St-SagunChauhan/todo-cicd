using AutoMapper.Configuration.Annotations;
using ST.ERP.Models.DTO;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ST.ERP.Models.DAO
{
    public class ProjectsHistory: EntityBase
    {
        [Key]
        public Guid ProjectHistoryId { get; set; }
        public Guid? Id { get; set; }
        public int? Accounts { get; set; }
        public Guid? ClientId { get; set; }
        [SourceMember(nameof(BidRequest.ProjectName))]
        public string? ContractName { get; set; }
        [SourceMember(nameof(BidRequest.ContracType))]
        public int? ContractType { get; set; }
        [SourceMember(nameof(BidRequest.WeeklyHours))]
        public string? HoursPerWeek { get; set; }
        public string? ProjectReview { get; set; }
        public string? ProjectUrl { get; set; }
        public decimal? Rating { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? BillingType { get; set; }
        public int? BillingStatus { get; set; }
        public bool IsActive { get; set; }
        public int? Status { get; set; }
        [SourceMember(nameof(BidRequest.UpworkId))]
        public Guid? UpworkId { get; set; }
        public string? Country { get; set; }
        public string? CommunicationMode { get; set; }
        public string? Reason { get; set; }
        public Guid? BidId { get; set; }
        public string? EmployeeId { get; set; }

    }

}
