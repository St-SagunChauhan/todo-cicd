namespace ST.ERP.Models.DTO
{
	public class BillingReportRequest
	{
		public Guid? DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
		public DateTime? EndDate { get; set; }
        public DateTime? StartDate { get; set; }
		public string? Week { get; set; }
	}
}
