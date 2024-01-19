using ST.ERP.Models.DAO;

namespace ST.ERP.Models.DTO
{
    public class MarketPlaceAccountsRequest : EntityBase
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public int? Accounts { get; set; }
        public bool? IsActive { get; set; }
        public int? MarketPlaceAccountsStatus { get; set; }
        public string? Technology { get; set; }
        public string? Remarks { get; set; }
        public string? Earning { get; set; }
        public string? JobSuccessRate { get; set; }

    }
}
