namespace ST.ERP.Models.DTO;

public class CreateEODReportRequest
{
    public Guid EodReportId { get; set; }
    public Guid? EmployeeId { get; set; }
    public ProjectHours[] ProjectHours { get; set; }
    public DateTime EODDate { get; set; }
    public string? Remarks { get; set; }
}
public class ProjectHours
{
    public decimal BillingHours { get; set; } 
    public string ProjectId { get; set; }
    public decimal EmployeeDelightHours { get; set; }
}
