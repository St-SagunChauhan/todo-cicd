using ST.ERP.Models.DTO;

namespace ST.ERP.Infrastructure.Interfaces
{
    public interface IAssetCategoryService 
    {
        Task<AssetCategoryResponse> CreateAssetCategory(AssetCategoriesRequest request);
        Task<List<AssetCategoryResponseData>> GetAllAssetsCategories();
        Task<AssetCategoryResponse> GetAssetCategoryById(Guid id);
        Task<AssetCategoryResponse> DeleteAssetCategory(Guid id);
    }
}
