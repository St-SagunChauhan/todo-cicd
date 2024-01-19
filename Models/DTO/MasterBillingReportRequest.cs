namespace ST.ERP.Models.DTO
{
	public class MasterBillingReportRequest
	{
        public Guid? DepartmentId { get; set; }
        public DateTime? StartDate { get; set; }
		public DateTime? CurrentDate { get; set; }
	}
}
