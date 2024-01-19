using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ST.ERP.Helper;
using ST.ERP.Helper.Context;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;

namespace ST.ERP.Infrastructure.Services
{
    public class AssetCategoryService:IAssetCategoryService
    {
        #region Fields

        private readonly STERPContext _context;
        private readonly IMapper _mapper;

        #endregion

        #region Constructor

        public AssetCategoryService(STERPContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        #endregion

        #region Public Methods

        /// <summary>
        /// Create Asset Category
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<AssetCategoryResponse> CreateAssetCategory(AssetCategoriesRequest request)
        {
            try
            {
                var category = await _context.AssetCategories.AsNoTracking().FirstOrDefaultAsync(c => c.CategoryId == request.CategoryId && c.IsActive == true);
                if (category == null)
                {
                    var categoryData = _mapper.Map<AssetCategories>(request);
                    categoryData.IsActive = true;

                    await _context.AssetCategories.AddAsync(categoryData);
                    await _context.SaveChangesAsync();

                    return new AssetCategoryResponse { Success = true, Message = "Category Created Successfully", AssetCategories = categoryData };
                }
                else
                {
                    var data = _mapper.Map(request, new AssetCategories
                    {
                        CreatedBy = category.CreatedBy,
                        CreatedDate = category.CreatedDate,
                        IsActive = true,
                    });
                    _context.AssetCategories.Update(data);
                    await _context.SaveChangesAsync();

                    return new AssetCategoryResponse { Success = true, Message = "Category Updated Successfully", AssetCategories = data };
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }
        /// <summary>
        /// Delete Asset Category
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<AssetCategoryResponse> DeleteAssetCategory(Guid id)
        {
            try
            {
                var assetCategory = await _context.AssetCategories.AsNoTracking().FirstOrDefaultAsync(a => a.CategoryId == id);
                if (assetCategory is not null)
                {
                    assetCategory.IsActive = false;
                    _context.AssetCategories.Update(assetCategory);
                    await _context.SaveChangesAsync();
                    return new AssetCategoryResponse { Success = true, Message = "Asset Category Deleted Successfully" };
                }

                throw new KeyNotFoundException($"Asset Category does not exists!");
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
        public async Task<List<AssetCategoryResponseData>> GetAllAssetsCategories()
        {
            try
            {
                var assetCategory = await _context.AssetCategories.Where(a => a.IsActive).OrderByDescending(a => a.CategoryId).ToListAsync();
                return _mapper.Map<List<AssetCategoryResponseData>>(assetCategory);
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
        public async Task<AssetCategoryResponse> GetAssetCategoryById(Guid id)
        {
            try
            {
                var assetCategory = await _context.AssetCategories.AsNoTracking().FirstOrDefaultAsync(a => a.CategoryId == id);
                if (assetCategory is not null)
                {
                    var assetCategoryData = _mapper.Map<AssetCategories>(assetCategory);
                    return new AssetCategoryResponse { Success = true, AssetCategories = assetCategoryData };
                }
                throw new KeyNotFoundException($"Asset Category does not exists!");
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }
        #endregion
    }
}
