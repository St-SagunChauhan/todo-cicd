using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ST.ERP.Helper;
using ST.ERP.Helper.Impoter_Utilites;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Infrastructure.Services;
using ST.ERP.Models.DTO;
using static ST.ERP.Helper.Enums;

namespace ST.ERP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize("Admin,HR,TeamLead")]
    public class HRExpenseController : ControllerBase
    {
        #region Fields
        private readonly IHRExpenseService _hrExpenseService;
        #endregion

        #region Constructor
        public HRExpenseController(IHRExpenseService hrExpenseService)
        {
            _hrExpenseService = hrExpenseService;
        }
        #endregion

        #region EndPoints
        /// <summary>
        /// Upload HRExpense Report
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("UploadExcel")]
        public async Task<IActionResult> UploadHRExpenseReport([FromForm] HRExpenseRequest model)
        {
            try
            {
                if (model is not null)
                    return Ok(await _hrExpenseService.ImportHRExpense(model));
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get HRExpense Report
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("GetAllRecords")]
        public async Task<IActionResult> GetHRExpenseReport(HRExpenseRequest request)
        {
            try
            {
                return Ok(await _hrExpenseService.GetHRExpense(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }


        /// <summary>
        /// Download HR Expense Report
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("hrExpenseReport")]
        public async Task<FileStreamResult> DownloadHRExpenseReport()
        {
            try
            {
                var response = await _hrExpenseService.DownloadHRExpense();

                if (response.Success)
                {
                    return File(response.Streams, "application/octet-stream", "");
                }

                throw new AppException("");
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }

        /// <summary>
        /// Download HR Hiring Report
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("DownloadHiringReport")]
        public async Task<FileStreamResult> DownloadHiringReport()
        {
            try
            {
                var response = await _hrExpenseService.DownloadHiringListTemplate();

                if (response.Success)
                {
                    return File(response.Streams, "application/octet-stream", "");
                }

                throw new AppException("");
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }


        [HttpPost]
        [Route("UploadHiringReport")]
        public async Task<IActionResult> UploadHiringReport([FromForm] FormFileUpload model)
        {
            try
            {
                if (model is not null)
                    return Ok(await _hrExpenseService.ImportHiringList(model));
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }


        /// <summary>
        /// Get HR Hiring Report
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpGet]
        [Route("getAllHiringRecords")]
        public async Task<IActionResult> GetAllHiringRecords()
        {
            try
            {
                return Ok(await _hrExpenseService.GetHiringList());
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }



        /// <summary>
        /// Get HR Hiring Report
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpGet]
        [Route("getHiringRecordsbydepartment")]
        public async Task<IActionResult> GetHiringRecordsByDepartment(string departmentId)
        {
            try
            {
                return Ok(await _hrExpenseService.GetDepartmentHiringList(departmentId));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }
        #endregion
    }
}
