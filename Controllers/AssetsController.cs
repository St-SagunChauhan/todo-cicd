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
    [Consumes("application/json")]
    public class AssetsController : ControllerBase
    {
        #region Constructor and service initialization

        private readonly IAssetService _assetService;

        public AssetsController(IAssetService assetService)
        {
            _assetService = assetService;
        }

        #endregion

        /// <summary>
        /// Create Asset
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("addAsset")]
        [Authorize(nameof(Role.Admin))]
        public async Task<IActionResult> AddAsset([FromBody] AssetsRequest request)
        {
            try
            {
                return Ok(await _assetService.AddAsset(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Update Assets
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPut]
        [Route("updateAsset")]
        [Authorize(nameof(Role.Admin))]
        public async Task<IActionResult> UpdateAsset(AssetsRequest request)
        {
            try
            {
                return Ok(await _assetService.AddAsset(request));
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
        [Route("GetAssetById/{Id}")]
        public async Task<IActionResult> GetAssetById(Guid Id)
        {
            try
            {
                return Ok(await _assetService.GetAssetById(Id));
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
        [Route("getAllAssets")]
        public async Task<IActionResult> GetAllAssets(AssetsFilterRequest assetsFilterRequest)
        {
            try
            {
                return Ok(await _assetService.GetAllAssets(assetsFilterRequest));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }
        [Route("UploadExcel")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadAssetData([FromForm] ImportAssetRequest model)
        {
            try
            {
                if (model is not null)
                    return Ok(await _assetService.ImportAssetListFile(model));
                else
                    throw new AppException("Asset Data is wrong or empty. Please check the data and try again!");
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Download Asset List Report
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("assetListReport")]
        public async Task<FileStreamResult> DownloadAssetReport()
        {
            try
            {
                var response = await _assetService.DownloadAssetReport();

                if (response.Success)
                {
                    return File(response.Streams, "application/octet-stream", "");
                }

                throw new Exception("Error occurred when downloading the assets data. Please try again later!");
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }
    }
}
