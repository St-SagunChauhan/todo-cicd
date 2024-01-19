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
    public class EodReportController : ControllerBase
    {
        #region Constructor and service initialization

        private readonly IEodService _eodService;

        public EodReportController(IEodService eodService)
        {
            _eodService = eodService;
        }

        #endregion

        [HttpPost]
        [Route("createEodReport")]
        [Authorize($"{nameof(Role.Admin)},{nameof(Role.BD)},{nameof(Role.Employee)},{nameof(Role.BDM)},{nameof(Role.TeamLead)}")]
        public async Task<IActionResult> CreateEodReport([FromBody] CreateEODReportRequest request)
        {
            try
            {
                return Ok(await _eodService.CreateEodReport(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        [HttpPut]
        [Route("updateEodReport")]
        public async Task<IActionResult> UpdateEodReport([FromBody] CreateEODReportRequest request)
        {
            try
            {
                return Ok(await _eodService.CreateEodReport(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        [HttpPost]
        [Route("getEodReports")]
        public async Task<IActionResult> GetAllEodReports(CustomFilterRequest request)
        {
            try
            {
                return Ok(await _eodService.GetEodReports(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get eod by Id 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        [HttpGet]
        [Route("getEodReportById/{id}")]
        [Consumes("application/json")]
        public async Task<IActionResult> GetEodReportById(Guid id)
        {
            try
            {
                return Ok(await _eodService.GetEodReportById(id));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }
    }
}
