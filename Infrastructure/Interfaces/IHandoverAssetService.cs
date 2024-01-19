using Microsoft.EntityFrameworkCore.SqlServer.Query.Internal;
using ST.ERP.Models.CustomModels;
using ST.ERP.Models.DTO;

namespace ST.ERP.Infrastructure.Interfaces
{
    public interface IHandoverAssetService
    {
        Task<HandoverAssetResponse> AddHandoverAssetRecord(HandoverAssetsRequest request);
        Task<HandoverAssetResponse> UpdateHandoverAssetRecord(UpdateHandoverAssetRequest request);
        Task<List<HandoverAssetResponseData>> GetAllHandoverAssetsRecords(HandoverFilterRequest handoverFilterRequest);
        Task<HandoverAssetResponse> DeleteHandoverAssetResponse(Guid id);
        Task<HandoverAssetResponse> GetHandoverAssetResponseById(Guid id);
        Task<HandoverAssetResponse> ImportHandoverAssetListFile(ImportHandoverAssetRequest handoverAssetRequest);
        Task<DownloadAssetReportResponse> DownloadHandoverAssetReport();
    }
}
