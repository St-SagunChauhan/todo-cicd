using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ST.ERP.Models.DAO
{
    public class LeaveHistory : EntityBase
    {
        [Key]
        public Guid LeaveHistoryId { get; set; }
        public int CasualLeave { get; set; }
        public int SickLeave { get; set; }
        public int HalfDayLeave { get; set; }
        public int ShortLeave { get; set; }
        public Guid? EmployeeId { get; set; }
        [ForeignKey("LeaveId")]
        public Guid? LeaveId { get; set; }
        public Leave? Leaves { get; set; }
    }
}
