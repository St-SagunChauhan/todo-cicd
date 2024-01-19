namespace ST.ERP.Models.DTO;

public class CustomFilterRequest
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public Guid? DepartmentId { get; set; }
    public Guid? EmployeeId { get; set; }
    public string? LeaveStatus {  get; set; }
}
