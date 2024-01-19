using static ST.ERP.Helper.Enums;

namespace ST.ERP.Models.DTO
{
    public class ProjectReportResponse
    {
        public List<ProjectSubReportResponse>? ProjectSubReports { get; set; }
    }
    public class ProjectSubReportResponse
    {
        public string? ContractName { get; set; }
        public int? ContractType { get; set; }
        public decimal? Rating { get; set; }
        public string? HoursPerWeek { get; set; }
        public int? BillingType { get; set; }
        public int? Accounts { get; set; }
        public int? Status { get; set; }
        /*public string? BillingType { get; set; }
        public string? Status { get; set; }
        public string? Accounts { get; set; }*/
        public string? ProjectUrl { get; set; }
        public Guid[]? DepartmentId { get; set; }
        public string[]? DepartmentName { get; set; }

    }
}
