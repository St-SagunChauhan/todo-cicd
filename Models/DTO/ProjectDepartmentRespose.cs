using ST.ERP.Models.DAO;
using System.ComponentModel.DataAnnotations.Schema;

namespace ST.ERP.Models.DTO
{
    public class ProjectDepartmentRespose
    {
        public Guid Id { get; set; }
        public Guid? DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public Guid? ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public bool IsActive { get; set; }
    }
}
