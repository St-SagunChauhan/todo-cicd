namespace ST.ERP.Models.DTO
{
    public class BidRecordResponse : BaseResponse
    {
        public BidResponse? Bids { get; set; }
    }

    public class BidResponse
    {
        public Guid BidId { get; set; }
        public Guid? EmployeeId { get; set; }
        public string ProjectName { get; set; }
        public Guid UpworkId { get; set; }
        public string AccountTypes { get; set; }
        public string JobUrl { get; set; }
        public string Jobdescription { get; set; }
        public string Connects { get; set; }
        public string? ProjectUrl { get; set; }
        public string? ClientName { get; set; }
        public string CountryName { get; set; }
        public string? Email { get; set; }
        public string? Mobile { get; set; }
        public string DepartmentId { get; set; }
        public string? ContracType { get; set; }
        public string? WeeklyHours { get; set; }
        public string Status { get; set; }
        public DateTime? StartDate { get; set; }
        public bool IsActive { get; set; } = false;
        public string? BillingType { get; set; }
        public string? BillingStatus { get; set; }
        public string? CommunicationMode {  get; set; }
    }
    public class BidReportResponse
    {
        public Guid? BidId { get; set; }
        public string? EmployeeName { get; set; }
        public int? TotalLeads { get; set; }
        public int? TotalApplied { get; set; }
        public int? TotalHired { get; set; }
        public decimal? TotalConnectUsed { get; set; }
    }
}
