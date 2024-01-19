using AutoMapper;
using ST.ERP.Helper.Context;
using ST.ERP.Helper;
using ST.ERP.Models.DTO;
using ST.ERP.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;
using ST.ERP.Models.DAO;
using static ST.ERP.Helper.Enums;
using OfficeOpenXml;
using ST.ERP.Helper.Impoter_Utilites;

namespace ST.ERP.Infrastructure.Services
{
    public class ProjectBillingService : IProjectBillingService
    {
        #region Fields
        private readonly STERPContext _context;
        private readonly IMapper _mapper;
        private readonly IDepartmentService _departmentService;
        private readonly IMarketPlaceAccountService _marketplaceAccount;
        private readonly ClaimsUtility _claimsUtility;
        #endregion

        #region Constructor
        public ProjectBillingService(STERPContext context, IMapper mapper, ClaimsUtility claimsUtility, IDepartmentService departmentService, IMarketPlaceAccountService marketPlaceAccountService)
        {
            _context = context;
            _mapper = mapper;
            _claimsUtility = claimsUtility;
            _departmentService = departmentService;
            _marketplaceAccount = marketPlaceAccountService;
        }
        #endregion

        #region Public Method

        /// <summary>
        /// Add Projects Billing Details
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<ProjectBillingResponse> AddProjectBilling(ProjectBillingDataRequest request)
        {
            try
            {
                if (request.StartDate > DateTime.Now)
                {
                    throw new AppException($"Projects Billing start date cannot be a future date!");
                }
                var projectBilling = await _context.ProjectBillings.AsNoTracking().FirstOrDefaultAsync(p => p.BillingId == request.BillingId);

                var dbProjectBilling = await _context.ProjectBillings.AsNoTracking().Where(x => x.ProjectId == request.ProjectId
                && x.DepartmentId == request.DepartmentId && x.StartDate == request.StartDate
                && x.EndDate == request.EndDate && x.IsActive == true).ToListAsync();

                if (projectBilling == null)
                {
                    if (dbProjectBilling.Count > 0)
                    {
                        throw new AppException($"Projects Billing for same dates already exist");
                    }
                    else
                    {
                        var projectBillingData = _mapper.Map<ProjectBilling>(request);
                        await _context.ProjectBillings.AddAsync(projectBillingData);
                        await _context.SaveChangesAsync();
                    }
                    return new ProjectBillingResponse { Success = true, Message = "Projects Billing Details added successfully" };
                }
                else
                {
                    var projectBillingData = _mapper.Map(request, new ProjectBilling()
                    {
                        CreatedBy = projectBilling.CreatedBy,
                        CreatedDate = projectBilling.CreatedDate,
                        HoursBilled = projectBilling.HoursBilled,
                    });

                    _context.ProjectBillings.Update(projectBillingData);
                    await _context.SaveChangesAsync();
                    return new ProjectBillingResponse { Success = true, Message = "Projects Billing Details updated successfully" };
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Delete Projects Billing
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<ProjectBillingResponse> DeleteProjectBilling(Guid id)
        {
            try
            {
                var projectBilling = await _context.ProjectBillings.AsNoTracking().FirstOrDefaultAsync(p => p.BillingId == id);
                if (projectBilling is not null)
                {
                    projectBilling.IsActive = false;
                    _context.ProjectBillings.Update(projectBilling);
                    await _context.SaveChangesAsync();
                    return new ProjectBillingResponse { Success = true, Message = "ProjectBilling deleted successfully!" };
                }

                throw new KeyNotFoundException($"Projects Billing is not exists!");
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<ExportReportResponse> DownloadProjectBilling()
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
                    mainSheet.Cells[row, 1].Value = "Contract Name";
                    mainSheet.Cells[row, 2].Value = "Billable Hours";
                    mainSheet.Cells[row, 3].Value = "Billed Hours";
                    mainSheet.Cells[row, 4].Value = "Billed Minutes";
                    mainSheet.Cells[row, 5].Value = "Department Name";
                    mainSheet.Cells[row, 6].Value = "Market Place Name";
                    mainSheet.Cells[row, 7].Value = "Start Date";
                    mainSheet.Cells[row, 8].Value = "End Date";

                    mainSheet.Cells["A2"].Value = "Please Select Contract Name From ClientSheet";
                    mainSheet.Cells["E2"].Value = "Please Select Department Name From DepartmentSheet";
                    mainSheet.Cells["F2"].Value = "Please Select MarketPlace Name From MarketPlaceAccountSheet";
                    #endregion

                    #region EmployeeSheet
                    ExcelWorksheet employeeSheet = excelFile.Workbook.Worksheets.Add("EmployeeSheet");
                    var employees = await _context.Employees.Include(d => d.Department).Where(x => x.IsActive).ToListAsync();

                    int empRow = 2;
                    employeeSheet.Cells[1, 1].Value = "EmployeeName";
                    employeeSheet.Cells[1, 2].Value = "DepartmentName";
                    employeeSheet.Cells[1, 3].Value = "EmployeeEmail";


                    for (int i = 0; i < employees.Count; i++)
                    {
                        employeeSheet.Cells[empRow, 1].Value = employees[i].FirstName + employees[i].LastName;
                        if (employees[i].Department is not null)
                        {
                            employeeSheet.Cells[empRow, 2].Value = employees[i].Department.DepartmentName;
                        }
                        employeeSheet.Cells[empRow, 3].Value = employees[i].Email;
                        empRow++;
                    }
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
                    marketPlaceAccountSheet.Cells[1, 2].Value = "AccountType";

                    for (int i = 0; i < marketPlaceAccountsData.Count; i++)
                    {
                        marketPlaceAccountSheet.Cells[markRow, 1].Value = marketPlaceAccountsData[i].Name;
                        marketPlaceAccountSheet.Cells[markRow, 2].Value = marketPlaceAccountsData[i].Accounts;
                        markRow++;
                    }
                    #endregion

                    #region Client Sheet 
                    ExcelWorksheet clientSheet = excelFile.Workbook.Worksheets.Add("ClientSheet");
                    var clientData = await _context.Clients.AsNoTracking().Include(p => p.Project)
                         .Include(y => y.MarketPlaceAccounts).ToListAsync();

                    int clientRow = 2;
                    clientSheet.Cells[1, 1].Value = "ClientId";
                    clientSheet.Cells[1, 2].Value = "ContractName";
                    clientSheet.Cells[1, 3].Value = "ClientName";
                    clientSheet.Cells[1, 4].Value = "DepartmentName";
                    clientSheet.Cells[1, 5].Value = "Country";

                    for (int i = 0; i < clientData.Count; i++)
                    {
                        clientSheet.Cells[clientRow, 1].Value = clientData[i].ClientId;
                        clientSheet.Cells[clientRow, 2].Value = clientData[i].Project.FirstOrDefault()?.ContractName;
                        clientSheet.Cells[clientRow, 3].Value = clientData[i].ClientName;
                        //if (clientData[i].Departments is not null)
                        //{
                        //    clientSheet.Cells[clientRow, 4].Value = clientData[i].Departments.DepartmentName;
                        //}
                        clientSheet.Cells[clientRow, 5].Value = clientData[i].Country;
                        clientRow++;
                    }

                    #endregion

                    #region Billing Sheet
                    ExcelWorksheet billingSheet = excelFile.Workbook.Worksheets.Add("BillingSheet");
                    var billingSheetData = await _context.BillingTypes.ToListAsync();
                    int billingRow = 2;
                    billingSheet.Cells[1, 1].Value = "BillingType";

                    for (int i = 0; i < billingSheetData.Count; i++)
                    {
                        billingSheet.Cells[billingRow, 1].Value = billingSheetData[i].BillingTypesName;
                        billingRow++;
                    }
                    #endregion

                    #region Contract Sheet
                    ExcelWorksheet contractSheet = excelFile.Workbook.Worksheets.Add("ContractSheet");
                    var contractSheetData = await _context.ContractType.ToListAsync();
                    int contractRow = 2;
                    contractSheet.Cells[1, 1].Value = "ContractType";
                    for (int i = 0; i < contractSheetData.Count; i++)
                    {
                        contractSheet.Cells[contractRow, 1].Value = contractSheetData[i].ContractTypesName;
                        contractRow++;
                    }
                    #endregion

                    excelFile.Save();
                    stream.Position = 0;
                }
                return new ExportReportResponse() { Streams = stream, Success = true };
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get Projects Billing By Id
        /// </summary>
        /// <param name="id"></param>  
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<ProjectBillingResponse> GetProjectBillingById(Guid id)
        {
            try
            {
                var projectBilling = await _context.ProjectBillings.AsNoTracking()
                    .Include(u => u.MarketPlaceAccount)
                    .Include(p => p.ProjectDepartments)
                    .FirstOrDefaultAsync(p => p.BillingId == id);
                if (projectBilling is not null)
                {
                    var projectBillingData = _mapper.Map<ProjectBilling>(projectBilling);
                    return new ProjectBillingResponse { Success = true, ProjectBilling = projectBillingData, Message = "Projects Billing Details founded successfully" };
                }

                throw new AppException($"Unable to found Projects Billing Details!");
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get Projects Billings
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>`
        public async Task<List<ProjectBillingResponseData>> GetProjectBillings(CustomFilterRequest request)
        {
            try
            {
                var projectBillingData =
                    !string.IsNullOrEmpty(Convert.ToString(request.StartDate)) && !string.IsNullOrEmpty(Convert.ToString(request.EndDate))
                    ? await _context.ProjectBillings.Include(x => x.Projects)
                    .Include(p => p.Department).Include(m => m.MarketPlaceAccount)
                    .Where(i => i.IsActive && i.StartDate.Value.Date >= request.StartDate.Value.Date && i.EndDate.Value.Date <= request.EndDate.Value.Date).ToListAsync()
                    :
                    request.DepartmentId is not null
                    ? await _context.ProjectBillings.Include(x => x.Projects)
                    .Include(p => p.Department).Include(m => m.MarketPlaceAccount)
                    .Where(i => i.IsActive && i.DepartmentId == request.DepartmentId).ToListAsync()
                    :
                    await _context.ProjectBillings.Include(x => x.Projects)
                    .Include(p => p.Department).Include(m => m.MarketPlaceAccount)
                    .Where(i => i.IsActive).ToListAsync();
                var getprojectBillingData = _mapper.Map<List<ProjectBillingResponseData>>(projectBillingData);
                var currentUserRole = _claimsUtility.GetUserRoleFromClaims();
                var filteredBillingdata = getprojectBillingData?.Where(x => x.ProjectDepartments?.Department?.DepartmentId == _claimsUtility.GetDepartmentIdFromClaims()).ToList();
                return currentUserRole is nameof(Role.Admin) or nameof(Role.BD) or nameof(Role.BDM) ? getprojectBillingData : filteredBillingdata;
            }

            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }

        public async Task<ProjectBillingResponse> ImportProjectBilling(ProjectBillingFiles model)
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
                            var project = UploadExcelFile.GetExcelData<ProjectBillingDataResponse>(worksheet);
                            foreach (var row in project)
                            {
                                //CONTRACT NAME
                                var marketplaceName = _context.MarketPlaceAccounts.Where(x => x.Name == row.MarketPlaceName).FirstOrDefault();
                                var deptName = _context.Departments.Where(y => y.DepartmentName == row.DepartmentName).FirstOrDefault();
                                var contractName = _context.Projects.Where(c => c.ContractName == row.ContractName).FirstOrDefault();
                                var dbProject = new ProjectBilling
                                {
                                    StartDate = Convert.ToDateTime(row.StartDate),
                                    EndDate = Convert.ToDateTime(row.EndDate),
                                    HoursBilled = row.BilledHours,
                                    BillableHours = row.BillableHours,
                                    MinutesBilled = row.BilledMinutes,
                                    MarketPlaceAccount = marketplaceName,
                                    Department = deptName,
                                    Projects = contractName,
                                    IsActive = true,
                                };
                                _context.ProjectBillings.AddRange(dbProject);
                            }
                            await _context.SaveChangesAsync();
                        }
                    }
                    return new ProjectBillingResponse { Success = true, Message = "Projects billing data imported Successfully" };
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        /// <summary>
        /// Search Projects Billing
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<List<ProjectBilling>> SearchProjectBilling(ProjectBillingDataRequest model)
        {
            try
            {
                List<ProjectBilling> projectBillingDetails = new();
                projectBillingDetails = await _context.ProjectBillings.Include(x => x.MarketPlaceAccount)
                    .Include(x => x.ProjectDepartments).ToListAsync();

                if (Guid.TryParse(model.MarketPlaceAccountId.ToString(), out Guid x))
                {
                    projectBillingDetails = projectBillingDetails.Where(s => s.MarketPlaceAccountId == model.MarketPlaceAccountId).ToList();
                }

                return projectBillingDetails;
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        #endregion
    }
}
