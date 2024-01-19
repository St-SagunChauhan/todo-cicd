using ST.ERP.Models.DTO;

namespace ST.ERP.Infrastructure.Interfaces
{
    public interface IAssetService
    {
        Task<AssetsResponse> AddAsset(AssetsRequest request);
        Task<AssetsResponseData> GetAssetById(Guid id);
        Task<List<AssetsResponseData>> GetAllAssets(AssetsFilterRequest assetsFilterRequest);
        Task<AssetsResponse> ImportAssetListFile(ImportAssetRequest model);
        Task<DownloadAssetReportResponse> DownloadAssetReport();
    }
}
