using ST.ERP.Models.DAO;
using System.ComponentModel.DataAnnotations.Schema;

namespace ST.ERP.Models.DTO
{
    public class EmployeeProjectResponse
    {
        public Guid EmpProjectId { get; set; }
        public Guid? EmployeeId { get; set; }
        public Guid? ProjectId { get; set; }
        public decimal? BillingHour { get; set; }
        public decimal? UnBillingHour { get; set; }
        public string? EmployeeName { get; set; }
        public string? ProjectName { get; set; }
        public bool IsActive { get; set; }
    }
}
