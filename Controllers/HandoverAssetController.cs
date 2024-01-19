using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ST.ERP.Helper;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Infrastructure.Services;
using ST.ERP.Models.CustomModels;
using ST.ERP.Models.DTO;
using static ST.ERP.Helper.Enums;

namespace ST.ERP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Consumes("application/json")]
    public class HandoverAssetController : ControllerBase
    {
        #region Constructor and service initialization

        private readonly IHandoverAssetService _handoverAssetService;

        public HandoverAssetController(IHandoverAssetService handoverAssetService)
        {
            _handoverAssetService = handoverAssetService;
        }

        #endregion

        /// <summary>
        /// Add Handover Asset
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("addHandoverAssetRecord")]
        [Authorize(nameof(Role.Admin))]
        public async Task<IActionResult> AddHandoverAssetRecord([FromBody] HandoverAssetsRequest request)
        {
            try
            {
                return Ok(await _handoverAssetService.AddHandoverAssetRecord(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }
        /// <summary>
        /// Update Handover Asset
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPut]
        [Route("updateHandoverAssetRecord")]
        [Authorize(nameof(Role.Admin))]
        public async Task<IActionResult> UpdateHandoverAssetRecord([FromBody] UpdateHandoverAssetRequest request)
        {
            try
            {
                return Ok(await _handoverAssetService.UpdateHandoverAssetRecord(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }
        /// <summary>
        /// Get Asset By Id
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpGet()]
        [Route("getHandoverAssetResponseById/{Id}")]
        public async Task<IActionResult> GetHandoverAssetResponseById(Guid Id)
        {
            try
            {
                return Ok(await _handoverAssetService.GetHandoverAssetResponseById(Id));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get All Assets 
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("getAllHandoverAssetsRecords")]
        public async Task<IActionResult> GetAllHandoverAssetsRecords(HandoverFilterRequest handoverFilterRequest)
        {
            try
            {
                return Ok(await _handoverAssetService.GetAllHandoverAssetsRecords(handoverFilterRequest));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }
        [HttpDelete]
        [Route("deleteHandoverAssetResponse/{Id}")]
        public async Task<IActionResult> DeleteHandoverAssetResponse(Guid id)
        {
            try
            {
                return Ok(await _handoverAssetService.DeleteHandoverAssetResponse(id));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Download Handover Asset Report
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("downloadHandoverAssetReport")]
        public async Task<FileStreamResult> DownloadHandoverAssetReport()
        {
            try
            {
                var response = await _handoverAssetService.DownloadHandoverAssetReport();

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

        [Route("UploadExcel")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadHandoverAssetData([FromForm] ImportHandoverAssetRequest model)
        {
            try
            {
                if (model is not null)
                    return Ok(await _handoverAssetService.ImportHandoverAssetListFile(model));
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
