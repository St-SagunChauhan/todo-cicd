namespace ST.ERP.Models.DTO
{
	public class DashBoardResponse
	{
		public string? DepartmentName { get; set; } = string.Empty;
		public decimal? TotalWeeklyHours { get; set; } = 0;
		public decimal? TotalBilledHours { get; set; } = 0;
		public decimal? TotalUnbilledHours { get; set; } = 0;
		public decimal? TotalTargetHours { get; set; } = 0;
		public decimal? OverAllCapacity { get; set; } = 0;
		public List<DashBoardEmployeesResponse>? DashBoardEmployees { get; set; }
	}

	public class DashBoardEmployeesResponse
	{
		public string? EmployeeName { get; set; } = string.Empty;
		public string? EmployeeDesignation { get; set; } = string.Empty;
		public decimal? EmployeeTargetedHours { get; set; } = 0 ;
		public decimal? EmployeeBilledHours { get; set; } = 0;
        public decimal? EmployeeBillableHours { get; set; } = 0;
        public decimal? EmployeeUnBilledHours { get; set; } = 0;
    }

}
