using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ST.ERP.Models.DAO
{
    public class AssetsInventory:EntityBase
    {
        [Key]
        public Guid InventoryId { get; set; }
        [ForeignKey("HandoverId")]
        public Guid? HandoverId { get; set; }
        [ForeignKey("AssetId")]
        public Guid? AssetId { get; set; }
        public int? Quantity { get; set; }
        public int? InStock { get; set; }
        public Assets? Assets { get; set; }
        public HandoverAsset? HandoverAsset { get; set; }
    }
}
