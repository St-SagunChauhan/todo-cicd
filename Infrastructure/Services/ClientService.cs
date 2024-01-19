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
    public class ClientService : IClientService
    {
        #region Fields

        private readonly STERPContext _context;
        private readonly IMapper _mapper;
        private readonly IDepartmentService _departmentService;
        private readonly IMarketPlaceAccountService _marketplaceAccount;

        #endregion

        #region Constructor

        public ClientService(STERPContext context, IMapper mapper, IDepartmentService departmentService, IMarketPlaceAccountService marketplaceAccount)
        {
            _context = context;
            _mapper = mapper;
            _departmentService = departmentService;
            _marketplaceAccount = marketplaceAccount;
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Create Client
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<ClientResponse> UpdateClient(ClientRequest request)
        {
            try
            {
                var client = await _context.Clients.AsNoTracking().FirstOrDefaultAsync(c => c.ClientId == request.ClientId);
                var data = _mapper.Map(request, new Client()
                {
                    CreatedBy = client.CreatedBy,
                    CreatedDate = client.CreatedDate,
                    BidId = client.BidId
                });
                _context.Clients.Update(data);
                await _context.SaveChangesAsync();
                return new ClientResponse { Success = true, Message = "Client Updated Successfully!", Client = data };
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Delete Client
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<ClientResponse> DeleteClient(Guid id)
        {
            try
            {
                var client = await _context.Clients.AsNoTracking().FirstOrDefaultAsync(c => c.ClientId == id);
                if (client is not null)
                {
                    client.IsActive = false;
                    _context.Clients.Update(client);
                    await _context.SaveChangesAsync();
                    return new ClientResponse { Success = true, Message = "Client deleted successfully!" };
                }

                throw new KeyNotFoundException($"Client is not exists!");
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get Client By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<ClientResponse> GetClientById(Guid id)
        {
            try
            {
                var client = await _context.Clients
                    .AsNoTracking()
                    .Include(y => y.MarketPlaceAccounts)
                    .FirstOrDefaultAsync(c => c.ClientId == id);

                if (client is not null)
                {
                    var clientData = _mapper.Map<Client>(client);
                    return new ClientResponse { Success = true, Client = clientData, Message = "Client found" };
                }
                throw new KeyNotFoundException($"Client does not exists!");
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get Clients
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<List<ClientResponseData>?> GetClients(CustomDepartmentFilterRequest request)
        {
            try
            {
                var clients = await _context.Clients?
                    .Include(y => y.MarketPlaceAccounts)
                    .Where(x => x.IsActive).OrderByDescending(c => c.ClientId).ToListAsync();

                var allClients = _mapper.Map<List<ClientResponseData>>(clients);

                return allClients;
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<ClientResponse> ImportClientListFile(ImportClientRequest model)
        {
            try
            {
                var exceptions = new List<String>();
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
                            var client = UploadExcelFile.GetExcelData<ImporterClientLogsRequest>(worksheet);
                            var dbClients = await _context.Clients.ToListAsync();
                            var clientList = client.GroupBy(x => new { x.ClientName }).Select(x => x.First()).ToList();

                            foreach (var check in clientList)
                            {
                                if (check.ClientName == null)
                                {
                                    exceptions.Add($"Client Name not found in the excel file");
                                }
                                if (!dbClients.Any(x => x.ClientName.Contains(check.ClientName)))
                                {
                                    var deptName = _context.Departments
                                        .Where(x => x.DepartmentName == check.DepartmentName)
                                        .FirstOrDefault();

                                    var someMarketPlaceAccountObject = _context.MarketPlaceAccounts
                                        .Where(x => x.Name == check.MarketPlaceAccountName)
                                        .FirstOrDefault();

                                    var dbClient = new Client
                                    {
                                        ClientName = check.ClientName,
                                        ClientEmail = check.Email,
                                        Country = check.Country,
                                        Accounts = check.AccountType,
                                        IsActive = true
                                    };

                                    dbClient.MarketPlaceAccounts = someMarketPlaceAccountObject;


                                    _context.Clients.Add(dbClient);
                                }
                                else
                                {
                                    exceptions.Add($"{check.ClientName} already exists in the database.");
                                }
                            }
                            await _context.SaveChangesAsync();
                        }
                    }
                    if (exceptions.Any())
                    {
                        var errors = string.Join(". ", exceptions.ToArray());
                        return new ClientResponse { Success = true, Message = $"Partial Client data successfully imported. Errors; {errors}" };
                    }
                    else
                    {
                        return new ClientResponse { Success = true, Message = "Client data imported Successfully" };
                    }
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        #endregion

        #region Download Client Excel Sample
        public async Task<ClientsSampleExcelResponse> DownloadClientSampleExcel()
        {
            try
            {
                MemoryStream stream = new();
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using var excelFile = new ExcelPackage(stream);
                {
                    #region Main Sheet
                    ExcelWorksheet mainSheet = excelFile.Workbook.Worksheets.Add("MainSheet");
                    var row = 1;
                    mainSheet.Cells[row, 1].Value = "Client Name";
                    mainSheet.Cells[row, 2].Value = "Department Name";
                    mainSheet.Cells[row, 3].Value = "MarketPlaceAccountName";
                    mainSheet.Cells[row, 4].Value = "Account Type";
                    mainSheet.Cells[row, 5].Value = "Email";
                    mainSheet.Cells[row, 7].Value = "Country";
                    mainSheet.Cells["B2"].Value = "Please Select DepartmentName From DepartmentSheet";
                    mainSheet.Cells["C2"].Value = "Please Select MarketPlaceAccountName From MarketPlaceAccountSheet";
                    mainSheet.Cells["D2"].Value = "Agency";
                    mainSheet.Cells["D3"].Value = "Freelancer";
                    #endregion

                    #region Department Sheet
                    ExcelWorksheet departmentSheet = excelFile.Workbook.Worksheets.Add("DepartmentSheet");
                    var departments = await _departmentService.GetDepartments();
                    int deptRow = 2;
                    departmentSheet.Cells[1, 1].Value = "DepartmentName";
                    for (int i = 0; i < departments.Count; i++)
                    {
                        departmentSheet.Cells[deptRow, 1].Value = departments[i].DepartmentName;
                        deptRow++;

                    }
                    #endregion

                    #region Market Place Sheet
                    ExcelWorksheet marketPlaceAccountSheet = excelFile.Workbook.Worksheets.Add("MarketPlaceAccountSheet");
                    var marketPlaceAccountsData = await _marketplaceAccount.GetMarketPlaceAccounts();
                    int markRow = 2;
                    marketPlaceAccountSheet.Cells[1, 1].Value = "MarketPlaceAccountName";
                    for (int i = 0; i < marketPlaceAccountsData.Count; i++)
                    {
                        marketPlaceAccountSheet.Cells[markRow, 1].Value = marketPlaceAccountsData[i].Name;
                        markRow++;

                    }
                    #endregion
                    excelFile.Save();
                    stream.Position = 0;
                }
                return new ClientsSampleExcelResponse() { Streams = stream, Success = true };
            }


            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }

        }
        #endregion
    }
}
