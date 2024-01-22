using ST.ERP.Models.DTO;

namespace ST.ERP.Infrastructure.Interfaces
{
    public interface IEodService
    {
        Task<EODReportResponse> CreateEodReport(CreateEODReportRequest request);
        Task<List<EODSubReport>> GetEodReports(CustomFilterRequest request);
        Task<EODReportResponse> GetEodReportById(Guid? id);
        Task<BaseResponse> EODReportApprovedByTeamLead(Guid? TeamLeadId, Guid? EodReportId);
    }
}
