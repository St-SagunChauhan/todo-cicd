using System.Text.Json.Serialization;

namespace ST.ERP.Models.DTO
{
	public class ConnectResponse : BaseResponse
	{
		public ConnectResponseData? ConnectModel { get; set; }
	}

	public class ConnectResponseData
	{
		public Guid ConnectId { get; set; }
		public string? Week { get; set; }
		public int ConnectUsed { get; set; }
		public DateTime? Connect_Date { get; set; }
		public Guid EmployeeId { get; set; }
		public string? FirstName { get; set; }
		public string? LastName { get; set; }
		public Guid DepartmentId { get; set; }
		public string? DepartmentName { get; set; }
		public Guid? MarketPlaceAccountId { get; set; }
		public string? MarketPlaceAccountName { get; set; }
		[JsonPropertyName("bidStatus")]
		public string? ConnectStatus { get; set; }
		public string? ProjectReview { get; set; }
		public string? JobUrl { get; set; }
        public int? DealsWon { get; set; }
        public int? MarketingQualifiedLeads { get; set; }
        public int? SalesQualifiedLeads { get; set; }
        public string? Technology { get; set; }
    }
    public class ImporterConnectRequest
    {
        public string? ConnectUsed { get; set; }
        public string? JobUrl { get; set; }
        public string? DepartmentName { get; set; }
        public string? Connect_Date { get; set; }
        public string? ConnectStatus { get; set; }
		public string? DealsWon { get; set; }
		public string? MarketingQualifiedLeads { get; set; }
        public string? SalesQualifiedLeads { get; set; }
		public string? Technology { get; set; }
        public string? MarketPlaceAccountName { get; set; }
        public string? EmployeeName { get; set; }
        public string? EmployeeEmail { get; set; }
    }
}
