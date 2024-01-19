namespace ST.ERP.Models.CustomModels
{
    public class HandoverFilterRequest
    {
        public Guid? AssetId { get; set; }
        public Guid? EmployeeId { get; set; }
        public DateTime? AssignedDate { get; set; }
        public DateTime? DataRetreivalDate { get; set; }
        public string? HandoverStatus { get; set; }
    }
}
