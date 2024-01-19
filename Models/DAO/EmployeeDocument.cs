using System.ComponentModel.DataAnnotations;

namespace ST.ERP.Models.DAO
{
    public class EmployeeDocument : EntityBase
    {
        [Key]
        public Guid EmpDocId { get; set; }
        public string? Name { get; set; }
        public string? Number { get; set; }
        public byte[]? Image { get; set; }
        public Guid EmployeeId { get; set; }
        public Employee? Employee { get; set; }
    }
}
