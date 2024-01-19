using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;

namespace ST.ERP.Infrastructure.Interfaces
{
    /// <summary>
    /// Interface for Projects Service
    /// </summary>
    public interface IProjectService
    {
        Task<ProjectResponse> UpdateProject(EditProjectRequest request);
        Task<ProjectResponse> DeleteProject(Guid Id);
        Task<ProjectResponse> GetProjectById(Guid Id);
        Task<List<ProjectResponseData>> GetProjects(CustomDepartmentFilterRequest request);
        Task<ProjectResponse> ImportProjectListFile(ImportProjectRequest model);
        Task<ExportReportResponse> DownloadProject();
        Task<List<CurrentProjectMembersResponse>> GetProjectMembers(Guid id);
        Task<List<ProjectResponseData>> GetProjectByEmployeeId(Guid id);
        Task<ProjectResponse> CreateProjectForExistingClients(ProjectRequest request);
        Task<List<ProjectsHistory>> GetProjectsHistoryByProjectId(Guid ProjectId);
    }
}
