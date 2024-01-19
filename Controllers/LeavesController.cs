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
    public class LeavesController : Controller
    {
        #region Constructor and service initialization

        private readonly ILeavesService _leavesService;

        public LeavesController(ILeavesService leavesService)
        {
            _leavesService = leavesService;
        }

        #endregion

        /// <summary>
        /// Create Leaves
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("createLeave")]
        public async Task<IActionResult> CreateLeaves([FromBody] LeaveRequest request)
        {
            try
            {
                return Ok(await _leavesService.ApplyLeaves(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Update Leaves
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPut]
        [Route("updateLeave")]
        [Authorize($"{nameof(Role.Admin)},{nameof(Role.HR)},{nameof(Role.TeamLead)}")]
        public async Task<IActionResult> UpdateLeaves([FromBody] LeaveRequest request)
        {
            try
            {
                return Ok(await _leavesService.ApplyLeaves(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get All Leaves
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("getAllLeaves")]
        public async Task<IActionResult> GetAllLeaves(CustomFilterRequest request)
        {
            try
            {
                return Ok(await _leavesService.GetLeaves(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get Leave By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpGet("{Id:guid}")]
        [Route("getLeaveById/{id}")]
        public async Task<IActionResult> GetLeaveById(Guid id)
        {
            try
            {
                return Ok(await _leavesService.GetLeaveById(id));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }


        /// <summary>
        /// Get Leave By EMployee Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        //[HttpGet("{Id:guid}")]
        //[Route("getLeaveByEmployeeId/{id}")]
        //public async Task<IActionResult> GetLeaveByEmployeeId(Guid Id)
        //{
        //    try
        //    {
        //        return Ok(await _leavesService.GetLeaveByEmployeeId(Id));
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new AppException(ex.Message);
        //    }
        //}

        /// <summary>
        /// Delete Leave
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpDelete()]
        [Route("deleteLeave/{id}")]
        [Authorize($"{nameof(Role.Admin)},{nameof(Role.HR)},{nameof(Role.TeamLead)}")]
        public async Task<IActionResult> DeleteLeave(Guid id)
        {
            try
            {
                return Ok(await _leavesService.RemoveLeave(id));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Search Leaves
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("searchEmployeeLeave")]
        [Authorize($"{nameof(Role.Admin)},{nameof(Role.HR)},{nameof(Role.TeamLead)}")]
        public async Task<IActionResult> SearchLeaves(LeaveRequest model)
        {
            try
            {
                return Ok(await _leavesService.SearchLeaves(model));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        [HttpPost]
        [Route("getNotApprovedLeaves")]
        public async Task<IActionResult> GetNotApprovedLeaves()
        {
            try
            {
                await _leavesService.NotifyToChangeLeaveStatus();
                return Ok();
            }
            catch (Exception ex)
            {
                // Handle and log the exception here
                return StatusCode(StatusCodes.Status500InternalServerError, "An internal server error occurred.");
            }
        }

    }
}
