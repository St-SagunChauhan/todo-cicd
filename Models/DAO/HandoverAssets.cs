using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static ST.ERP.Helper.Enums;

namespace ST.ERP.Models.DAO
{
    public class HandoverAsset:EntityBase
    {
        [Key]
        public Guid HandoverId { get; set; }
        [ForeignKey("AssetId")]
        public Guid? AssetId { get; set; }
        [ForeignKey("EmployeeId")]
        public Guid? EmployeeId { get; set; }
        public DateTime? AssignedDate { get; set; }
        public int? HandoverStatus { get; set; }
        public string? IdentificationNumber { get; set; }
        public Employee? Employee { get; set; }
        public Assets? Assets { get; set; }
        public virtual ICollection<AssetsInventory>? AssetInventory { get; set; }
    }
}
