using ST.ERP.Models.DTO;
using ST.ERP.Models.DAO;

namespace ST.ERP.Infrastructure.Interfaces
{
    /// <summary>
    /// Interfaces for ProjectBilling Service
    /// </summary>
    public interface IProjectBillingService
    {
        Task<ProjectBillingResponse> AddProjectBilling(ProjectBillingDataRequest request);
        Task<ProjectBillingResponse> DeleteProjectBilling(Guid Id);
        Task<ProjectBillingResponse> GetProjectBillingById(Guid Id);
        Task<List<ProjectBillingResponseData>> GetProjectBillings(CustomFilterRequest request);
        Task<List<ProjectBilling>> SearchProjectBilling(ProjectBillingDataRequest model);
        Task<ProjectBillingResponse> ImportProjectBilling(ProjectBillingFiles model);
        Task<ExportReportResponse> DownloadProjectBilling();
    }
}
