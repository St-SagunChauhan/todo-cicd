using ST.ERP.Models.DTO;

namespace ST.ERP.Infrastructure.Interfaces
{
    /// <summary>
    /// Interface for Employee Service
    /// </summary>
    public interface IEmployeeService
    {
        Task<EmployeeResponse> CreateEmployee(CreateEmployeeRequest request);
        Task<EmployeeResponse> GetEmployeeById(Guid? id);
        Task<List<EmployeeResponseData>> GetEmployees(CustomDepartmentFilterRequest request);
        Task<EmployeeResponse> DeleteEmployee(Guid Id);
        Task<EmployeeResponse> UpdateProfilePicture(CreateEmployeeRequest request);
        Task<List<EmployeeResponseData>> GetEmployeesForDepartment(CustomFilterByDepartmentIds request);
        Task<EmployeeResponse> ImportEmployeeListFile(ImportEmployeeRequest model);
        Task<List<EmployeeResponseData>> GetActiveTeamMembers(Guid id);
        Task<ExportReportResponse> DownloadEmployee();
    }
}
