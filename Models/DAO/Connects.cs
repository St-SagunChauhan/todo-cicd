namespace ST.ERP.Models.DAO
{
    public class Connects : EntityBase
    {
        public Guid Id { get; set; }
        public DateTime? DateOfPurchase { get; set; }
        public int NumberOfConnects { get; set; }
        public int AccountType { get; set; }
        public int Amount { get; set; }
    }
}
