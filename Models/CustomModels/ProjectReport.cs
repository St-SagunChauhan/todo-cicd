namespace ST.ERP.Models.CustomModels
{
	public class ProjectReportNew
	{
		public string? DepartmentName { get; set; }
		public List<ProjectReport> ProjectReports { get; set; }
	}
	public class ProjectReport
    {
        public string? ContractType { get; set; }
        public string? Accounts { get; set; }
        public string? ClientEmail { get; set; }
        public string? ContractName { get; set; }
        public string? HoursPerWeek { get; set; }   
        public string? BillingType { get; set; }
        public string? Country { get; set; }
        public string? DepartmentName { get; set; }  

	}
}
