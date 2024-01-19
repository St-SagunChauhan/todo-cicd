using Microsoft.AspNetCore.Mvc;
using ST.ERP.Helper;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;
using static ST.ERP.Helper.Enums;

namespace ST.ERP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Consumes("application/json")]
    public class DepartmentController : ControllerBase
    {
        #region Constructor and service initialization

        private readonly IDepartmentService _departmentService;
        private readonly ILogger<DepartmentController> _logger;

        public DepartmentController(IDepartmentService departmentService, ILogger<DepartmentController> logger)
        {
            _departmentService = departmentService;
            _logger = logger;
        }

        #endregion

        /// <summary>
        /// Create Department
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("createDepartment")]
        [Authorize($"{nameof(Role.Admin)},{nameof(Role.HR)}")]
        public async Task<IActionResult> CreateDepartment([FromBody] DepartmentRequest request)
        {
            try
            {
                return Ok(await _departmentService.CreateDepartment(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Update Department
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPut]
        [Route("updateDepartment")]
        [Authorize($"{nameof(Role.Admin)},{nameof(Role.HR)}")]
        public async Task<IActionResult> UpdateDepartment(DepartmentRequest request)
        {
            try
            {
                return Ok(await _departmentService.CreateDepartment(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Delete Department
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpDelete("{Id:guid}")]
        [Route("deleteDepartment")] 
        [Authorize($"{nameof(Role.Admin)},{nameof(Role.HR)}")]
        public async Task<IActionResult> DeleteDepartment(Guid id)
        {
            try
            {
                _logger.LogInformation($"Deleting department with ID {id}");
                var result = await _departmentService.DeleteDepartment(id);
                _logger.LogInformation($"Department with ID {id} deleted successfully");
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting department with ID {ex.Message}");
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get Department By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpGet("{Id:guid}")]
        [Route("getDepartmentById/{id}")]
        public async Task<IActionResult> GetDepartmentById(Guid id)
        {
            try
            {
                return Ok(await _departmentService.GetDepartmentById(id));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get Department
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpGet]
        [Route("getAllDepartments")]
        public async Task<IActionResult> GetDepartments()
        {
            try
            {
                return Ok(await _departmentService.GetDepartments());
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }
        [HttpGet]
        [Route("getDepartmentsWithProjects")]
        public async Task<IActionResult> GetDepartmentsWithProjects()
        {
            try
            {
                return Ok(await _departmentService.GetDepartmentsWithProjects());
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }
    }
}
