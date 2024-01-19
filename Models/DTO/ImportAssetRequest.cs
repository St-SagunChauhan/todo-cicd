using ST.ERP.Helper.Impoter_Utilites;

namespace ST.ERP.Models.DTO
{
    public class ImportAssetRequest: FormFileUpload
    {
    }
    public class ImporterAssetLogsRequest
    {
        public string? AssetName { get; set; }
        public string? Quantity { get; set; }
        public string? ManufacturerName { get; set; }
        public string? ModelNumber { get; set; }
        public string? Remarks { get; set; }
    }
}
