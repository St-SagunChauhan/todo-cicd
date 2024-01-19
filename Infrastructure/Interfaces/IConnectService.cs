using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;

namespace ST.ERP.Infrastructure.Interfaces
{
    /// <summary>
    /// Interface for Connect Service
    /// </summary>
    public interface IConnectService
    {
        Task<ConnectResponse> CreateConnect(ConnectRequest request);
        Task<ConnectResponse> DeleteConnect(Guid Id);
        Task<ConnectResponse> GetConnectById(Guid Id);
        Task<List<ConnectResponseData>> GetAllConnects(CustomDepartmentFilterRequest request);
        Task<List<Connect>> GetAllConnectsByDates(DateTime startDate, DateTime endDate);
        Task<ConnectsHistroyResponse> ImportConnectsHistoryFile(ConnectsHistroyRequest model);
        Task<List<ConnectsHistroy>> GetConnectsHistroy(CustomCreateDateFilterRequest request);
        Task<ConnectResponse> ImportConnectReport(ConnectImportRequest model);
        Task<ConnectsSampleExcelResponse> DownloadConnectsSampleExcel();
        Task<List<ConnectsResponseData>> GetAllConnects();
        Task<ConnectsResponse> CreateConnects(ConnectsRequest request);
        Task<ConnectsImportResponse> ImportConnectsFile(ConnectsImportRequest request);
    }
}
