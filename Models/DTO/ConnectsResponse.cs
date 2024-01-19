namespace ST.ERP.Models.DTO
{
    public class ConnectsResponse : BaseResponse
    {
        public ConnectsResponseData? Connects { get; set; }
    }

    public class ConnectsResponseData
    {
        public Guid Id { get; set; }
        public DateTime? DateOfPurchase { get; set; }
        public int NumberOfConnects { get; set; }
        public string AccountType { get; set; }
        public int Amount { get; set; }
    }

    public class ConnectsImportResponse : BaseResponse
    {
    }
}
