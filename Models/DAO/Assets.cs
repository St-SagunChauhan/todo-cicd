using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using static ST.ERP.Helper.Enums;

namespace ST.ERP.Models.DAO
{
    public class Assets:EntityBase
    {
        [Key]
        public Guid AssetId { get; set; }
        [ForeignKey("CategoryId")]
        public Guid? CategoryId { get; set; }
        public string? AssetName { get; set; }
        public int? ManufacturerName { get; set; }
        public DateTime? PurchasedDate { get; set; }
        public string? ModelNumber { get; set; }
        public string? Remarks { get; set; }
        public AssetCategories? AssetCategories { get; set; }
        public virtual ICollection<HandoverAsset>? HandoverAssets { get; set; }
        public virtual ICollection<AssetsInventory>? AssetInventory { get; set; }
    }
}
