using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ST.ERP.Models.DAO;

public class EmployeeProject : EntityBase
{
    [Key]
    public Guid EmpProjectId { get; set; }
    [ForeignKey("EmployeeId")]
    public Guid? EmployeeId { get; set; }
    [ForeignKey("ProjectId")]
    public Guid? ProjectId { get; set; }
    public decimal? BillingHour { get; set; }
    public decimal? UnBillingHour { get; set; }
    public Employee? Employee { get; set; }
    public Project? Projects { get; set; }
    public bool IsActive { get; set; }    
}
