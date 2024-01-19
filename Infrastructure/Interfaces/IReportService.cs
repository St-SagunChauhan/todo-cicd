using ST.ERP.Models.CustomModels;
using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;

namespace ST.ERP.Infrastructure.Interfaces
{
    /// <summary>
    /// Interface for Report Service
    /// </summary>
    public interface IReportService
    {
        byte[] MasterExcel(string reportname);
        Task<MasterReportResponse> ImportMasterFile(MasterReportRequest model);
        Task<ClosedProjectReportResponse> ImportClosedReportFile(ClosedProjectReportRequest model);
        Task<ClosedProjectReportResponse> ImportConnectUsedReport(ClosedProjectReportRequest model);
        Task<List<ProjectDepartmentResponseData>> GetProjectReport(CustomDepartmentFilterRequest request);
        Task<List<ProjectDepartmentResponseData>> GetClientReport(CustomDepartmentFilterRequest request);
        Task<List<ConnectSubReportResponse>> GetConnectReport(ConnectReportRequest request);
        Task<List<WeeklyBillingReportResponse>> GetBillingReport(BillingReportRequest request);
        Task<List<ProjectReportNew>> ProjectReport(BillingReportRequest request);
        Task<List<MasterBillingReportResponse>> MasterBillingReport(MasterBillingReportRequest request);
        Task<ExportReportResponse> DownloadWeeklyBillingReport();
        Task<ExportReportResponse> DownloadProjectStatusReport(CustomDepartmentFilterRequest request);
        Task<ExportReportResponse> DownloadConnectHistoryReport();
        Task<ExportReportResponse> DownloadMasterReport(CustomDepartmentFilterRequest depFilter);
        Task<ExportReportResponse> ImportConnectHistoryFile(ImportConnectsHistory model);
        Task<List<BidReportResponse>> WeeklyJobReport();
        //Task<ExportReportResponse> DownloadWeeklyProjectReport();
        Task<List<ContractStatus>> GetContractStatus();
    }
}
