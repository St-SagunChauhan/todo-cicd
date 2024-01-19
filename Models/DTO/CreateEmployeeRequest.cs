namespace ST.ERP.Models.DTO
{
    public class CreateEmployeeRequest
    {
        public Guid EmployeeId { get; set; }
        //public string? Password { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Address { get; set; }
        public string? Gender { get; set; }
        public string? Email { get; set; }
        public string? MobileNo { get; set; }
        public string? Role { get; set; }
        public string? ProfilePicture { get; set; }
        public DateTime? DOB { get; set; }
        public string? EmergencyNumber { get; set; }
        public string? shiftType { get; set; }
        public string? EmployeeNumber { get; set; }
        public DateTime? JoiningDate { get; set; }
        public DateTime? ResignationDate { get; set; }
        public int? SickLeaves { get; set; }
        public int? CasualLeaves { get; set; }
        public bool IsActive { get; set; }
        public Guid? DepartmentId { get; set; }
        public Guid? AssignedTo { get; set; }
        public string? DepartmentName { get; set; }
        public decimal? HourBilled { get; set; }
        public Guid? ProjectId { get; set; }
        public int? EmployeeTargetedHours { get; set; }  
    }
}
