using AutoMapper;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using ST.ERP.Helper;
using ST.ERP.Helper.Context;
using ST.ERP.Helper.Impoter_Utilites;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Models.CustomModels;
using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;
using System.Globalization;
using static ST.ERP.Helper.Enums;

namespace ST.ERP.Infrastructure.Services
{
    public class HandoverAssetService:IHandoverAssetService
    {
        #region Fields

        private readonly STERPContext _context;
        private readonly IMapper _mapper;

        #endregion

        #region Constructor

        public HandoverAssetService(STERPContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        #endregion

        #region Public Methods

        public async Task<HandoverAssetResponse> AddHandoverAssetRecord(HandoverAssetsRequest request)
        {
            try
            {
                foreach (var assetId in request.AssetIds)
                {
                    var asset = await _context.Assets.AsNoTracking().Include(c => c.AssetCategories).FirstOrDefaultAsync(a => a.AssetId == assetId);

                    int assignedAssetCount = await _context.HandoverAsset.Where(asset => asset.AssetId == assetId).CountAsync();

                    var inventory = await _context.AssetsInventory.AsNoTracking().OrderByDescending(a => a.CreatedDate).FirstOrDefaultAsync();

                    inventory.InStock = assignedAssetCount > 0 ? inventory.InStock - 1 : inventory.Quantity - 1;

                    if (inventory.InStock < 0)
                    {
                        throw new AppException("Asset assignment is not feasible as there is an insufficient stock available for allocation.");
                    }

                    var handoverAssetData = _mapper.Map<HandoverAsset>(request);
                    handoverAssetData.HandoverId = Guid.NewGuid();
                    handoverAssetData.AssetId = assetId;
                    handoverAssetData.HandoverStatus = 1;
                    await _context.HandoverAsset.AddAsync(handoverAssetData);
                    await _context.SaveChangesAsync();

                    var assetInventory = new AssetsInventory
                    {
                        InventoryId = Guid.NewGuid(),
                        AssetId = assetId,
                        HandoverId = handoverAssetData.HandoverId,
                        InStock = inventory.InStock,
                        Quantity = inventory.Quantity
                    };
                    await _context.AssetsInventory.AddAsync(assetInventory);
                    await _context.SaveChangesAsync();
                }
                return new HandoverAssetResponse { Success = true, Message = "Asset Handovered Successfully " };
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<HandoverAssetResponse> UpdateHandoverAssetRecord(UpdateHandoverAssetRequest updateRequest)
        {
            try
            {
                var handoverAsset = await _context.HandoverAsset.AsNoTracking().Include(e => e.Employee).Include(a => a.Assets).FirstOrDefaultAsync(a => a.HandoverId == updateRequest.HandoverId);

                var inventory = await _context.AssetsInventory.AsNoTracking().Include(a => a.Assets).FirstOrDefaultAsync(a => a.AssetId == updateRequest.AssetId);

                using var transaction = await _context.Database.BeginTransactionAsync();

                if (handoverAsset is not null)
                {
                    // Make modifications to the entity
                        _context.Database.ExecuteSqlRaw("UPDATE HandoverAsset SET AssetId = @AssetId, EmployeeId = @EmployeeId, AssignedDate = @AssignedDate, IdentificationNumber = @IdentificationNumber WHERE HandoverId = @id",
                        new Microsoft.Data.SqlClient.SqlParameter("@AssetId", updateRequest.AssetId),
                        new Microsoft.Data.SqlClient.SqlParameter("@EmployeeId", updateRequest.EmployeeId),
                        new Microsoft.Data.SqlClient.SqlParameter("@AssignedDate", updateRequest.AssignedDate),
                        new Microsoft.Data.SqlClient.SqlParameter("@IdentificationNumber", updateRequest.IdentificationNumber),
                        new Microsoft.Data.SqlClient.SqlParameter("@id", handoverAsset.HandoverId));

                    if (inventory is not null && handoverAsset.AssetId != updateRequest.AssetId)
                    {
                        int assignedAssetCount = await _context.HandoverAsset.Where(asset => asset.AssetId == updateRequest.AssetId).CountAsync();

                        inventory.InStock = assignedAssetCount > 0 ? inventory.InStock - 1 : inventory.Quantity - 1;

                        // Check if the values are negative
                        if (inventory.Quantity < 0 || inventory.InStock < 0)
                        {
                            throw new AppException("Asset assignment is not feasible as there is an insufficient stock available for allocation.");
                        }
                        else
                        {
                            _context.AssetsInventory.Update(inventory);
                        }
                    }

                    await transaction.CommitAsync();
                    await _context.SaveChangesAsync();
                }
                return new HandoverAssetResponse { Success = true, Message = "Asset Updated Handovered Successfully ", HandoverAssets = handoverAsset };
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<HandoverAssetResponse> DeleteHandoverAssetResponse(Guid id)
        {
            try
            {
                var assetsToDisable = await _context.HandoverAsset.AsNoTracking().Include(a => a.AssetInventory)
                .FirstOrDefaultAsync(a => a.HandoverId == id);

                var inventoryToRemove = await _context.AssetsInventory.AsNoTracking().FirstOrDefaultAsync(h => h.HandoverId == assetsToDisable.HandoverId);

                var otherEntries = await _context.AssetsInventory.AsNoTracking()
                .Where(a => a.AssetId == assetsToDisable.AssetId && a.HandoverAsset.HandoverStatus == 1)
                .ToListAsync();

                if (assetsToDisable is not null)
                {
                    string sql = "UPDATE dbo.HandoverAsset SET HandoverStatus = @Status WHERE HandoverId = @Id";

                    var statusParam = new Microsoft.Data.SqlClient.SqlParameter("@Status", "Int");
                    statusParam.Value = 1;

                    var idParam = new Microsoft.Data.SqlClient.SqlParameter("@Id", "UniqueIdentifier");
                    idParam.Value = assetsToDisable.HandoverId;

                    _context.Database.ExecuteSqlRaw(sql, statusParam, idParam);

                    

                    if(inventoryToRemove.InStock == 0)
                    {
                        _context.AssetsInventory.Remove(inventoryToRemove);
                    }
                    else
                    {
                        foreach (var entry in otherEntries.Where(e => e.InStock < inventoryToRemove.InStock))
                        {
                            entry.InStock += 1;
                            _context.AssetsInventory.Update(entry);
                        }
                        _context.AssetsInventory.Remove(inventoryToRemove);
                    }

                    await _context.SaveChangesAsync();

                    return new HandoverAssetResponse { Success = true, Message = "Disabled HandoverAsset Successfully" };
                }
                throw new AppException($"Asset is not handovered to any employee");
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<List<HandoverAssetResponseData>> GetAllHandoverAssetsRecords(HandoverFilterRequest handoverFilterRequest)
        {
            try
            {
                var query = _context.HandoverAsset
                    .Include(a => a.Assets)
                    .Include(a => a.AssetInventory)
                    .Include(a => a.Employee)
                    .AsNoTracking();

                if (handoverFilterRequest.AssetId.HasValue) 
                { 
                    query = query.Where(asset => asset.AssetId == handoverFilterRequest.AssetId);
                }

                if (handoverFilterRequest.EmployeeId.HasValue)
                {
                    query = query.Where(asset => asset.EmployeeId == handoverFilterRequest.EmployeeId);
                }

                if (handoverFilterRequest.AssignedDate.HasValue && handoverFilterRequest.DataRetreivalDate.HasValue)
                {
                    query = query.Where(asset => asset.AssignedDate.Value.Date >= handoverFilterRequest.AssignedDate.Value.Date
                    && asset.AssignedDate.Value.Date <= handoverFilterRequest.DataRetreivalDate.Value.Date);
                }

                if (handoverFilterRequest.HandoverStatus == null || handoverFilterRequest.HandoverStatus == "1")
                {
                    query = query.Where(asset => asset.HandoverStatus == 1);
                }
                else
                {
                    query = query.Where(asset => asset.HandoverStatus == 2);
                }

                var filteredHandoverAssets = await query.ToListAsync();

                var handoverAssetData = _mapper.Map<List<HandoverAssetResponseData>>(filteredHandoverAssets);
                return handoverAssetData;
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }

        }

        public async Task<HandoverAssetResponse> GetHandoverAssetResponseById(Guid id)
        {
            try
            {
                var handoverAsset = await _context.HandoverAsset.AsNoTracking()
                .Include(a => a.Assets).Where(a => a.HandoverStatus == 1)
                .FirstOrDefaultAsync(a => a.HandoverId == id);

                if (handoverAsset is not null)
                {
                    var handoverAssetData = _mapper.Map<HandoverAsset>(handoverAsset);
                    return new HandoverAssetResponse { Success = true, Message = "Handovered Asset founded successfully", HandoverAssets = handoverAssetData };
                }
                throw new AppException("Handovered Asset not found");
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<HandoverAssetResponse> ImportHandoverAssetListFile(ImportHandoverAssetRequest model)
        {
            try
            {
                var extension = Path.GetExtension(model.File.FileName);
                if (extension.IndexOf("xls") == -1) { throw new Exception("Invalid file type. Please use a valid Excel file."); }
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
                            var handoverAsset = UploadExcelFile.GetExcelData<ImporterHandoverAssetLogsRequest>(worksheet);
                            var dbHandoverAssets = await _context.HandoverAsset.ToListAsync();

                            var handoverAssetList = handoverAsset.GroupBy(x => new { x.AssetName }).Select(x => x.First()).ToList(); 

                            if (handoverAssetList.Count is not 0)
                            {
                                foreach (var row in handoverAssetList)
                                {
                                    var parts = row.AssignedTo.Split(' ');
                                    var handoverAssets = _context.HandoverStatusTypes.Where(x => x.HandoverStatusTypesName == row.HandoverStatus).First();
                                    var dbHandoverAsset = new HandoverAsset
                                    {
                                        Assets = new Assets
                                        {
                                            AssetName = row.AssetName,
                                        },
                                        AssetInventory = new List<AssetsInventory>
                                        {
                                            new AssetsInventory
                                            {
                                                Quantity = int.TryParse(row.Quantity, out var quantity) ? quantity : default(int?),
                                                InStock = int.TryParse(row.InStock, out var inStock) ? inStock : default(int?),
                                            }
                                        },
                                        Employee = new Employee
                                        {
                                            FirstName = parts[0],
                                            LastName = parts[1],
                                        },
                                        IdentificationNumber = row.IdentificationNumber,
                                        HandoverStatus = handoverAssets.Id,
                                        AssignedDate = DateTime.TryParseExact(row.AssignedDate,"yyyy-mm-dd",null, DateTimeStyles.None, out var parsedDate) ? parsedDate : (DateTime?)null,
                                    };

                                    if (dbHandoverAsset.Assets.AssetName == null)
                                    {
                                        throw new AppException($"Asset Name not found in the excel file");
                                    }
                                    _context.HandoverAsset.AddRange(dbHandoverAsset);
                                }
                            }
                            await _context.SaveChangesAsync();
                        }
                    }
                    return new HandoverAssetResponse { Success = true, Message = "Asset data imported Successfully" };
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<DownloadAssetReportResponse> DownloadHandoverAssetReport()
        {
            try
            {
                MemoryStream stream = new();
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using var excelFile = new ExcelPackage(stream);

                if (!excelFile.Workbook.Worksheets.Any(ar => ar.Name == "Posts"))
                {
                    excelFile.Workbook.Worksheets.Add("Posts");
                }
                   
                var worksheet = excelFile.Workbook.Worksheets["Posts"];

                // headers
                worksheet.Cells[1, 1].Value = "AssetName";
                worksheet.Cells[1, 2].Value = "Quantity";
                worksheet.Cells[1, 3].Value = "AssignedTo";
                worksheet.Cells[1, 4].Value = "InStock";
                worksheet.Cells[1, 5].Value = "HandoverStatus";
                worksheet.Cells[1, 6].Value = "AssignedDate";
                worksheet.Cells[1, 7].Value = "IdentificationNumber";

                int row = 2;

                worksheet.Cells[row, 1].Value = "";
                worksheet.Cells[row, 2].Value = 0;
                worksheet.Cells[row, 3].Value = "";
                worksheet.Cells[row, 4].Value = 0;
                worksheet.Cells[row, 5].Value = "";
                worksheet.Cells[row, 6].Value = "";
                worksheet.Cells[row, 7].Value = "";

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
