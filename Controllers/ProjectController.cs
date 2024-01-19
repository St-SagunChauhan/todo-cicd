using Microsoft.AspNetCore.Mvc;
using ST.ERP.Helper;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Infrastructure.Services;
using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;
using static ST.ERP.Helper.Enums;

namespace ST.ERP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize($"{nameof(Role.Admin)},{nameof(Role.BD)}, {nameof(Role.BDM)}, {nameof(Role.TeamLead)}, {nameof(Role.Employee)}")]
    public class ProjectController : ControllerBase
    {
        #region Constructor and service initialization

        private readonly IProjectService _projectService;

        public ProjectController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        #endregion


        /// <summary>
        /// Update Projects
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPut]
        [Route("updateProject")]
        [Consumes("application/json")]
        public async Task<IActionResult> UpdateProject(EditProjectRequest request)
        {
            try
            {
                return Ok(await _projectService.UpdateProject(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Delete Projects
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpDelete("{Id:guid}")]
        [Route("deleteProject")]
        [Consumes("application/json")]
        public async Task<IActionResult> DeleteProject(Guid Id)
        {
            try
            {
                return Ok(await _projectService.DeleteProject(Id));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get Projects By Id
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpGet("{Id:guid}")]
        [Route("getProjectById/{id}")]
        [Consumes("application/json")]
        public async Task<IActionResult> GetProjectById(Guid Id)
        {
            try
            {
                return Ok(await _projectService.GetProjectById(Id));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get Projects
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("getAllProjects")]
        [Consumes("application/json")]
        public async Task<IActionResult> GetProjects(CustomDepartmentFilterRequest request)
        {
            try
            {
                return Ok(await _projectService.GetProjects(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Upload Report
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("UploadExcel")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadProjectData([FromForm] ImportProjectRequest model)
        {
            try
            {
                if (model is not null)
                {
                    return Ok(await _projectService.ImportProjectListFile(model));
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Download Sample in Excel
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("DownloadExcel")]
        public async Task<IActionResult> DownloadReport()
        {
            try
            {
                var response = await _projectService.DownloadProject();
                if (response.Success)
                {
                    return File(response.Streams, "application/octet-stream", "");
                }

                throw new AppException("");
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        [HttpGet()]
        [Route("getCurrentProjectMember")]
        [Consumes("application/json")]
        public async Task<IActionResult> GetCurrentProjectMember(Guid Id)
        {
            try
            {
                return Ok(await _projectService.GetProjectMembers(Id));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        [HttpGet()]
        [Route("getProjectByEmployeeId/{id}")]
        [Consumes("application/json")]
        public async Task<IActionResult> GetProjectsByEmployeeId(Guid Id)
        {
            try
            {
                return Ok(await _projectService.GetProjectByEmployeeId(Id));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        [HttpPost]
        [Route("createProjectForExistingClients")]
        [Consumes("application/json")]
        public async Task<IActionResult> CreateProjectForExistingClients(ProjectRequest request)
        {
            try
            {
                return Ok(await _projectService.CreateProjectForExistingClients(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        [HttpGet("getProjectsHistoryByProjectId/{ProjectId:guid}")]
        [Consumes("application/json")]
        public async Task<IActionResult> GetProjectsHistoryByProjectId(Guid ProjectId)
        {
            try
            {
                return Ok(await _projectService.GetProjectsHistoryByProjectId(ProjectId));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

    }
}
