using ST.ERP.Helper.Impoter_Utilites;

namespace ST.ERP.Models.DTO
{

    public class ProjectBillingFiles: FormFileUpload
    {

    }

    public class ProjectBillingDataResponse
    {
        public string? ContractName { get; set; }
        public int BillableHours { get; set; }
        public int BilledHours { get; set; }
        public int BilledMinutes { get; set; }
        public string? DepartmentName { get; set; }
        public string? MarketPlaceName { get; set; }
        public string? StartDate { get; set; }
        public string? EndDate { get; set; }

    }


    public class ProjectBillingDataRequest
    {
        public Guid BillingId { get; set; }
        public decimal? billableHours { get; set; }
        public int? MinutesBilled { get; set; }
        public int? HoursBilled { get; set; }
        public Guid? ProjectId { get; set; }
        public Guid? DepartmentId { get; set; }
		public Guid? MarketPlaceAccountId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; }
    }
}
