using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ST.ERP.Models.DAO
{
    public class EODReport : EntityBase
    {
        [Key]
        public Guid EodReportId { get; set; }
        public decimal? UnbilledHours { get; set; }
        [ForeignKey("EmployeeId")]
        public Guid? EmployeeId { get; set; }
        public bool IsActive { get; set; }
        public Employee? Employee { get; set; }
        public string? ProjectHours { get; set; }
        public string? EmployeeHours { get; set; }
        public DateTime EODDate { get; set; }
        public string? Remarks { get; set; }
    }
}
