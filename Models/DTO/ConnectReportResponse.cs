namespace ST.ERP.Models.DTO
{
	public class ConnectReportResponse
	{
		public string? DepartmentName { get; set; }
        public Guid? DepartmentId { get; set; }
        public string? StartDate { get; set; }
		public string? EndDate { get; set; }
		public List<ConnectSubReportResponse>? ConnectSubReports { get; set; }
	}

	public class ConnectSubReportResponse
	{
		public string? EmployeeName { get; set; }
		public string? DepartmentName { get; set; }
		public string? UpWorkId { get; set; }
        public Guid? DepartmentId { get; set; }
        public string? JobUrl { get; set; }
		public int? ConnectUsed { get; set; }
		public string? Status { get; set; }
        public DateTime? Connect_Date { get; set; }
        public Guid? connectId { get; set; }
        public int? DealsWon { get; set; }
        public int? MarketingQualifiedLeads { get; set; }
        public int? SalesQualifiedLeads { get; set; }
        public string? Technology { get; set; }
    }
}
