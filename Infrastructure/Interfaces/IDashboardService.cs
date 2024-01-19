using ST.ERP.Models.DTO;

namespace ST.ERP.Infrastructure.Interfaces
{
    /// <summary>
    /// Interfacefor Dashboard Service
    /// </summary>
    public interface IDashboardService
    {
        Task<DashBoardResponse> GetEmployeeHoursDetail();        
    }
}
