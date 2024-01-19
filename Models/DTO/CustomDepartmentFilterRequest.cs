namespace ST.ERP.Models.DTO
{
    public class CustomDepartmentFilterRequest
    {
        public Guid? DepartmentId { get; set; }
        public DateTime? startDate { get; set; }
        public string? ContractStatus { get; set; }
        public bool? IsActive { get; set; }
        public string? ContractType { get; set; }
        public DateTime? RecordDate { get; set; }
        public string? Country {  get; set; }
        public DateTime? endDate { get; set; }
        public Guid? EmployeeId {  get; set; }
        public int? JobStatus {  get; set; }
    }
}
