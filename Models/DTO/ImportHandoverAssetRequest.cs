using ST.ERP.Helper.Impoter_Utilites;

namespace ST.ERP.Models.DTO
{
    public class ImportHandoverAssetRequest : FormFileUpload
    {
    }
    public class ImporterHandoverAssetLogsRequest
    {
        public string? AssetName { get; set; }
        public string? Quantity { get; set; }
        public string? AssignedTo { get; set; }
        public string? InStock { get; set; }
        public string? HandoverStatus { get; set; }
        public string? AssignedDate { get; set; }
        public string? IdentificationNumber { get; set; }
    }
}
