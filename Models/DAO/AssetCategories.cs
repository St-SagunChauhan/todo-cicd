using System.ComponentModel.DataAnnotations;

namespace ST.ERP.Models.DAO
{
    public class AssetCategories:EntityBase
    {
        [Key]
        public Guid CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public bool IsActive { get; set; }
        public virtual ICollection<Assets>? Assets { get; set; }
    }
}
