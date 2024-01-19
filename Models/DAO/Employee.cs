using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static ST.ERP.Helper.Enums;

namespace ST.ERP.Models.DAO
{

    public class Employee : EntityBase
    {
        [Key]
        public Guid EmployeeId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Gender { get; set; }
        public string? Address { get; set; }
        public string? Email { get; set; }
        public string? MobileNo { get; set; }
        public string? EmployeeNumber { get; set; }
        public string? Role { get; set; }
        public string? ProfilePicture { get; set; }
        public DateTime? DOB { get; set; }
        public string? EmergencyNumber { get; set; }
        public int? ShiftType { get; set; }
        public DateTime? JoiningDate { get; set; }
        public DateTime? ResignationDate { get; set; }
        public int? SickLeaves { get; set; }
        public int? CasualLeaves { get; set; }
        public bool IsActive { get; set; }
        [ForeignKey("DepartmentId")]
        public Guid? DepartmentId { get; set; }
        public Guid? AssignedTo { get; set; }
        public Department? Department { get; set; }
        public int? EmployeeTargetedHours { get; set; }
        public bool? IsInImpersonation { get; set; }

        public virtual ICollection<EmployeeProject>? EmployeeProjects { get; set; }
        public virtual ICollection<HandoverAsset>? HandoverAssets { get; set; }
    }
}
