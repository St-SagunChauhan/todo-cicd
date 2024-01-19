using ST.ERP.Helper.Impoter_Utilites;

namespace ST.ERP.Models.DAO
{
    public class ImportConnectsHistory : FormFileUpload
    { }

    public class ImportConnectRequest
    {
        public string? ProfileName { get; set; }
        public string? DepartmentName { get; set; }
        public string? UpWorkId { get; set; }
        public string? JobUrl { get; set; }
        public string? ConnectsUsed { get; set; }
        public string? Status { get; set; }
        public string? ConnectDate { get; set; }
        public string? MarketingQualifiedLeads { get; set; }
        public string? SalesQualifiedLeads { get; set; }
        public string? Technology { get; set; }
        public string? DealsWon { get; set; }
    }
}
