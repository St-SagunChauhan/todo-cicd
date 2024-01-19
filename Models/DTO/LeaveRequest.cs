namespace ST.ERP.Models.DTO
{
    public class LeaveRequest
    {
        public Guid Id { get; set; }
        public Guid? EmployeeId { get; set; } 
        public string? LeaveType { get; set; }
        public string? Status { get; set; }
		public string? Reason { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? EmployeeName { get; set; }
        public string? EmployeeNumber { get; set; }
        public Guid? DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public bool? IsActive { get; set; }
    }
}
    