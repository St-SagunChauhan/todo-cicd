using Microsoft.AspNetCore.Mvc;
using ST.ERP.Helper;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Infrastructure.Services;
using ST.ERP.Models.DTO;
using static ST.ERP.Helper.Enums;

namespace ST.ERP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Consumes("application/json")]
    [Authorize("Admin,TeamLead,BD,BDM")]
    public class ProjectBillingController : Controller
    {
        #region Constructor and service initialization

        private readonly IProjectBillingService _projectBillingService;
        
        public ProjectBillingController(IProjectBillingService projectBillingService)
        {
            _projectBillingService = projectBillingService;
        }

        #endregion

        /// <summary>
        /// Create ProjectBilling Details
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("createProjectBillingDetails")]
        public async Task<IActionResult> CreateProjectBillingDetails([FromBody] ProjectBillingDataRequest request)
        {
            try
            {
                return Ok(await _projectBillingService.AddProjectBilling(request)); 
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Update ProjectBilling Details
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPut]
        [Route("updateProjectBillingDetails")]
        public async Task<IActionResult> UpdateProjectBillingDetails(ProjectBillingDataRequest request)
        {
            try
            {
                return Ok(await _projectBillingService.AddProjectBilling(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Delete ProjectBilling Details
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpDelete("{Id:guid}")]
        [Route("deleteProjectBillingDetails")]
        public async Task<IActionResult> DeleteProjectBillingDetails(Guid Id)
        {
            try
            {
                return Ok(await _projectBillingService.DeleteProjectBilling(Id));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get ProjectBilling Details By Id
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpGet("{Id:guid}")]
        [Route("getProjectBillingDetailsById")]
        public async Task<IActionResult> GetProjectBillingDetailsById(Guid Id)
        {
            try
            {
                return Ok(await _projectBillingService.GetProjectBillingById(Id));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get ProjectBilling Details
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("getProjectBillingDetails")]
        public async Task<IActionResult> GetProjectBillingDetails(CustomFilterRequest request)
        {
            try
            {
                return Ok(await _projectBillingService.GetProjectBillings(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Search ProjectBilling Details
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("searchProjectBillingDetails")]
        public async Task<IActionResult> SearchProjectBillingDetails(ProjectBillingDataRequest request)
        {
            try
            {
                return Ok(await _projectBillingService.SearchProjectBilling(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }
        [HttpPost]
        [Route("DownloadProjectBilling")]
        public async Task<IActionResult> DownloadProjectBilling()
        {
            try
            {
                var response = await _projectBillingService.DownloadProjectBilling();
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
        /// <summary>
        /// Upload Report
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("UploadProjectBillingExcel")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadProjectBillingData([FromForm] ProjectBillingFiles model)
        {
            try
            {
                if (model is not null)
                    return Ok(await _projectBillingService.ImportProjectBilling(model));
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

    }
}
