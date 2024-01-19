using ST.ERP.Helper.Impoter_Utilites;

namespace ST.ERP.Models.DTO
{
    public class ImportEmployeeRequest : FormFileUpload
    {

    }
    public class ImporterEmployeeLogsRequest
    {
        public string? EmployeeNumber { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Role { get; set; }
        public string? MobileNo { get; set; }
        public string? Gender { get; set; }
        public string? Address { get; set; }
        public string? JoiningDate { get; set; }
        public string? EmployeeTargetedHours { get; set; }
        public string? CasualLeaves { get; set; }
        public string? SickLeaves { get; set; }
        public string? DepartmentName { get; set; }
    }
}
