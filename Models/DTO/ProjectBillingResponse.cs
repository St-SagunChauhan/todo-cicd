using ST.ERP.Models.DAO;

namespace ST.ERP.Models.DTO
{
	public class ProjectBillingResponse : BaseResponse
	{
		public ProjectBilling? ProjectBilling { get; set; }
	}

	public class ProjectBillingResponseData
	{
		public Guid BillingId { get; set; }
		public int? HoursBilled { get; set; }
		public int? MinutesBilled { get; set; }
		public string? Week { get; set; }
		public DateTime? StartDate { get; set; }
		public DateTime? EndDate { get; set; }
		public Guid? MarketPlaceAccountId { get; set; }
		public string? MarketPlaceName { get; set; }
		public Guid? ProjectDepartmentId { get; set; }
		public Guid? ProjectId { get; set; }
		public string? ProjectName { get; set; }
		public string? BillingType { get; set; }
		public string? BillableHours { get; set; }
		public Guid? DepartmentId { get; set; }
		public string? DepartmentName { get; set; }
		public bool IsActive { get; set; }
		public ProjectDepartment? ProjectDepartments { get; set; }
	}
}
