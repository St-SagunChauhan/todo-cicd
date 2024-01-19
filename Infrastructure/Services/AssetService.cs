using AutoMapper;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using ST.ERP.Helper;
using ST.ERP.Helper.Context;
using ST.ERP.Helper.Impoter_Utilites;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;

namespace ST.ERP.Infrastructure.Services
{
    public class AssetService : IAssetService
    {
        #region Fields

        private readonly STERPContext _context;
        private readonly IMapper _mapper;

        #endregion

        #region Constructor

        public AssetService(STERPContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        #endregion

        #region public methods

        public async Task<AssetsResponse> AddAsset(AssetsRequest request)
        {
            try
            {
                var asset = await _context.Assets.AsNoTracking().Include(c => c.AssetCategories).Include(a => a.AssetInventory).FirstOrDefaultAsync(a => a.AssetId == request.AssetId);
                var manufacturerAsset = _context.Manufacturers.AsNoTracking().FirstOrDefault(x => x.ManufacturerName == request.ManufacturerName);
                if (asset == null)
                {
                    request.ManufacturerName = manufacturerAsset.Id.ToString();
                    var assetData = _mapper.Map<Assets>(request);
                    assetData.AssetId = Guid.NewGuid();
                    await _context.Assets.AddAsync(assetData);

                    var assetInventory = new AssetsInventory
                    {
                        InventoryId = Guid.NewGuid(),
                        AssetId = assetData.AssetId,
                        Quantity = request.Quantity,
                        InStock = request.Quantity,
                    };
                    await _context.AssetsInventory.AddAsync(assetInventory);
                    await _context.SaveChangesAsync();

                    return new AssetsResponse { Success = true, Message = "Asset Added Successfully", Assets = assetData };
                }
                else
                {
                    request.ManufacturerName = manufacturerAsset.Id.ToString();
                    var data = _mapper.Map(request, new Assets()
                    {
                        CreatedBy = asset.CreatedBy,
                        CreatedDate = asset.CreatedDate,

                    });
                    _context.Assets.Update(data);

                    var assetsInventoryList = await _context.AssetsInventory.AsNoTracking().Where(ai => ai.AssetId == asset.AssetId).ToListAsync();

                    var largestInStock = await _context.AssetsInventory.AsNoTracking().Where(ai => ai.AssetId == asset.AssetId && ai.HandoverId != null)
                    .OrderByDescending(i => i.Quantity).FirstOrDefaultAsync();

                    int? difference = null;

                    if (largestInStock is not null)
                    {
                        difference = request.Quantity - largestInStock.InStock - 1;
                    }

                    if (assetsInventoryList.Any())
                    {
                        // Update the quantity and assetId in all matching AssetsInventory entries
                        foreach (var assetInventory in assetsInventoryList)
                        {
                            if (assetInventory.HandoverId == null)
                            {
                                assetInventory.Quantity = request.Quantity;
                                assetInventory.InStock = request.Quantity;
                            }
                            else
                            {
                                assetInventory.Quantity = request.Quantity;
                                assetInventory.InStock += difference;
                            }

                            // Update the AssetsInventory entry in the context
                            _context.AssetsInventory.Update(assetInventory);
                        }
                    }
                    await _context.SaveChangesAsync();
                    return new AssetsResponse { Success = true, Assets = data, Message = "Asset Updated Successfully" };
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<List<AssetsResponseData>> GetAllAssets(AssetsFilterRequest assetsFilterRequest)
        {
            try
            {
                var query = _context.Assets.Include(a => a.AssetInventory).Include(a => a.AssetCategories).AsNoTracking();

                if (assetsFilterRequest.CategoryId.HasValue)
                {
                    query = query.Include(a => a.AssetCategories).Where(asset => asset.CategoryId == assetsFilterRequest.CategoryId);
                }

                if (assetsFilterRequest.PurchasedDate.HasValue && assetsFilterRequest.DataRetrievalDate.HasValue)
                {
                    query = query.Include(a => a.AssetCategories)
                   .Where(asset => asset.PurchasedDate.Value.Date >= assetsFilterRequest.PurchasedDate.Value.Date &&
                    asset.PurchasedDate.Value.Date <= assetsFilterRequest.DataRetrievalDate.Value.Date);
                }

                if (!string.IsNullOrEmpty(assetsFilterRequest.ManufacturerName))
                {
                    if (assetsFilterRequest.ManufacturerName is not null)
                    {
                        var manufacturerValue = _context.Manufacturers.Where(x => x.ManufacturerName == assetsFilterRequest.ManufacturerName).First();
                        query = query.Include(a => a.AssetCategories).Where(asset => asset.ManufacturerName == manufacturerValue.Id);
                    }
                }
                var filterAssets = await query.ToListAsync();
                var allData = _mapper.Map<List<AssetsResponseData>>(filterAssets);
                foreach (var item in allData)
                {
                    if (item.ManufacturerName is not null)
                    {
                        var manufacturerName = _context.Manufacturers.AsNoTracking().FirstOrDefault(x => x.Id.ToString() == item.ManufacturerName);
                        item.ManufacturerName = manufacturerName.ManufacturerName;
                    }
                }
                return allData;
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<AssetsResponseData> GetAssetById(Guid id)
        {
            try
            {
                var asset = await _context.Assets.Include(c => c.AssetCategories).Include(a => a.AssetInventory).AsNoTracking().FirstOrDefaultAsync(a => a.AssetId == id);
                if (asset is not null)
                {
                    var assetData = _mapper.Map<AssetsResponseData>(asset);
                    var manufacturerName = _context.Manufacturers.AsNoTracking().FirstOrDefault(x=>x.Id.ToString() == assetData.ManufacturerName);
                    assetData.ManufacturerName = manufacturerName.ManufacturerName;
                    return assetData;
                }
                throw new KeyNotFoundException($"Asset does not exists!");
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<AssetsResponse> ImportAssetListFile(ImportAssetRequest model)
        {
            try
            {
                var extension = Path.GetExtension(model.File.FileName);
                if (extension.IndexOf("xls") == -1) throw new Exception("Invalid file type. Please use a valid Excel file.");
                using (var stream = new MemoryStream())
                {
                    await model.File.CopyToAsync(stream);
                    ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                    using (var package = new ExcelPackage(stream))
                    {
                        int iSheetsCount = package.Workbook.Worksheets.Count;
                        if (iSheetsCount > 0)
                        {
                            // Get the sheet by index
                            ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                            var asset = UploadExcelFile.GetExcelData<ImporterAssetLogsRequest>(worksheet);
                            var dbAssets = await _context.Assets.ToListAsync();

                            var assetList = asset.GroupBy(x => new { x.AssetName }).Select(x => x.First()).ToList();
                            foreach (var check in assetList)
                            {
                                if (dbAssets.Any(x => x.AssetName.Contains(check.AssetName)))
                                {
                                    throw new AppException($"Data already exist in the database");
                                }
                            }
                            if (assetList.Count is not 0)
                            {
                                foreach (var row in assetList)
                                {
                                    var manufacturename = _context.Manufacturers.Where(x => x.ManufacturerName == row.ManufacturerName).First();

                                    var dbAsset = new Assets
                                    {
                                        AssetName = row.AssetName,
                                        ManufacturerName = manufacturename.Id,
                                        ModelNumber = row.ModelNumber,
                                        Remarks = row.Remarks,
                                    };
                                    dbAsset.AssetInventory = new List<AssetsInventory>
                                    {
                                         new AssetsInventory
                                         {
                                             Quantity = int.TryParse(row.Quantity, out var quantity) ? quantity : default(int?),
                                         }
                                    };

                                    if (dbAsset.AssetName == null)
                                    {
                                        throw new AppException($"Asset Name not found in the excel file");
                                    }
                                    _context.Assets.AddRange(dbAsset);
                                }
                            }
                            await _context.SaveChangesAsync();
                        }
                    }
                    return new AssetsResponse { Success = true, Message = "Asset data imported Successfully" };
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<DownloadAssetReportResponse> DownloadAssetReport()
        {
            try
            {
                MemoryStream stream = new();
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using var excelFile = new ExcelPackage(stream);

                if (!excelFile.Workbook.Worksheets.Any(ar => ar.Name == "Posts"))
                    excelFile.Workbook.Worksheets.Add("Posts");
                var worksheet = excelFile.Workbook.Worksheets["Posts"];

                // headers
                worksheet.Cells[1, 1].Value = "AssetName";
                worksheet.Cells[1, 2].Value = "Quantity";
                worksheet.Cells[1, 3].Value = "ManufacturerName";
                worksheet.Cells[1, 4].Value = "ModelNumber";
                worksheet.Cells[1, 5].Value = "Remarks";

                int row = 2;

                worksheet.Cells[row, 1].Value = 0;
                worksheet.Cells[row, 2].Value = 0;
                worksheet.Cells[row, 3].Value = 0;
                worksheet.Cells[row, 4].Value = 0;
                worksheet.Cells[row, 5].Value = 0;

                row++;

                excelFile.Save();

                stream.Position = 0;
                return new DownloadAssetReportResponse() { Streams = stream, Success = true };
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }
        #endregion
    }
}
