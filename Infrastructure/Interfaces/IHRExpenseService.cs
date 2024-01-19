using Microsoft.AspNetCore.Mvc;
using ST.ERP.Helper.Impoter_Utilites;
using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;

namespace ST.ERP.Infrastructure.Interfaces
{
    public interface IHRExpenseService
    {
        Task<HRExpenseResponse> ImportHRExpense(HRExpenseRequest model);
        Task<List<HRExpense>> GetHRExpense(HRExpenseRequest request);
        Task<HRExpenseResponse> DownloadHRExpense();
        Task<HRExpenseResponse> DownloadHiringListTemplate();
        Task<HRExpenseResponse> ImportHiringList(FormFileUpload model);
        Task<List<HiringList>> GetHiringList();
        Task<List<HiringListByDepartment>> GetDepartmentHiringList(string departmentId);
    }
}
