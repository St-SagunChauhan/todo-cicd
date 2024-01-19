using System.ComponentModel;

namespace ST.ERP.Models.DTO
{
    public class DepartmentRequest
    {
        [DisplayName("Id")]
        public Guid DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public bool? IsActive { get; set; }
    }  
}
