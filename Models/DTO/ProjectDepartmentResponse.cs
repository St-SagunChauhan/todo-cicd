using ST.ERP.Models.DAO;

namespace ST.ERP.Models.DTO
{
	public class ProjectDepartmentResponse : BaseResponse
	{	
		public ProjectDepartment? ProjectDepartment { get; set; }
	}

	public class ProjectDepartmentReport
	{
		public string? Status { get; set; }
		public List<ProjectDepartmentResponseData>? ProjectDepartments { get; set; }
	}

	public class ProjectDepartmentResponseData
	{
		public Guid ProjectDepId { get; set; }
		public List<Guid?> DepartmentId { get; set; }
		public string? DepartmentName { get; set; }
        public List<Guid?> EmployeeId { get; set; }
		public string? EmployeeName { get; set; }
        public Guid? ClientId { get; set; }
		public string? ClientName { get; set; }
		public string? ClientEmail { get; set; }
		public string? Country { get; set; }
		public Guid? ProjectId { get; set; }
		public string? Accounts { get; set; }
		public string? ContractName { get; set; }
		public string? ContractType { get; set; }
		public string? HoursPerWeek { get; set; }
		public string? BillingType { get; set; }
		public string? Status { get; set; }
		public bool? IsActive { get; set; }
		public DateTime StartDate { get; set; }
		public string? CloseDate { get; set; }
		public string? Communication { get; set; }
		public string? UpWorkId { get; set; }
		public string? ProjectReview { get; set; }
        public string? ProjectUrl { get; set; }
        public decimal? Rating { get; set; }
        public string? Reason {  get; set; }
        public string? ContractStatus { get; set; }
        public int? ProjectHealthRate { get; set; }
        public List<ProjectDepartmentResponseData>? ProjectDepartments { get; set; }
    }
}
