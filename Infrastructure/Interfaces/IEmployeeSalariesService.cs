using ST.ERP.Models.DTO;

namespace ST.ERP.Infrastructure.Interfaces
{
    /// <summary>
    /// Interface for Employee Salaries Service
    /// </summary>
    public interface IEmployeeSalariesService
    {
        Task<EmployeeSalariesResponse> CreateEmployeeSalary(EmployeeSalariesRequest request);
        Task<EmployeeSalariesResponse> DeleteEmployeeSalary(Guid Id);
        Task<EmployeeSalariesResponse> GetEmployeeSalaryById(Guid id);
        Task<List<EmployeeSalaryResponse>> GetAllEmployeeSalary(CustomDepartmentFilterRequest request);
    }
}
