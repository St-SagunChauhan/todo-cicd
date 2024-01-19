using ST.ERP.Models.DAO;

namespace ST.ERP.Models.DTO
{
	public class ClientResponse : BaseResponse
	{
		public Client? Client { get; set; }
	}

	public class ClientResponseData
	{
		public Guid ClientId { get; set; }
		public string? ClientName { get; set; }
		public string? ContactNo { get; set; }
		public string? Country { get; set; }
		public string? ClientEmail { get; set; }
		public bool? IsActive { get; set; }
        public string? Accounts { get; set; }
		public Guid? MarketPlaceAccountId { get; set; }
		public string? MarketplaceName { get; set; }
        public string? LastFollowUpRemark {  get; set; }
        public DateTime? LastFollowUpDate { get; set; }
    }
}
