namespace ST.ERP.Models.DTO
{
    public class AssetsHandoveredResponse
    {
        public Guid Id { get; set; }
        public Guid? AssetId { get; set; }
        public string? AssetName { get; set; }
        public Guid? HandoverId { get; set; }
        public string? HandoverStatus { get; set; }
    }
}
