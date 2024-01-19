using ST.ERP.Helper.Impoter_Utilites;

namespace ST.ERP.Models.DTO
{
    public class ConnectsHistroyRequest: FormFileUpload
    {
       
    }
    public class ImporterConnectsHistroyRequest
    {
        public string? PurchasedDate { get; set; }
        public string? NumberConnects { get; set; }
        public string? Price { get; set; }
        public string? UpworkID { get; set; }
        public string? Department { get; set; }
        public string? ConnectUsed { get; set; }
    }
}
