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
    public class AssetCategoryController : ControllerBase
    {
        #region Constructor and service initialization

        private readonly IAssetCategoryService _assetCategoryService;

        public AssetCategoryController(IAssetCategoryService assetCategoryService)
        {
            _assetCategoryService = assetCategoryService;
        }

        #endregion

        /// <summary>
        /// Create Asset Category
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPost]
        [Route("createAssetCategory")]
        public async Task<IActionResult> CreateAssetCategory([FromBody] AssetCategoriesRequest request)
        {
            try
            {
                return Ok(await _assetCategoryService.CreateAssetCategory(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Update Assets Categories
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpPut]
        [Route("updateAssetCategory")]
        public async Task<IActionResult> UpdateAssetCategory(AssetCategoriesRequest request)
        {
            try
            {
                return Ok(await _assetCategoryService.CreateAssetCategory(request));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Delete Assets Categories
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpDelete()]
        [Route("deleteAssetCategory/Id")]
        public async Task<IActionResult> DeleteAssetCategory(Guid Id)
        {
            try
            {
                return Ok(await _assetCategoryService.DeleteAssetCategory(Id));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get Assets Categories By Id
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpGet()]
        [Route("getAssetCategoryById/{Id}")]
        public async Task<IActionResult> GetAssetCategoryById(Guid Id)
        {
            try
            {
                return Ok(await _assetCategoryService.GetAssetCategoryById(Id));
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get All Assets Categories
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        [HttpGet]
        [Route("getAllAssetsCategories")]
        public async Task<IActionResult> GetAllAssetsCategories()
        {
            try
            {
                return Ok(await _assetCategoryService.GetAllAssetsCategories());
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }
    }
}
