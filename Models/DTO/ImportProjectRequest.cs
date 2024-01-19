using ST.ERP.Helper.Impoter_Utilites;

namespace ST.ERP.Models.DTO
{
    public class ImportProjectRequest : FormFileUpload
    {

    }
    public class ImporterProjectLogsRequest
    {
        public string? Accounts { get; set; }
        public string? UpWorkId { get; set; }
        public string? ContractName { get; set; }
        public string? ClientName { get; set; }
        public string? Department { get; set; }
        public string? EmployeeNumber{ get; set; }
        public string? WeeklyHours { get; set; }
        public string? ContractType { get; set; }
        public string? CommunicationMode { get; set; }
        public string? StartDate { get; set; }
        public string? BillingType { get; set; }
        public string? Country { get; set; }
        public string? Status { get; set; }
        public string? EndDate { get; set; }
        public string? ProjectReview { get; set; }
        public string? ProjectUrl { get; set; }
        public decimal? Rating { get; set; }
        public string? BillingStatus { get; set; }
    }
}
