namespace ST.ERP.Models.DTO
{
    public class ProjectResponseData
    {
        public Guid Id { get; set; }
        public Guid? ClientId { get; set; }
        public string? ClientName { get; set; }
        public string? ContractName { get; set; }
        public string? ContractType { get; set; }
        public string? HoursPerWeek { get; set; }
        public DateTime? StartDate { get; set; }
        public string? ProjectUrl { get; set; }
        public Guid[]? DepartmentId { get; set; }
        public Guid? EmployeeId { get; set; }
        public Guid? UpworkId { get; set; }
        public string? UpworkName { get; set; }
        public string? Country { get; set; }
        public string? CommunicationMode { get; set; }
        public string? BillingStatus { get; set; }
        public string? Reason { get; set; }
        public int? ProjectHealthRate { get; set; }
        public string? Issue { get; set; }
        public string? Solution { get; set; }
        public string? Remarks { get; set; }
    }

    public class ProjectResponse : BaseResponse
    {
        public ProjectResponseData? Project { get; set; }
    }

    public class CurrentProjectMembersResponse
    {
        public Guid? ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public List<EmployeeResponseData> EmployeeData { get; set; }
    }
}
