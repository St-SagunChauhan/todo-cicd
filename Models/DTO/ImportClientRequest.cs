using ST.ERP.Helper.Impoter_Utilites;

namespace ST.ERP.Models.DTO
{
    public class ImportClientRequest : FormFileUpload
    {

    }
    public class ImporterClientLogsRequest
    {
        public string? ClientName { get; set; }
        public string? DepartmentName { get; set; }
        public string? MarketPlaceAccountName { get; set; }
        public string? Email { get; set; }
        public string? Communication { get; set; }
        public string? Country { get; set; }
        public string? AccountType { get; set; }
    }
}
