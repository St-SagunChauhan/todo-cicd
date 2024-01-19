using ST.ERP.Models.DAO;
using System.Text.Json.Serialization;

namespace ST.ERP.Models.DTO
{
	public class EmployeeResponse : BaseResponse
	{
		[JsonPropertyName("api_token")]
		public string? Token { get; set; }
		public Employee? User { get; set; }
        public EmployeeResponseData EmployeeModel { get; set; }
	}

	public class EmployeeResponseData
	{
		public Guid EmployeeId { get; set; }
		public string? FirstName { get; set; }
		public string? LastName { get; set; }
		public string? Gender { get; set; }
		public string? Address { get; set; }
		public string? Email { get; set; }
		public string? MobileNo { get; set; }
		public string? EmployeeNumber { get; set; }
		public string? Role { get; set; }
		public string? ProfilePicture { get; set; }
		public string? ShiftType { get; set; }
		public string? EmergencyNumber { get; set; }
		public DateTime? DOB { get; set; }
		public DateTime? JoiningDate { get; set; }
		public DateTime? ResignationDate { get; set; }
		public Guid? AssignedTo { get; set; }
		public int? SickLeaves { get; set; }
		public int? CasualLeaves { get; set; }
		public bool IsActive { get; set; }
		public Guid? DepartmentId { get; set; }
		public string? DepartmentName { get; set; }
		public int? EmployeeTargetedHours { get; set; }
		public bool? IsImpersonated { get; set; }
	}
}
