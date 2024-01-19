using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ST.ERP.Models.DAO
{
    public class Client : EntityBase
    {
        [Key]
        public Guid ClientId { get; set; }
        public string ClientName { get; set; }
        public string? ContactNo { get; set; }
        public string Country { get; set; }
        [ForeignKey("MarketPlaceAccountId")]
        public Guid MarketPlaceAccountId { get; set; }
        [ForeignKey("BidId")]
        public Guid BidId { get; set; }
        public DateTimeOffset? TimeZone { get; set; }
        public string Accounts { get; set; }
        public string? ClientEmail { get; set; }
        public string? LastFollowUpRemark { get; set; }
        public bool IsActive { get; set; }
        public virtual ICollection<Project>? Project { get; set; }
        public MarketPlaceAccount MarketPlaceAccounts { get; set; }
        public JobRecords? JobRecords { get; set; }
        public DateTime? LastFollowUpDate { get; set; }
    }
}
