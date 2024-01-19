namespace ST.ERP.Models.DTO
{
    public class MasterReportRequest
    {
        public IFormFile File { get; set; }
        public Guid? DepartmentId { get; set; }
    }

    public class MasterReportResponse : BaseResponse
    {
       
    }
}
