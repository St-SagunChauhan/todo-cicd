namespace ST.ERP.Models.DTO
{
    public class AssetsFilterRequest
    {
        public Guid? CategoryId { get; set; }
        public DateTime? PurchasedDate { get; set; }
        public DateTime? DataRetrievalDate { get; set; }
        public string? ManufacturerName { get; set; }
        public string AssetStatus { get; set;}
    }
}
