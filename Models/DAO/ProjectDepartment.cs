using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ST.ERP.Models.DAO
{
    public class ProjectDepartment : EntityBase
    {
        [Key]
        public Guid Id { get; set; }

        [ForeignKey("DepartmentId")]
        public Guid? DepartmentId { get; set; } 

        public virtual Department? Department { get; set; }

        [ForeignKey("ProjectId")]
        public Guid? ProjectId { get; set; }

        public virtual Project? Project { get; set; }

        public bool IsActive { get; set; }
        public virtual ICollection<ProjectBilling>? ProjectBillings { get; set; }
    }
}
