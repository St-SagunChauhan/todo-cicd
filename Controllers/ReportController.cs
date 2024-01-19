using Microsoft.AspNetCore.Mvc;
using ST.ERP.Helper;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Infrastructure.Services;
using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;
using static ST.ERP.Helper.Enums;

namespace ST.ERP.Controllers
{

    [Route("api/report")]
    [ApiController]
    [Consumes("application/json")]
    [Authorize($"{nameof(Role.Admin)},{nameof(Role.HR)},{nameof(Role.BD)},{nameof(Role.BDM)},{nameof(Role.TeamLead)},{nameof(Role.Employee)}")]
    public class ReportController : ControllerBase
    {
        #region Constructor and Service Initialization

        private readonly IReportService _reportService;

        public ReportController(IReportService reportService)
        {
            _reportService = reportService;
        }

        #endregion

        /// <summary>
        /// Download Report
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpGet]
        [Route("downloadExcel")]
        public IActionResult DownloadReport()
        {
            try
            {
                string reportname = $"masterfile.xlsx";
                var exportbytes = _reportService.MasterExcel(reportname);

                return File(exportbytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", reportname);
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Import MasterFile
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("importMasterFile")]
        [Consumes(" multipart/form-data")]
        public async Task<IActionResult> ImportMasterFile([FromForm] MasterReportRequest model)
        {
            try
            {
                if (model is not null)
                {
                    return Ok(await _reportService.ImportMasterFile(model));
                }
                else
                {
                    return BadRequest(new { message = "please at least upload one file " });
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }

        /// <summary>
        /// Import Closed Projects File
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("importClosedProjects")]
        [Consumes(" multipart/form-data")]
        public async Task<IActionResult> ImportClosedProjectFile([FromForm] ClosedProjectReportRequest model)
        {
            try
            {
                if (model is not null)
                {
                    return Ok(await _reportService.ImportClosedReportFile(model));
                }
                else
                {
                    return BadRequest(new { message = "please at least upload one file " });
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }

        /// <summary>   
        /// Projects Report
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("projectReport")]
        public async Task<IActionResult> ProjectReport(CustomDepartmentFilterRequest request)
        {
            try
            {
                return Ok(await _reportService.GetProjectReport(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>   
        /// Client Report
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("clientReport")]
        public async Task<IActionResult> ClientReport(CustomDepartmentFilterRequest request)
        {
            try
            {
                return Ok(await _reportService.GetClientReport(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Connect Report
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("connectReport")]
        public async Task<IActionResult> ConnectReport(ConnectReportRequest model)
        {
            try
            {
                return Ok(await _reportService.GetConnectReport(model));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Billing Report
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("billingReport")]
        public async Task<IActionResult> BillingReport([FromBody] BillingReportRequest model)
        {
            try
            {
                return Ok(await _reportService.GetBillingReport(model));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        //[HttpPost]
        //[Route("capacityReport")]
        //public async Task<IActionResult> CapacityReport([FromBody] BillingReport model)
        //{
        //    try
        //    {
        //        return Ok(await _reportService.GetCapacityReport(model));
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new AppException(ex.Message);
        //    }
        //}

        /// <summary>
        /// Custom Projects Report
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("customProjectReport")]
        public async Task<IActionResult> CustomProjectReport([FromBody] BillingReportRequest model)
        {
            try
            {
                return Ok(await _reportService.ProjectReport(model));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Master Billing Report
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
		[HttpPost]
		[Route("masterBillingReport")]
		public async Task<IActionResult> MasterBillingReport([FromBody] MasterBillingReportRequest model)
		{
			try
			{
				return Ok(await _reportService.MasterBillingReport(model));
			}
			catch (Exception ex)
			{
				throw new AppException(ex.Message);
			}
		}

        /// <summary>
        /// Download Weekly Billing Report
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
		[HttpPost]
        [Route("exportWeeklyBillingReport")]
        public async Task<FileStreamResult> DownloadWeeklyBillingReport()
        {
            try
            {
                var response = await _reportService.DownloadWeeklyBillingReport();

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
        /// Download Projects Status Report
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("exportProjectStatusReport")]
        public async Task<FileStreamResult> DownloadProjectStatusReport(CustomDepartmentFilterRequest request)
        {
            try
            {
                var response = await _reportService.DownloadProjectStatusReport(request);

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
        /// Download Connect History Report
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("exportConnectHistoryReport")]
        public async Task<FileStreamResult> DownloadConnectHistoryReport()
        {
            try
            {
                var response = await _reportService.DownloadConnectHistoryReport();

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
        /// Download Master Report
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("exportMasterReport")]
        public async Task<FileStreamResult> DownloadMasterReport(CustomDepartmentFilterRequest depFilter)
        {
            try
            {
                var response = await _reportService.DownloadMasterReport(depFilter);

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
        [Route("UploadConnectExcel")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadConnectData([FromForm] ImportConnectsHistory model)
        {
            try
            {
                if (model is not null)
                {
                    return Ok(await _reportService.ImportConnectHistoryFile(model));
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
        [Route("weeklyJobReport")]
        public async Task<IActionResult> WeeklyJobReport()
        {
            try
            {
                return Ok(await _reportService.WeeklyJobReport());
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }
        //[HttpPost]
        //[Route("exportWeeklyProjectReport")]
        //public async Task<FileStreamResult> DownloadWeeklyProjectReport()
        //{
        //    try
        //    {
        //        var response = await _reportService.DownloadWeeklyProjectReport();

        //        if (response.Success)
        //        {
        //            return File(response.Streams, "application/octet-stream", "");
        //        }

        //        throw new AppException("");
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new AppException(ex.ToString());
        //    }
        //}

        [HttpGet]
        [Route("getContractStatus")]
        public async Task<IActionResult> GetContractStatus()
        {
            try
            {
                return Ok(await _reportService.GetContractStatus());
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }
    }
}
