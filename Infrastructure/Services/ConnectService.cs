using AutoMapper;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using ST.ERP.Helper;
using ST.ERP.Helper.Context;
using ST.ERP.Helper.Impoter_Utilites;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;
using System.Reflection;
using static ST.ERP.Helper.Enums;

namespace ST.ERP.Infrastructure.Services
{
    public class ConnectService : IConnectService
    {
        #region Fields
        private readonly STERPContext _context;
        private readonly IMapper _mapper;
        private readonly IDepartmentService _departmentService;
        private readonly IMarketPlaceAccountService _marketplaceAccount;
        private readonly IEmployeeService _employeeService;
        private readonly ClaimsUtility _claimsUtility;
        #endregion

        #region Constructor
        public ConnectService(IEmployeeService employeeService, STERPContext context, IMapper mapper,
            ClaimsUtility claimsUtility, IDepartmentService departmentService, IMarketPlaceAccountService marketplaceAccount)
        {
            _context = context;
            _mapper = mapper;
            _claimsUtility = claimsUtility;
            _departmentService = departmentService;
            _marketplaceAccount = marketplaceAccount;
            _employeeService = employeeService;
        }
        #endregion

        #region Public Method

        /// <summary>
        /// Create Connect
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<ConnectResponse> CreateConnect(ConnectRequest request)
        {
            try
            {
                var connect = await _context.Connects.AsNoTracking()
                    .Include(m => m.MarketPlaceAccount)
                    .Include(e => e.Employees)
                    .FirstOrDefaultAsync(c => c.ConnectId == request.ConnectId);
                var connectStatus = await _context.ConnectStatus.AsNoTracking().FirstOrDefaultAsync(x => x.ConnectStatusName == request.ConnectStatus);

                if (connect == null)
                {
                    request.ConnectStatus = connectStatus.Id.ToString();
                    var connectData = _mapper.Map<Connect>(request);
                    await _context.Connects.AddAsync(connectData);
                    await _context.SaveChangesAsync();
                    return new ConnectResponse { Success = true, Message = "Connect Created Successfully" };
                }
                else
                {
                    var connectTypes = await _context.ConnectStatus.AsNoTracking().FirstOrDefaultAsync(x => x.ConnectStatusName == request.ConnectStatus);
                    request.ConnectStatus = connectTypes.Id.ToString();
                    var connectData = _mapper.Map(request, new Connect()
                    {
                        CreatedBy = connect.CreatedBy,
                        CreatedDate = connect.CreatedDate,
                    });
                    _context.Connects.Update(connectData);
                    await _context.SaveChangesAsync();
                    return new ConnectResponse { Success = true, Message = "Connect Updated Successfully" };
                }
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
        public async Task<ConnectResponse> DeleteConnect(Guid id)
        {
            try
            {
                var connect = await _context.Connects.AsNoTracking().FirstOrDefaultAsync(c => c.ConnectId == id);
                if (connect is not null)
                {
                    _context.Connects.Update(connect);
                    await _context.SaveChangesAsync();
                    return new ConnectResponse { Success = true, Message = "Connect Removed Successfully" };
                }

                throw new KeyNotFoundException($"Connect is not exists!");
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
        public async Task<List<ConnectResponseData>?> GetAllConnects(CustomDepartmentFilterRequest request)
        {
            try
            {
                var query = request.DepartmentId is not null ?
                    _context.Connects.Include(e => e.Employees).Include(d => d.Department)
                    .Include(m => m.MarketPlaceAccount).Where(x => x.DepartmentId == request.DepartmentId).AsQueryable()
                    :
                    _context.Connects.Include(e => e.Employees).Include(d => d.Department)
                    .Include(m => m.MarketPlaceAccount).AsQueryable();

                var connectList = _mapper.Map<List<ConnectResponseData>>(query);
                connectList.ForEach(connect => connect.ConnectStatus = _context.ConnectStatus.AsNoTracking()
                    .FirstOrDefault(x => x.Id.ToString() == connect.ConnectStatus)?.ConnectStatusName);
                var filteredConnects = connectList.Where(x => x.DepartmentId == _claimsUtility.GetDepartmentIdFromClaims()).ToList();
                return _claimsUtility.GetUserRoleFromClaims() is nameof(Role.Admin) ? connectList : filteredConnects;
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
        public async Task<ConnectResponse> GetConnectById(Guid id)
        {
            try
            {
                var connectList = new ConnectResponseData();
                //TODO: Create relation between Connect and ConnectStatus
                var connect = await _context.Connects.AsNoTracking().Include(d => d.Department).Include(e => e.Employees)
                    .FirstOrDefaultAsync(p => p.ConnectId == id);
                if (connect is not null)
                {
                    var data = _mapper.Map(connect, new ConnectResponseData()
                    {
                        EmployeeId = connect.Employees.EmployeeId,
                        FirstName = connect.Employees.FirstName,
                        LastName = connect.Employees.LastName,
                        DepartmentId = connect.Department.DepartmentId,
                        DepartmentName = connect.Department.DepartmentName,
                        MarketPlaceAccountId = connect.MarketPlaceAccountId,
                        JobUrl = connect.JobUrl,
                    });
                    var statusType = _context.ConnectStatus.AsNoTracking().FirstOrDefault(x => x.Id.ToString() == data.ConnectStatus);
                    data.ConnectStatus = statusType.ConnectStatusName;

                    return new ConnectResponse { Success = true, ConnectModel = data, Message = "Connect found successfully" };
                }

                throw new KeyNotFoundException($"Connect is not exists!");
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get All Connects By Dates
        /// </summary>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<List<Connect>> GetAllConnectsByDates(DateTime startDate, DateTime endDate)
        {
            try
            {
                return await _context.Connects
                    .Include(x => x.Department).Include(e => e.Employees)
                    .Where(c => c.Connect_Date >= startDate && c.Connect_Date <= endDate)
                    .OrderByDescending(c => c.ConnectId).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<ConnectsHistroyResponse> ImportConnectsHistoryFile(ConnectsHistroyRequest model)
        {
            try
            {
                var extension = Path.GetExtension(model.File.FileName);
                if (extension.IndexOf("xls") == -1) { throw new Exception("Invalid file type. Please use a valid file"); }
                var connectHistoryList = _context.Connects.AsTracking().ToList();

                using var stream = new MemoryStream();
                await model.File.CopyToAsync(stream);
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                using (var package = new ExcelPackage(stream))
                {
                    int iSheetsCount = package.Workbook.Worksheets.Count;
                    if (iSheetsCount > 0)
                    {
                        // Get the sheet by index
                        ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                        var connectsHistroy = UploadExcelFile.GetExcelData<ImporterConnectsHistroyRequest>(worksheet);
                        if (connectsHistroy.Count is not 0)
                        {
                            var connectsHistroyDAO = _mapper.Map<List<ConnectsHistroy>>(connectsHistroy);
                            _context.ConnectsHistroy.AddRange(connectsHistroyDAO);
                            await _context.SaveChangesAsync();
                        }
                        else
                        {
                            throw new AppException("File Doesn't contain Data!");
                        }
                    }
                }

                return new ConnectsHistroyResponse { Success = true, Message = "connect History data imported successfully !" };

            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<List<ConnectsHistroy>> GetConnectsHistroy(CustomCreateDateFilterRequest request)
        {
            var ConnectsHistroyList = new List<ConnectsHistroy>();
            DateTime today = DateTime.Now;
            var ConnectsHistroyData = (request.CreatedDate is not null && request.EndDate is not null) ? await _context.ConnectsHistroy.Where(x => x.CreatedDate >= request.CreatedDate && x.CreatedDate <= request.EndDate).ToListAsync()
            : await _context.ConnectsHistroy.Where(x => x.CreatedDate == today.Date).ToListAsync();

            if (ConnectsHistroyData.Count > 0)
            {
                var dataList = ConnectsHistroyData.Select(x => new ConnectsHistroy()
                {
                    Id = x.Id,
                    PurchasedDate = x.PurchasedDate,
                    NumberConnects = x.NumberConnects,
                    Price = x.Price,
                    UpworkID = x.UpworkID,
                    Department = x.Department,
                    ConnectUsed = x.ConnectUsed,
                });
                ConnectsHistroyList.AddRange(dataList);
            }
            return ConnectsHistroyList;
        }

        public async Task<ConnectResponse> ImportConnectReport(ConnectImportRequest model)
        {
            try
            {
                var extension = Path.GetExtension(model.File.FileName);
                if (extension.IndexOf("xls") == -1) { throw new Exception("Invalid file type. Please use a valid file"); }
                var connectHistoryList = _context.Connects.AsTracking().ToList();

                using (var stream = new MemoryStream())
                {
                    await model.File.CopyToAsync(stream);
                    ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                    try
                    {
                        using (var package = new ExcelPackage(stream))
                        {
                            int iSheetsCount = package.Workbook.Worksheets.Count;
                            if (iSheetsCount > 0)
                            {
                                // Get the sheet by index
                                ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                                var connects = UploadExcelFile.GetExcelData<ImporterConnectRequest>(worksheet);
                                if (connects.Count is not 0)
                                {
                                    for (int j = 0; j < connects.Count; j++)
                                    {
                                        var departmentId = _context.Departments.AsNoTracking().Where(x => x.DepartmentName == connects[j].DepartmentName && x.IsActive == true)
                                        .Select(x => x.DepartmentId).FirstOrDefault();
                                        if (departmentId == Guid.Empty)
                                        {
                                            throw new AppException("DepartmentName can't be empty or wrong!");
                                        }
                                        var marketPlaceAccountId = _context.MarketPlaceAccounts.AsNoTracking().Where(x => x.Name == connects[j].MarketPlaceAccountName && x.IsActive == true)
                                        .Select(x => x.Id).FirstOrDefault();
                                        if (marketPlaceAccountId == Guid.Empty)
                                        {
                                            throw new AppException("MarketPlaceAccountName can't be empty or wrong!");
                                        }
                                        var employeeId = _context.Employees.AsNoTracking().Where(x => x.Email == connects[j].EmployeeEmail && x.IsActive == true)
                                        .Select(x => x.EmployeeId).FirstOrDefault();
                                        if (employeeId == Guid.Empty)
                                        {
                                            throw new AppException("Employee Email can't be empty or wrong!");
                                        }
                                        var connectStatus = _context.ConnectStatus.Where(x => x.ConnectStatusName == connects[j].ConnectStatus).First();
                                        var connect = new Connect
                                        {
                                            Connect_Date = Convert.ToDateTime(connects[j]?.Connect_Date),
                                            JobUrl = connects[j]?.JobUrl,
                                            ConnectUsed = Convert.ToInt32(connects[j]?.ConnectUsed),
                                            ConnectStatus = connects[j]?.ConnectStatus is not null ? connectStatus.Id : _context.ConnectStatus.First(x => x.Id == 1).Id,
                                            DepartmentId = departmentId,
                                            MarketPlaceAccountId = marketPlaceAccountId,
                                            DealsWon = Convert.ToInt32(connects[j].DealsWon),
                                            MarketingQualifiedLeads = Convert.ToInt32(connects[j].MarketingQualifiedLeads),
                                            SalesQualifiedLeads = Convert.ToInt32(connects[j].SalesQualifiedLeads),
                                            Technology = connects[j].Technology,
                                            EmployeeId = employeeId,
                                        };
                                        // var connectsDAO = _mapper.Map<List<Connect>>(connect);
                                        _context.Connects.AddRange(connect);
                                        await _context.SaveChangesAsync();
                                    }
                                }
                            }

                            return new ConnectResponse { Success = true, Message = "Connects imported successfully!" };

                        }
                    }
                    catch (Exception ex)
                    {

                        throw new AppException(ex.Message);
                    }

                }

            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }
        #endregion
        #region Download Connects Excel Sample
        public async Task<ConnectsSampleExcelResponse> DownloadConnectsSampleExcel()
        {
            try
            {
                MemoryStream stream = new();
                var connect = _context.Connects.Include(e => e.Employees).Include(d => d.Department).Include(m => m.MarketPlaceAccount).FirstOrDefault();
                if (connect is not null)
                {
                    var connectList = _mapper.Map<ConnectResponseData>(connect);
                    PropertyInfo[] properties = connectList.GetType().GetProperties();
                    var selectedPropertyNames = properties
                    .Where(p => p.Name == "ConnectStatus" || p.Name == "ConnectUsed"
                                || p.Name == "Connect_Date" || p.Name == "DealsWon"
                                || p.Name == "DepartmentName" || p.Name == "JobUrl"
                                || p.Name == "MarketPlaceAccountName" || p.Name == "MarketingQualifiedLeads"
                                || p.Name == "SalesQualifiedLeads" || p.Name == "Technology")
                    .Select(p => p.Name)
                    .ToList();
                    //var result = CreateExcelFileHeader.ExcelFileHeader(selectedPropertyNames, stream);
                    ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                    using var excelFile = new ExcelPackage(stream);
                    {
                        #region Main Sheet
                        ExcelWorksheet mainSheet = excelFile.Workbook.Worksheets.Add("MainSheet");


                        for (int i = 0; i < selectedPropertyNames.Count; i++)
                        {
                            mainSheet.Cells[1, i + 1].Value = selectedPropertyNames[i];
                        }
                        mainSheet.Cells[2, 2].Value = "yyyy/mm/dd";
                        mainSheet.Cells[2, 3].Value = "Please Select DepartmentName From DepartmentSheet";
                        mainSheet.Cells[2, 4].Value = "Please Select MarketPlaceAccountName From MarketPlaceAccountSheet";
                        mainSheet.Cells[2, 5].Value = "Applied";
                        mainSheet.Cells[3, 5].Value = "Lead";
                        mainSheet.Cells[4, 5].Value = "Hired";
                        mainSheet.Cells[1, 11].Value = "Employee Name";
                        mainSheet.Cells[2, 11].Value = "Please Select Employee Name From BDEmployeeSheet";
                        mainSheet.Cells[1, 12].Value = "Employee Email";
                        mainSheet.Cells[2, 11].Value = "Please Select Employee Email From BDEmployeeSheet";
                        #endregion

                        #region Department Sheet
                        ExcelWorksheet departmentSheet = excelFile.Workbook.Worksheets.Add("DepartmentSheet");
                        var departments = await _departmentService.GetDepartments();
                        int deptRow = 2;
                        departmentSheet.Cells[1, 1].Value = "Department Name";
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
                        marketPlaceAccountSheet.Cells[1, 1].Value = "MarketPlaceAccounts Name";
                        for (int i = 0; i < marketPlaceAccountsData.Count; i++)
                        {
                            marketPlaceAccountSheet.Cells[markRow, 1].Value = marketPlaceAccountsData[i].Name;
                            markRow++;

                        }
                        #endregion
                        #region BD Emplooyee Sheet
                        ExcelWorksheet bdEmployeeSheet = excelFile.Workbook.Worksheets.Add("BDEmployeeSheet");
                        CustomDepartmentFilterRequest request = new CustomDepartmentFilterRequest();
                        var departmentId = _context.Departments.AsNoTracking().Where(x => x.DepartmentName == "Business Development" && x.IsActive == true)
                                    .Select(x => x.DepartmentId).FirstOrDefault();
                        request.DepartmentId = departmentId;
                        var bdEmployees = await _employeeService.GetEmployees(request);
                        int eRow = 2;
                        bdEmployeeSheet.Cells[1, 1].Value = "BD Employee Name";
                        bdEmployeeSheet.Cells[1, 2].Value = "BD Employee Email";
                        for (int i = 0; i < bdEmployees.Count; i++)
                        {
                            bdEmployeeSheet.Cells[eRow, 1].Value = bdEmployees[i].FirstName + " " + bdEmployees[i].LastName;
                            bdEmployeeSheet.Cells[eRow, 2].Value = bdEmployees[i].Email;
                            eRow++;

                        }
                        #endregion
                        excelFile.Save();
                        stream.Position = 0;
                    }
                }
                return new ConnectsSampleExcelResponse() { Streams = stream, Success = true };
            }


            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }

        }
        #endregion

        public async Task<List<ConnectsResponseData>> GetAllConnects()
        {
            try
            {
                var connects = await _context.Connect.AsNoTracking()
                .OrderByDescending(p => p.CreatedDate)
                .ToListAsync();

                var connectList = _mapper.Map<List<ConnectsResponseData>>(connects);
                foreach (var item in connectList)
                {
                    item.AccountType = _context.AccountTypes
                        .Where(x => x.Id == int.Parse(item.AccountType))
                        .First()
                        .AccountTypesName;
                }

                return connectList;
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<ConnectsResponse> CreateConnects(ConnectsRequest request)
        {
            if (await _context.Connect.AsNoTracking().FirstOrDefaultAsync(c => c.Id == request.Id) == null)
            {
                var data = _mapper.Map<Connects>(request);
                await _context.Connect.AddAsync(data);

                await _context.SaveChangesAsync();
            }

            return new ConnectsResponse { Success = true, Message = "Connects Added Successfully!" };
        }

        public async Task<ConnectsImportResponse> ImportConnectsFile(ConnectsImportRequest request)
        {
            try
            {
                var extension = Path.GetExtension(request.File.FileName);
                if (!extension.Contains("xls"))
                {
                    throw new Exception("Invalid file type. Please use a valid file");
                }

                var connectsList = await _context.Connect.AsTracking().ToListAsync();

                using var stream = new MemoryStream();
                await request.File.CopyToAsync(stream);
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                using (var package = new ExcelPackage(stream))
                {
                    int sheetCount = package.Workbook.Worksheets.Count;
                    if (sheetCount > 0)
                    {
                        // Get the sheet by index
                        ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                        var connects = UploadExcelFile.GetExcelData<ConnectsImportHistoryRequest>(worksheet);

                        if (connects.Count is 0)
                        {
                            throw new AppException("File doesn't contain data!");
                        }
                        foreach (var item in connects)
                        {
                            item.AccountType = _context.AccountTypes
                                .FirstOrDefault(x => x.AccountTypesName == item.AccountType)
                                ?.Id.ToString();
                        }

                        var connectsDAO = _mapper.Map<List<Connects>>(connects);

                        foreach (Connects item in connectsDAO)
                        {
                            DateTime dateOfPurchase = (DateTime)item.DateOfPurchase;
                            var existingConnect = connectsList.FirstOrDefault(x =>
                                x.AccountType == item.AccountType &&
                                x.DateOfPurchase.HasValue &&
                                x.DateOfPurchase.Value.ToString("yyyy-MM-dd") == dateOfPurchase.ToString("yyyy-MM-dd"));

                            if (existingConnect != null)
                            {
                                existingConnect.NumberOfConnects = item.NumberOfConnects;
                                existingConnect.Amount = item.Amount;
                                existingConnect.LastModifiedBy = _claimsUtility.GetEmployeeIdFromClaims();
                                existingConnect.LastModified = DateTime.Now;
                                _context.Connect.Update(existingConnect);
                                await _context.SaveChangesAsync();
                            }
                            else
                            {
                                item.CreatedBy = _claimsUtility.GetEmployeeIdFromClaims();
                                item.CreatedDate = DateTime.Now;
                                _context.Connect.Add(item);
                                await _context.SaveChangesAsync();
                            }
                        }
                    }
                }

                return new ConnectsImportResponse { Success = true, Message = "Connects data imported successfully!" };
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }
    }
}
