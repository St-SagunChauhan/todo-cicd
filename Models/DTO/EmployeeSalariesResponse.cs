using ST.ERP.Models.DAO;

namespace ST.ERP.Models.DTO
{

	public class EmployeeSalariesResponse : BaseResponse
	{
		public EmployeeSalary? EmployeeSalaries { get; set; }
	}

	public class EmployeeSalaryResponse
	{
		public Guid SalaryId { get; set; }
		public Guid? EmployeeId { get; set; }
		public string? FirstName { get; set; }
		public string? LastName { get; set; }
		public string? DepartmentName { get; set; }
		public string? EmployeeNumber { get; set; }
		public string? AccountNumber { get; set; }
		public string? IfscCode { get; set; }
		public string? BankName { get; set; }
		public decimal? BasicSalary { get; set; }
		public decimal? Bonus { get; set; }
		public decimal DA { get; set; }
		public decimal? HRA { get; set; }
		public decimal LearningAllowance { get; set; }
		public decimal UniformAllowance { get; set; }
		public decimal? ConveyanceAllowance { get; set; }
		public decimal? ProjectLevelBonus { get; set; }
		public string? GrossSalary { get; set; }
		public string? EPFApplicable { get; set; }
		public string? ESIApplicable { get; set; }
        public Guid? DepartmentId { get; set; }
        public string? UANNo { get; set; }
		public string? ESINo { get; set; }
	}
}
