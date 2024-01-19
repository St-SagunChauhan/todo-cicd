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
    [Authorize("Admin,TeamLead,BD,BDM")]
    public class ConnectController : ControllerBase
    {
        #region Constructor and service initialization

        private readonly IConnectService _connectService;

        public ConnectController(IConnectService connectService)
        {
            _connectService = connectService;
        }

        #endregion

        /// <summary>
        /// Get All Connects
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpGet]
        [Route("getAllConnects")]
        public async Task<IActionResult> GetAllConnects()
        {
            try
            {
                return Ok(await _connectService.GetAllConnects());
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Create Connects
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("createConnects")]
        public async Task<IActionResult> CreateConnects([FromBody] ConnectsRequest request)
        {
            try
            {
                return Ok(await _connectService.CreateConnects(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        [HttpPost]
        [Route("uploadConnectsExcel")]
        public async Task<IActionResult> UploadConnectsExcel([FromForm] ConnectsImportRequest model)
        {
            try
            {
                if (model is not null)
                    return Ok(await _connectService.ImportConnectsFile(model));
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }

        /// <summary>
        /// Create Connect
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Consumes("application/json")]
        [Route("createConnect")]
        public async Task<IActionResult> CreateConnect([FromBody] ConnectRequest request)
        {
            try
            {
                return Ok(await _connectService.CreateConnect(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Update Connect
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPut]
        [Consumes("application/json")]
        [Route("updateConnect")]
        public async Task<IActionResult> UpdateConnect(ConnectRequest request)
        {
            try
            {
                return Ok(await _connectService.CreateConnect(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Delete Connect
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpDelete("{Id:guid}")]
        [Consumes("application/json")]
        [Route("deleteConnect")]
        public async Task<IActionResult> DeleteConnect(Guid id)
        {
            try
            {
                return Ok(await _connectService.DeleteConnect(id));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get Connect By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpGet("{Id:guid}")]
        [Consumes("application/json")]
        [Route("getConnectById/{id}")]
        public async Task<IActionResult> GetConnectById(Guid id)
        {
            try
            {
                return Ok(await _connectService.GetConnectById(id));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get All Connects
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Consumes("application/json")]
        [Route("getAllConnects")]
        public async Task<IActionResult> GetAllConnects(CustomDepartmentFilterRequest request)
        {
            try
            {
                return Ok(await _connectService.GetAllConnects(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        [HttpPost]
        [Route("UploadExcel")]
        public async Task<IActionResult> UploadConnectReport([FromForm] ConnectImportRequest model)
        {
            try
            {
                if (model is not null)
                {
                    return Ok(await _connectService.ImportConnectReport(model));
                }
                else return BadRequest();
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        [HttpPost]
        [Route("UploadConnectHistoryExcel")]
        public async Task<IActionResult> UploadConnectHistoryReport([FromForm] ConnectsHistroyRequest model)
        {
            try
            {
                if (model is not null)
                    return Ok(await _connectService.ImportConnectsHistoryFile(model));
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }

        [HttpPost]
        [Route("GetAllConnectHistoryReport")]
        public async Task<IActionResult> GetAllConnectHistoryReport(CustomCreateDateFilterRequest request)
        {
            try
            {
                return Ok(await _connectService.GetConnectsHistroy(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }
        #region Download Connects Excel Sample
        /// <summary>
        /// Download Connects Excel Sample
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("downloadConnectsSampleExcel")]
        public async Task<FileStreamResult> DownloadConnectsSampleExcel()
        {
            try
            {
                var response = await _connectService.DownloadConnectsSampleExcel();

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
