namespace ST.ERP.Models.DTO
{
    public class ConnectReportRequest
    {
        public Guid? DepartmentId { get; set; }
        public DateTime? StartDate { get; set; }
        public string? Week { get; set; }
        public DateTime? EndDate { get; set;}
    }  
}
