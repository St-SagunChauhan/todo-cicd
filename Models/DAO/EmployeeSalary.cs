using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ST.ERP.Models.DAO
{
    public class EmployeeSalary : EntityBase
    {
        [Key]
        public Guid SalaryId { get; set; }
        public decimal? BasicSalary { get; set; }
        [ForeignKey("Employees")]
        public Guid? EmployeeId { get; set; }
        public string? AccountNumber { get; set; }
        public string? IfscCode { get; set; }
        public string? BankName { get; set; }
        public decimal? Bonus { get; set; }
        public decimal DA { get; set; }
        public decimal? HRA { get; set; }
        public decimal LearningAllowance { get; set; }
        public decimal UniformAllowance { get; set; }
        public decimal? ConveyanceAllowance { get; set; }
        public decimal? ProjectLevelBonus { get; set; }
        public string? GrossSalary { get; set; }
        public string? EPFApplicable { get; set; }
        public string? ESIApplicable { get; set; }
        public string? UANNo { get; set; }
        public string? ESINo { get; set; }
        public bool IsActive { get; set; }
        public Employee? Employee { get; set; }
    }
}
