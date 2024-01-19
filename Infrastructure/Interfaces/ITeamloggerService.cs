using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;

namespace ST.ERP.Infrastructure.Interfaces
{
    public interface ITeamloggerService
    {
        Task<TeamLoggerReportResponse> ImportTeamloggerFile(TeamLoggerReportRequest model);
        Task<List<TeamLoggerReport>> GetTeamloggerRecords(CustomDepartmentFilterRequest request);
        Task<ExportReportResponse> DownloadTeamlogger();
        byte[] TeamloggerExcel(string reportname);
    }
}
