namespace ST.ERP.Models.DTO
{
	public class MasterBillingReportResponse
	{
		public string? DepartmentName { get; set; }
		public decimal? OverallDepartmentBilling { get; set; }
		public decimal? Overallcapacity { get; set; }
		public decimal? OverallTragetedBilling { get; set; }
		public DateTime? StartDate { get; set; }
		public DateTime? CurrentDate { get; set; }
	}
}
