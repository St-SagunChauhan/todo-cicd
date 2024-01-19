using ST.ERP.Helper.Impoter_Utilites;

namespace ST.ERP.Models.DTO
{
    public class ConnectsRequest
    {
        public Guid Id { get; set; }
        public DateTime? DateOfPurchase { get; set; }
        public int NumberOfConnects { get; set; }
        public int AccountType { get; set; }
        public int Amount { get; set; }
    }

    public class ConnectsImportRequest : FormFileUpload
    {
    }

    public class ConnectsImportHistoryRequest
    {
        public DateTime? DateOfPurchase { get; set; }
        public int NumberOfConnects { get; set; }
        public string AccountType { get; set; }
        public int Amount { get; set; }
    }
}
