using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;

namespace ST.ERP.Infrastructure.Interfaces
{
    /// <summary>
    /// Interface for Department Service
    /// </summary>
    public interface IDepartmentService
    {
        Task<DepartmentResponse> CreateDepartment(DepartmentRequest request);
        Task<DepartmentResponse> DeleteDepartment(Guid Id);
        Task<DepartmentResponse> GetDepartmentById(Guid Id);
        Task<List<Department>> GetDepartments();
        Task<List<Department>> GetDepartmentsWithProjects();
	}
}
