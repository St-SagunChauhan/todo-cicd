namespace ST.ERP.Models.DTO
{
    public class AssetsRequest
    {
        public Guid AssetId { get; set; }
        public Guid? CategoryId { get; set; }
        public string? AssetName { get; set; }
        public string? ManufacturerName { get; set; }
        public DateTime? PurchasedDate { get; set; }
        public int? Quantity { get; set; }
        public string? ModelNumber { get; set; }
        public string? AssetStatus { get; set; }
        public string? Remarks { get; set; }
    }
}
