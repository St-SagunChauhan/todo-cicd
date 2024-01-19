using Microsoft.AspNetCore.Http;
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
    [Authorize("Admin,HR,BD,TeamLead,Employee,BDM")]
    public class TeamLoggerReportcontroller : ControllerBase
    {
        private readonly ITeamloggerService _TeamloggerService;
        public TeamLoggerReportcontroller(ITeamloggerService TeamloggerService)
        {
            _TeamloggerService = TeamloggerService;
        }

        /// <summary>
        /// Upload Report
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("UploadExcel")]
        public async Task<IActionResult> UploadTeamloggerReport([FromForm] TeamLoggerReportRequest model)
         {
            try
            {
                if (model is not null)
                    return Ok(await _TeamloggerService.ImportTeamloggerFile(model));
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        [HttpPost]
        [Route("GetAllRecords")]
        public async Task<IActionResult> GetTeamloggerReport(CustomDepartmentFilterRequest request)
        {
            try
            {
                return Ok(await _TeamloggerService.GetTeamloggerRecords(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }


        [HttpPost]
        [Route("downloadTeamloggerExcel")]
        public IActionResult DownloadReport()
        {
            try
            {
                string reportname = $"Teamlogger.xlsx";
                var exportbytes = _TeamloggerService.TeamloggerExcel(reportname);
                return File(exportbytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", reportname);
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        #region Download Teamlogger Excel Sample
        /// <summary>
        /// Download Teamlogger Excel Sample
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("downloadTeamloggerSampleExcel")]
        public async Task<FileStreamResult> DownloadTeamloggerSampleExcel()
        {
            try
            {
                var response = await _TeamloggerService.DownloadTeamlogger();

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
        #endregion

    }
}
