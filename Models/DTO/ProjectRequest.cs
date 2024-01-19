namespace ST.ERP.Models.DTO
{
    public class ProjectRequest
    {
        public Guid ClientId { get; set; }
        public string ContractName { get; set; }
        public int ContractType { get; set; }
        public decimal HoursPerWeek { get; set; }
        public int BillingType { get; set; }
        public bool IsActive { get; set; }
        public int? Status { get; set; }
        public string? ProjectUrl { get; set; }
        public DateTime StartDate { get; set; }
        public Guid? UpworkId { get; set; }
        public string? CommunicationMode { get; set; }
        public string? Country { get; set; }
        public int? BillingStatus { get; set; }
        public Guid? EmployeeIds { get; set; }
        public int Accounts { get; set; }
        public Guid[]? DepartmentId { get; set; }
    }

    public class EditProjectRequest
    {
        public Guid ProjectId { get; set; }
        public string? ContractName { get; set; }
        public int? ContractType { get; set; }
        public decimal? HoursPerWeek { get; set; }
        public Guid? EmployeeIds { get; set; }
        public bool IsActive { get; set; }
        public int? Status { get; set; }
        public string? ProjectUrl { get; set; }
        public int? BillingStatus { get; set; }
        public string? CommunicationMode { get; set; }
        public Guid[]? DepartmentIds { get; set; }
        public int? ProjectHealthRate { get; set; }
        public string? Issue { get; set; }
        public string? Solution { get; set; }
        public string? Remarks { get; set; }
    }
}
