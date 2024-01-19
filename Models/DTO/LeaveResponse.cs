using ST.ERP.Models.DAO;

namespace ST.ERP.Models.DTO
{
	public class LeaveResponse : BaseResponse
	{
		public Leave? Data { get; set; }
		public LeaveResponseData? LeaveModel { get; set; }
	}

	public class LeaveResponseData
	{
		public Guid Id { get; set; }
		public DateTime? StartDate { get; set; }
		public DateTime? EndDate { get; set; }
		public Guid? EmployeeId { get; set; }
		public Guid? DepartmentId { get; set; }
        public string? FirstName { get; set; }
		public string? LastName { get; set; }
		public string? EmployeeNumber { get; set; }
		public string? DepartmentName { get; set; }
		public string? LeaveType { get; set; }
		public string? Status { get; set; }
		public string? Reason { get; set; }
    }
}
