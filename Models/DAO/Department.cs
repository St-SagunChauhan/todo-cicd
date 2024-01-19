using System.ComponentModel.DataAnnotations;

namespace ST.ERP.Models.DAO
{
    public class Department
    {
        [Key]
        public Guid DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public virtual ICollection<Employee>? Employees { get; set; }
        public virtual ICollection<ProjectDepartment>? ProjectDepartments { get; set; }
        public virtual ICollection<Project>? Projects { get; set; }
        public bool IsActive { get; set; }
    }
}
