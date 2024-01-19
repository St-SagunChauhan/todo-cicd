using AutoMapper.Configuration.Annotations;
using OfficeOpenXml.Style;
using ST.ERP.Models.DAO;

namespace ST.ERP.Models.DTO
{
    public class BidRequest
    {
        public Guid BidId { get; set; }
        public Guid? EmployeeId { get; set; }
        public string ProjectName { get; set; }
        public string UpworkId { get; set; }
        public int AccountTypes { get; set; }
        public string JobUrl { get; set; }
        public string Jobdescription { get; set; }
        public string Connects { get; set; }
        public string? ProjectUrl { get; set; }
        public string? ClientName { get; set; }
        public string CountryName { get; set; }
        public string? Email { get; set; }
        public string? Mobile { get; set; }
        public Guid? DepartmentId { get; set; }
        public int? ContracType { get; set; }
        public string? WeeklyHours { get; set; }
        public int Status { get; set; }
        public DateTime? StartDate { get; set; }
        public bool? IsActive { get; set; }
        public int? BillingType { get; set; }
        public int? BillingStatus { get; set; }
        public string? CommunicationMode { get; set; }

    }
}
