using ST.ERP.Models.DAO;

namespace ST.ERP.Models.DTO
{

	public class WeeklyBillingReportResponse
	{
		public string? DepartmentName { get; set; }
		public int? TotalHoursBilled { get; set; }
		public int? TotalMinutesBilled { get; set; }
		public decimal? WeeklyBillingHours { get; set; }
		public string? TotalTragetedHours { get; set; }
		public double? TotalWeeklyCapacity { get; set; }
		public double? DeptWeeklyCapacity { get; set; }
		public double? SupremelWeeklyCapacity { get; set; }
		public List<Guid?> DepartmentId { get; set; }
        public Guid? ProjectId { get; set; }
        public DateTime? EndDate { get; set; }
		public DateTime? StartDate { get; set; }
        public string? ProjectName { get; set; }
        public string? UpworkId { get; set; }
        public string? ClientName { get; set; }
        public double? TargetedHours { get; set; }
        public double? BilledHours { get; set; }
        public ProjectBilling? ProjectBilling { get; set; }
        public string? Account { get; set; }
        public string? BillingType { get; set; }
        public List<WeeklyBillingSubReportResponse> BillingSubReports { get; set; }
	}

	public class WeeklyBillingSubReportResponse
	{
		public Guid? BillingId { get; set; }
		public Guid? ProjectDepartmentId { get; set; }
		public string? ProjectName { get; set; }
		public string? ClientName { get; set; }
		public string? BillingType { get; set; }
		public string? Accounts { get; set; }
		public string? UpworkId { get; set; }
		public string? Week { get; set; }
		public decimal? BillableHours { get; set; }
        public Guid? DepartmentId { get; set; }
        public string? HourBilled { get; set; }
		public string? DepartmentName { get; set; }
		public DateTime? StartDate { get; set; }
		public DateTime? EndDate { get; set; }
	}
}
