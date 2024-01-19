using Microsoft.AspNetCore.Mvc;
using ST.ERP.Helper;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Models.DTO;
using static ST.ERP.Helper.Enums;

namespace ST.ERP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Consumes("application/json")]
    public class EmployeeSalariesController : ControllerBase
    {
        #region Constructor and service initialization

        private readonly IEmployeeSalariesService _employeeSalariesService;

        public EmployeeSalariesController(IEmployeeSalariesService employeeSalariesService)
        {
            _employeeSalariesService = employeeSalariesService;
        }

        #endregion

        /// <summary>
        /// Create Employee Salary Details
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("createEmployeeSalary")]
        [Authorize($"{nameof(Role.Admin)},{nameof(Role.HR)}")]
        public async Task<IActionResult> CreateEmployeeSalaryDetails([FromBody] EmployeeSalariesRequest request)
        {
            try
            {
                return Ok(await _employeeSalariesService.CreateEmployeeSalary(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Update Employee Salary Details
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        [HttpPut]
        [Route("updateEmployeeSalary")]
        [Authorize($"{nameof(Role.Admin)},{nameof(Role.HR)}")]
        public async Task<IActionResult> UpdateEmployeeSalaryDetails(EmployeeSalariesRequest request)
        {
            try
            {
                return Ok(await _employeeSalariesService.CreateEmployeeSalary(request));
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        /// <summary>
        /// Get Employee Salary Details By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        [HttpGet]
        [Route("getEmployeeSalaryById/{id}")]
        public async Task<IActionResult> GetEmployeeSalaryDetailsById(Guid id)
        {
            try
            {
                return Ok(await _employeeSalariesService.GetEmployeeSalaryById(id));
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        /// <summary>
        /// Delete Employee Salary Details
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpDelete("{Id:guid}")]
        [Route("deleteEmployeeSalary")]
        [Authorize($"{nameof(Role.Admin)},{nameof(Role.HR)}")]
        public async Task<IActionResult> DeleteEmployeeSalaryDetails(Guid id)
        {
            try
            {
                return Ok(await _employeeSalariesService.DeleteEmployeeSalary(id));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get All Employee Salary Details
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        [HttpPost]
        [Route("getAllEmployeeSalaryDetails")]
        public async Task<IActionResult> GetAllEmployeeSalaryDetails(CustomDepartmentFilterRequest request)
        {
            try
            {
                return Ok(await _employeeSalariesService.GetAllEmployeeSalary(request));
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

    }
}
