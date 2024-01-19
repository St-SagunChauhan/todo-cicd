using System.ComponentModel.DataAnnotations;

namespace ST.ERP.Models.DAO
{
    public class MarketPlaceAccount : EntityBase
    {
        [Key]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string? UserName { get; set; }
        public bool IsActive { get; set; }
        public int Accounts { get; set; }
        public int MarketPlaceAccountsStatus { get; set; }
        public string? Technology { get; set; }
        public string? Remarks { get; set; }
        public string? Earning { get; set; }
        public string? JobSuccessRate { get; set; }
        public virtual ICollection<ProjectBilling>? ProjectBillings { get; set; }
        public virtual ICollection<Client> MarketPlaceClient { get; set; }
        public virtual ICollection<Project> UpworkProfile { get; set; }
    }
}
