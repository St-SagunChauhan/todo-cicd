namespace ST.ERP.Models.DTO
{
    public class ClientRequest
    {
        public Guid ClientId { get; set; }
        public string? ClientName { get; set; }
        public string? ContactNo { get; set; }
        public string? Country { get; set; }
        public string? Accounts { get; set; }
        public string? ClientEmail { get; set; }
        public bool? IsActive { get; set; }
        public Guid? MarketPlaceAccountId { get; set; }
        public string? LastFollowUpRemark {  get; set; }
        public DateTime? LastFollowUpDate { get; set; }
    }    
}
