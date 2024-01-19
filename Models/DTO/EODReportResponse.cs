using ST.ERP.Models.DAO;

namespace ST.ERP.Models.DTO
{
    public class EODReportResponse : BaseResponse
    {
        public EODReport? EODReport { get; set; }
    }

    public class EODReportResponseData
    {
        public string? DepartmentName { get; set; }
        public List<EODSubReport> EODSubReport { get; set; } 
    }

    public class EODSubReport
    {
        public Guid EodReportId { get; set; }
        public string? EmployeeName { get; set; }
        public Guid? EmployeeId { get; set; }
        public ProjectHoursData[]? ProjectHours { get; set; }
        public DateTime? EODDate { get; set; }
        public string? Remarks {  get; set; }
    }
    public class ProjectHoursData
    {
        public string? ProjectName {  get; set; }
        public string? BillingHours {  get; set; }
        public string? EmployeeDelightHours { get; set; }
        public object RemainingHours {  get; set; }
    }
}
