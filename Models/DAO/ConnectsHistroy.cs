using System.ComponentModel.DataAnnotations;

namespace ST.ERP.Models.DAO
{
    public class ConnectsHistroy : EntityBase
    {
        [Key]
        public Guid Id { get; set; }
        public string? PurchasedDate { get; set; }
        public string? NumberConnects { get;set; }
        public string? Price { get; set; }
        public string? UpworkID { get; set; }
        public string? Department { get; set; }
        public string? ConnectUsed { get; set;}

    }
}
