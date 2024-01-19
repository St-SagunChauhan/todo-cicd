using ST.ERP.Models.DAO;
using System.Text.Json.Serialization;

namespace ST.ERP.Models.DTO
{
    public class AssetsResponse:BaseResponse
    {
        public Assets? Assets { get; set; }
    }
    public class AssetsResponseData
    {
        public Guid AssetId { get; set; }
        public string AssetName { get; set; }
        public string? ManufacturerName { get; set; }
        public DateTime? PurchasedDate { get; set; }
        public int? Quantity { get; set; }
        public string? ModelNumber { get; set; }
        public Guid? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public string? Remarks { get; set; }
    }
}
