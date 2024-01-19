using ST.ERP.Models.DAO;

namespace ST.ERP.Models.DTO
{
    public class AssetCategoryResponse:BaseResponse
    {
        public AssetCategories? AssetCategories { get; set; }
    }
    public class AssetCategoryResponseData
    {
        public Guid CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public bool? IsActive { get; set; }
    }
}
