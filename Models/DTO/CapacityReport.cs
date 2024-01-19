namespace ST.ERP.Models.DTO
{
    //No Longer Used
    public class CapacityReport
    {
        public Guid? DepartmentId { get; set; }
        public DateTime? StartDate { get; set; }
        public string? Week { get; set; }
        public DateTime? EndDate { get; set; }
    }
    public class CapacityReportResponse
    {
        public string? DepartmentName { get; set; }
        public decimal? TotalBilledHours { get; set; }
        public decimal? TotalBillingHours { get; set; }
        public string? Week { get; set; }
        public DateTime? BillingDate { get; set; }
        public decimal? Capacity { get; set; }

    }
}
