namespace ST.ERP.Models.DTO
{
    public class HandoverAssetsRequest
    {
        public Guid? HandoverId { get; set; }
        public Guid[]? AssetIds { get; set; }
        public Guid? EmployeeId { get; set; }
        public DateTime? AssignedDate { get; set; }
        public string? IdentificationNumber { get; set; }
    }
    public class UpdateHandoverAssetRequest
    {
        public Guid? HandoverId { get; set;  }
        public Guid? AssetId { get; set; }
        public Guid? EmployeeId { get; set; }
        public string? IdentificationNumber { get; set; }
        public DateTime? AssignedDate { get; set; }
        public int? Quantity { get; set; }
    }
}
