using System.ComponentModel.DataAnnotations.Schema;
using static ST.ERP.Helper.Enums;

namespace ST.ERP.Models.DAO
{
    [Table("Leaves")]
    public class Leave : EntityBase
    {
        public Guid Id { get; set; }
        public Guid? EmployeeId { get; set; }
        public int? LeaveType { get; set; }
        public int? Status { get; set; }
        public DateTime? StartDate { get; set; }
		public DateTime? EndDate { get; set; }
		public string? Reason { get; set; }
        public Employee? Employee { get; set; }
        public bool IsActive { get; set; }
        public virtual ICollection<LeaveHistory>? LeaveHistories { get; set; }
    }
}
    