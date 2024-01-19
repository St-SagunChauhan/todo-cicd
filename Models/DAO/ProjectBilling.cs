using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static ST.ERP.Helper.Enums;

namespace ST.ERP.Models.DAO
{
    public class ProjectBilling : EntityBase
    {
        public Guid BillingId { get; set; }
        public Guid? ProjectDepartmentId { get; set; }
        public ProjectDepartment? ProjectDepartments { get; set; }
        public int? HoursBilled { get; set; }
        public int? MinutesBilled { get; set; }
        public Guid? DepartmentId { get; set; }
        public Guid ProjectId { get; set; }
        public decimal? BillableHours { get; set; }

		[ForeignKey("MarketPlaceAccountId")]
        public Guid? MarketPlaceAccountId { get; set; }
        public MarketPlaceAccount? MarketPlaceAccount { get; set; }
        public int? Week { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; }
        public Project? Projects { get; set; }
        public Department? Department { get; set; }
    }

}
