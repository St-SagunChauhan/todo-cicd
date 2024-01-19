using ST.ERP.Models.DAO;

namespace ST.ERP.Models.DTO
{
    public class HandoverAssetResponse:BaseResponse
    {
        public HandoverAsset? HandoverAssets { get; set; }
    }
    public class HandoverAssetResponseData
    {
        public Guid HandoverId { get; set; }
        public Guid? AssetId { get; set; }
        public Guid? EmployeeId { get; set; }
        public DateTime? AssignedDate { get; set; }
        public int Quantity { get; set; }
        public string HandoverStatus { get; set; }
        public string Remarks { get; set; }
        public string AssetName { get; set; }
        public string AssignedTo { get; set; }
        public int? InStockAsset { get; set; }
        public string? IdentificationNumber { get; set; }
    }
}
