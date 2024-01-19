using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ST.ERP.Helper;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Infrastructure.Services;
using ST.ERP.Models.DTO;
using static ST.ERP.Helper.Enums;
using AuthorizeAttribute = ST.ERP.Helper.AuthorizeAttribute;

namespace ST.ERP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        #region Constructor and Service Initialization

        private readonly IEmployeeService _employeeService;
        private readonly IClientService _clientService;
        private readonly IAuthService _authService;

        public EmployeeController(IEmployeeService employeeService, IAuthService authService, IClientService clientService)
        {
            _employeeService = employeeService;
            _authService = authService;
            _clientService = clientService;
        }

        #endregion

        /// <summary>
        ///  Authenticate user
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="ArgumentNullException"></exception>
        [AllowAnonymous]
        [HttpPost]
        [Route("authenticate")]
        [Consumes("application/json")]
        public async Task<IActionResult> Authenticate([FromBody] AuthenticateUserRequest request)
        {
            // return basic user info and authentication token
            return Ok(await _authService.Authenticate(request.Email, request.Password));
        }

        [HttpPost]
        [Route("ImpersonateEmployee")]
        [Consumes("application/json")]
        [Authorize(nameof(Role.Admin))]
        public async Task<IActionResult> ImpersonateUser(ImpersonateUserRequest request)
        {
            try
            {
                return Ok(await _authService.ImpersonateUser(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

     
        [HttpPost]
        [Route("StopImpersonation")]
        [Consumes("application/json")]
        public async Task<IActionResult> StopImpersonation(ImpersonateUserRequest request)
        {
            try
            {
                return Ok(await _authService.StopImpersonation(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Create users 
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("CreateEmployee")]
        [Consumes("application/json")]
        //[Authorize(Roles.Admin, Roles.HR)]
        public async Task<IActionResult> CreateEmployee([FromBody] CreateEmployeeRequest request)
        {
            try
            {
                return Ok(await _employeeService.CreateEmployee(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get all active users 
        /// </summary>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        [HttpPost]
        [Route("GetEmployees")]
        [Consumes("application/json")]
        public async Task<IActionResult> GetEmployeeListAsync(CustomDepartmentFilterRequest request)
        {
            try
            {
                return Ok(await _employeeService.GetEmployees(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }

        /// <summary>
        /// Get user by user Id 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        [HttpGet]
        [Route("getEmployee/{id}")]
        [Consumes("application/json")]
        public async Task<IActionResult> GetEmployeeById(Guid id)
        {
            try
            {
                return Ok(await _employeeService.GetEmployeeById(id));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }

        /// <summary>
        /// Update user
        /// </summary>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        [HttpPut]
        [Route("UpdateEmployee")]
        [Consumes("application/json")]
        [Authorize($"{nameof(Role.Admin)},{nameof(Role.HR)}")]
        public async Task<IActionResult> UpdateEmployee(CreateEmployeeRequest request)
        {
            try
            {
                return Ok(await _employeeService.CreateEmployee(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Delete user by user Id 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        [HttpDelete]
		[Route("deleteEmployee/{employeeId}")]
        [Consumes("application/json")]
        [Authorize($"{nameof(Role.Admin)},{nameof(Role.HR)}")]
        public async Task<IActionResult> DeleteEmployee(Guid employeeId)
        {
            try
            {
                return Ok(await _employeeService.DeleteEmployee(employeeId));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }


        /// <summary>
        /// Update Profile Picture
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPut]
        [Route("updateProfilePicture")]
        [Consumes("application/json")]
        public async Task<IActionResult> UpdateProfilePicture(CreateEmployeeRequest request)
        {
            try
            {
                return Ok(await _employeeService.UpdateProfilePicture(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get all active users for department
        /// </summary>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        [HttpPost]
        [Route("GetEmployeesForDepartment")]
        [Consumes("application/json")]
        public async Task<IActionResult> GetEmployeeListForDepartmentsAsync(CustomFilterByDepartmentIds request)
        {
            try
            {
                return Ok(await _employeeService.GetEmployeesForDepartment(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
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
        public async Task<IActionResult> UploadEmployeeData([FromForm] ImportEmployeeRequest model)
        {
            try
            {
                if (model is not null)
                {
                    return Ok(await _employeeService.ImportEmployeeListFile(model));
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

        [HttpGet]
        [Route("getEmployeesOfSameDepartment")]
        [Consumes("application/json")]
        public async Task<IActionResult> GetEmployeesOfSameDepartment(Guid id)
        {
            try
            {
                return Ok(await _employeeService.GetActiveTeamMembers(id));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        [HttpPost]
        [Route("DownloadEmployeeExcel")]
        public async Task<IActionResult> DownloadReport()
        {
            try
            {
                var response = await _employeeService.DownloadEmployee();
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
    }
}
