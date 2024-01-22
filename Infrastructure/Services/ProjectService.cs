using AutoMapper;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using ST.ERP.Helper;
using ST.ERP.Helper.Context;
using ST.ERP.Helper.Impoter_Utilites;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;
using static ST.ERP.Helper.Enums;
using static ST.ERP.Helper.Extensions.CustomExtensions;

namespace ST.ERP.Infrastructure.Services
{
    public class ProjectService : IProjectService
    {
        #region Fields
        private readonly STERPContext _context;
        private readonly IMapper _mapper;
        private readonly IProjectBillingService _projectBillingService;
        private readonly IDepartmentService _departmentService;
        private readonly IMarketPlaceAccountService _marketplaceAccount;
        private readonly ClaimsUtility _claimsUtility;

        #endregion

        #region Constructor
        public ProjectService(STERPContext context, IMapper mapper, ClaimsUtility claimsUtility,
            IProjectBillingService projectBillingService, IDepartmentService departmentService,
            IMarketPlaceAccountService marketplaceAccount)
        {
            _context = context;
            _mapper = mapper;
            _projectBillingService = projectBillingService;
            _departmentService = departmentService;
            _marketplaceAccount = marketplaceAccount;
            _claimsUtility = claimsUtility;
        }
        #endregion  

        #region Public Methods

        /// <summary>
        /// Create Projects
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<ProjectResponse> UpdateProject(EditProjectRequest request)
        {
            try
            {
                var projectInfoById = await GetProjectInfoById(request.ProjectId);
                request.IsActive = true;
                if (projectInfoById == null)
                {
                    throw new AppException("Projects not found");
                }

                await AddProjectHistory(projectInfoById);

                if (projectInfoById.ProjectHealth.ProjectHealthRate != request.ProjectHealthRate)
                {
                    var projectHealthData = _mapper.Map(request, new ProjectHealth()
                    {
                        CreatedBy = projectInfoById.ProjectHealth.CreatedBy,
                        CreatedDate = projectInfoById.ProjectHealth.CreatedDate,
                        Date = projectInfoById.ProjectHealth.Date,
                        //ProjectId = projectInfoById.Id,
                        ClientId = projectInfoById.ProjectHealth.ClientId,
                        LastModified = DateTime.Now,
                        LastModifiedBy = _claimsUtility.GetEmployeeIdFromClaims(),
                });

                    _context.ProjectHealth.Update(projectHealthData);
                }

                if (IsTeamLeadOrAdmin())
                {
                    await UpdateEmployeeProjects(request);
                    if(request.DepartmentId != null)
                        await UpdateProjectDepartments(request);
                }

                UpdateProjectInfo(projectInfoById, request);

                await _context.SaveChangesAsync();

                return new ProjectResponse { Success = true, Message = "Projects updated successfully" };
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Delete Projects
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<ProjectResponse> DeleteProject(Guid id)
        {
            try
            {
                var project = await _context.Projects.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
                if (project is not null)
                {
                    project.IsActive = false;
                    _context.Projects.Update(project);
                    await DeleteMappedProjectId(project);
                    await _context.SaveChangesAsync();

                    return new ProjectResponse { Success = true, Message = "Projects deleted Successfully" };
                }
                throw new AppException("Projects not deleted found");
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get Projects By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
		public async Task<ProjectResponse> GetProjectById(Guid id)
        {
            try
            {
                var project = await _context.Projects.AsNoTracking()
                    .Include(p=>p.ProjectDepartments)
                    .Include(c => c.Client)
                    .Include(x => x.EmployeeProjects.Where(x => x.IsActive))
                    .ThenInclude(x => x.Employee)
                    .Include(x => x.ProjectHealth)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (project is not null)
                {
                    var projectData = _mapper.Map<ProjectResponseData>(project);
                    if (projectData.ProjectHealthRate != null)
                    {
                        projectData.ProjectHealthRate = _context.ProjectHealthRate
                                                        .FirstOrDefault(x => x.Id == projectData.ProjectHealthRate)?.Id;

                    }
                    return new ProjectResponse { Success = true, Project = projectData, Message = "Projects found successfully" };
                }

                throw new AppException("Projects not found");
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get Projects
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<List<ProjectResponseData>?> GetProjects(CustomDepartmentFilterRequest request)
        {
            try
            {
                bool isBusinessDevelopment = false;
                // Get the current user's role from claims
                var currentUserRole = _claimsUtility.GetUserRoleFromClaims();

                // Get departmentId from claims if not provided in the request
                var departmentId = request.DepartmentId ?? _claimsUtility.GetDepartmentIdFromClaims();

                // If departmentId is equal to Business Development
                if (departmentId != null)
                    isBusinessDevelopment = await _context.Departments
                        .AsNoTracking()
                        .AnyAsync(x => x.DepartmentId == departmentId && x.DepartmentName == GetEnumDescription(Enums.Department.BusinessDevelopment));

                var projects = await GetFilteredProjects(isBusinessDevelopment, departmentId);

                var allProjects = projects
                .Where(project => project.ProjectHealth != null) // Filter out null projects
                .Select(project => _mapper.Map<ProjectResponseData>(project))
                .ToList();

                foreach (var item in allProjects)
                { 
                    MapUpworkInfo(item);
                    MapClientInfo(item);
                }
                if (currentUserRole is nameof(Role.Admin) or nameof(Role.BD) or nameof(Role.BDM))
                    return allProjects;

                // Filter projects based on the user's role and departmentId
                var filteredProjects = allProjects.Where(x => x.DepartmentId.Contains(departmentId)).ToList();

                // Return all projects for Admin, BD, and BDM roles, otherwise return filtered projects
                return filteredProjects;
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Import Bulk Contracts
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<ProjectResponse> ImportProjectListFile(ImportProjectRequest model)
        {
            try
            {
                var exceptions = new List<String>();
                var extension = Path.GetExtension(model.File.FileName);
                if (extension.IndexOf("xls") == -1) { throw new Exception("Invalid file type. Please use a valid Excel file."); }
                using (var stream = new MemoryStream())
                {

                    var endDates = "0001-01-01";
                    await model.File.CopyToAsync(stream);
                    ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                    using (var package = new ExcelPackage(stream))
                    {
                        int iSheetsCount = package.Workbook.Worksheets.Count;
                        if (iSheetsCount > 0)
                        {
                            // Get the sheet by index
                            ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                            var project = UploadExcelFile.GetExcelData<ImporterProjectLogsRequest>(worksheet);
                            var dbProjects = await _context.Projects.Where(x => x.IsActive).ToListAsync();

                            if (project.Count is not 0)
                            {
                                foreach (var row in project)
                                {
                                    var clientname = !string.IsNullOrEmpty(row.ClientName)
                                           ? row.ClientName
                                           : null;
                                    var accountType = _context.AccountTypes.Where(x => x.AccountTypesName == row.Accounts).First();
                                    var dbProject = new Project
                                    {
                                        Accounts = accountType.Id,
                                        ContractName = row.ContractName,
                                        HoursPerWeek = row.WeeklyHours,
                                        IsActive = true,
                                    };
                                    var projectsStatus = _context.ProjectStatus.Where(x => x.ProjectStatusName == row.Status).First().Id;
                                    dbProject.Status = projectsStatus;
                                    var clientId = _context.Clients.Where(x => x.ClientName == clientname).FirstOrDefault();
                                    dbProject.Client = clientId;
                                    var upworkId = _context.MarketPlaceAccounts
                                    .Where(x => x.Name == row.UpWorkId)
                                    .FirstOrDefault();

                                    var client = new Client
                                    {
                                        MarketPlaceAccounts = upworkId
                                    };
                                    dbProject.Client = client;


                                    var deptName = _context.Departments
                                        .Where(x => x.DepartmentName == row.Department)
                                        .FirstOrDefault();

                                   // dbProject.Client.Communication = row.CommunicationMode;
                                    dbProject.Client.Country = row.Country;

                                    var clientName = _context.Clients
                                        .Where(x => x.ClientName == row.ClientName)
                                        .FirstOrDefault();
                                    dbProject.Client = clientName;
                                    dbProject.ProjectReview = row.ProjectReview ?? "";
                                    dbProject.ProjectUrl = row.ProjectUrl ?? "";
                                    dbProject.Rating = row.Rating is not null ? (decimal)row.Rating : (decimal?)null;

                                    if (DateTime.TryParse(row.StartDate, out DateTime startDate))
                                    {
                                        dbProject.StartDate = startDate;
                                    }

                                    if (row.EndDate != endDates)
                                    {
                                        if (DateTime.TryParse(row.EndDate, out DateTime endDate))
                                        {
                                            dbProject.EndDate = endDate;
                                        }
                                    }
                                    else
                                    {
                                        dbProject.EndDate = null;
                                    }
                                    if (row.BillingType is not null)
                                    {
                                        var billingType = _context.BillingTypes.FirstOrDefault(x => x.BillingTypesName == row.BillingType);
                                        dbProject.BillingType = billingType.Id;
                                    }
                                    var projectDepartment = new ProjectDepartment
                                    {
                                        Department = deptName,
                                        IsActive = true
                                    };
                                    dbProject.ProjectDepartments = new List<ProjectDepartment> { projectDepartment };

                                    var employees = row.EmployeeNumber.Split(',');

                                    foreach (var employee in employees)
                                    {
                                        if (employee.Length > 1)
                                        {
                                            var emp = _context.Employees.FirstOrDefault(x => x.EmployeeNumber == employee);

                                            if (emp is not null)
                                            {
                                                dbProject.EmployeeProjects.Add(new EmployeeProject
                                                {
                                                    Employee = emp,
                                                    IsActive = true
                                                });
                                            }
                                            else
                                            {
                                                exceptions.Add($"Employee with name : {row.EmployeeNumber} does not exist in the database");
                                            }
                                        }
                                    }

                                    var projectBilling = new ProjectBilling
                                    {
                                        Projects = new Project(),
                                    };
                                    dbProject.ProjectBillings.Add(projectBilling);
                                    projectBilling.Projects.ContractName = row.ContractName;
                                    projectBilling.Projects.ProjectReview = row.ProjectReview ?? "";
                                    dbProject.Country = row.Country;
                                    dbProject.CommunicationMode = row.CommunicationMode;
                                    var billingstatus = _context.ContractStatus.AsNoTracking().FirstOrDefault(x => x.ContractStatusName == row.BillingStatus);
                                    dbProject.BillingStatus = billingstatus.Id;

                                    if (!string.IsNullOrEmpty(row.UpWorkId))
                                    {
                                        var upworkAccount = _context.MarketPlaceAccounts
                                            .Where(x => x.Name == row.UpWorkId)
                                            .FirstOrDefault();

                                        if (upworkAccount is not null)
                                        {
                                            dbProject.UpworkId = upworkAccount.Id;
                                        }
                                        else if (Guid.TryParse(row.UpWorkId.Trim(), out Guid parsedGuid))
                                        {
                                            dbProject.UpworkId = parsedGuid;
                                        }
                                    }
                                    if (row.ContractType is not null)
                                    {
                                        var contractType = _context.ContractType.Where(x => x.ContractTypesName == row.ContractType).First();
                                        dbProject.ContractType = contractType.Id;
                                    }

                                    if (dbProject.ContractName == null)
                                    {
                                        throw new AppException($"Data not found in the excel file");
                                    }
                                    _context.Projects.AddRange(dbProject);

                                }
                                await _context.SaveChangesAsync();
                            }
                        }

                        if (exceptions.Any())
                        {
                            var errors = string.Join(". ", exceptions.ToArray());
                            return new ProjectResponse { Success = true, Message = $"Partial projects data successfully imported. Errors; {errors}" };
                        }
                        else
                        {
                            return new ProjectResponse { Success = true, Message = "Projects data imported Successfully" };
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Export Contracts
        /// </summary>
        /// <returns></returns> 
        public async Task<ExportReportResponse> DownloadProject()
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
                    mainSheet.Cells[row, 1].Value = "Accounts";
                    mainSheet.Cells[row, 2].Value = "UpWorkId";
                    mainSheet.Cells[row, 3].Value = "ContractName";
                    mainSheet.Cells[row, 4].Value = "ClientName";
                    mainSheet.Cells[row, 5].Value = "Department";
                    mainSheet.Cells[row, 6].Value = "EmployeeNumber";
                    mainSheet.Cells[row, 7].Value = "WeeklyHours";
                    mainSheet.Cells[row, 8].Value = "ContractType";
                    mainSheet.Cells[row, 9].Value = "CommunicationMode";
                    mainSheet.Cells[row, 10].Value = "StartDate";
                    mainSheet.Cells[row, 11].Value = "BillingType";
                    mainSheet.Cells[row, 12].Value = "BillingStatus";
                    mainSheet.Cells[row, 13].Value = "Country";
                    mainSheet.Cells[row, 14].Value = "Status";
                    mainSheet.Cells[row, 15].Value = "EndDate";
                    mainSheet.Cells[row, 16].Value = "ProjectReview";
                    mainSheet.Cells[row, 17].Value = "ProjectUrl";
                    mainSheet.Cells[row, 18].Value = "Rating";


                    mainSheet.Cells["A2"].Value = "Please Select Accounts From MarketPlaceAccountSheet";
                    mainSheet.Cells["E2"].Value = "Please Select Department(s) From DepartmentSheet";
                    mainSheet.Cells["B2"].Value = "Please Select MarketPlaceAccountName From MarketPlaceAccountSheet";
                    mainSheet.Cells["F2"].Value = "Please Select EmployeeNumber From EmployeeSheet";
                    mainSheet.Cells["K2"].Value = "Please Select Billing Type From BillingSheet";
                    mainSheet.Cells["H2"].Value = "Please Select Contract Type From ContractSheet";
                    mainSheet.Cells["L2"].Value = "Please Select Billing Status  From BillingStatusSheet";
                    mainSheet.Cells["N2"].Value = "Please Select Project Status  From ProjectStatusSheet";




                    #endregion

                    #region EmployeeSheet
                    ExcelWorksheet employeeSheet = excelFile.Workbook.Worksheets.Add("EmployeeSheet");
                    var employees = await _context.Employees.Include(d => d.Department).Where(x => x.IsActive).ToListAsync();

                    int empRow = 2;
                    employeeSheet.Cells[1, 1].Value = "EmployeeNumber";
                    employeeSheet.Cells[1, 2].Value = "EmployeeName";
                    employeeSheet.Cells[1, 3].Value = "DepartmentName";
                    employeeSheet.Cells[1, 4].Value = "EmployeeEmail";

                    for (int i = 0; i < employees.Count; i++)
                    {
                        employeeSheet.Cells[empRow, 1].Value = employees[i].EmployeeNumber;
                        employeeSheet.Cells[empRow, 2].Value = employees[i].FirstName + employees[i].LastName;
                        if (employees[i].Department is not null)
                        {
                            employeeSheet.Cells[empRow, 3].Value = employees[i].Department.DepartmentName;
                        }
                        else
                        {
                            employeeSheet.Cells[empRow, 3].Value = string.Empty;
                        }
                        employeeSheet.Cells[empRow, 4].Value = employees[i].Email;

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
                    clientSheet.Cells[1, 1].Value = "ContractName";
                    clientSheet.Cells[1, 2].Value = "ClientName";
                    clientSheet.Cells[1, 3].Value = "DepartmentName";
                    clientSheet.Cells[1, 4].Value = "Country";

                    for (int i = 0; i < clientData.Count; i++)
                    {
                        clientSheet.Cells[clientRow, 1].Value = clientData[i].Project.FirstOrDefault()?.ContractName;
                        clientSheet.Cells[clientRow, 2].Value = clientData[i].ClientName;

                        //if (clientData[i].Departments is not null)
                        //{
                        //    clientSheet.Cells[clientRow, 3].Value = clientData[i].Departments.DepartmentName;
                        //}
                        //else
                        //{
                        clientSheet.Cells[clientRow, 3].Value = string.Empty;
                        //}
                        clientSheet.Cells[clientRow, 4].Value = clientData[i].Country;
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

                    #region Billing Status
                    ExcelWorksheet billingStatusSheet = excelFile.Workbook.Worksheets.Add("BillingStatusSheet");
                    var BillingSheetData = await _context.ContractStatus.ToListAsync();

                    int BillingRow = 2;
                    billingStatusSheet.Cells[1, 1].Value = "Billing Status";
                    for (int i = 0; i < BillingSheetData.Count; i++)
                    {
                        billingStatusSheet.Cells[BillingRow, 1].Value = BillingSheetData[i].ContractStatusName;
                        BillingRow++;
                    }
                    #endregion

                    #region Project Status
                    ExcelWorksheet ProjectStatusSheet = excelFile.Workbook.Worksheets.Add("ProjectStatusSheet");
                    var ProjectSheetData = await _context.ProjectStatus.ToListAsync();

                    int ProjectRow = 2;
                    ProjectStatusSheet.Cells[1, 1].Value = "Project Status";
                    for (int i = 0; i < ProjectSheetData.Count; i++)
                    {
                        ProjectStatusSheet.Cells[ProjectRow, 1].Value = ProjectSheetData[i].ProjectStatusName;
                        ProjectRow++;
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

        public async Task<List<CurrentProjectMembersResponse>> GetProjectMembers(Guid id)
        {
            try
            {
                var loggedInUserProjects = await _context.EmployeeProjects.AsNoTracking().Where(i => i.EmployeeId == id).Select(p => p.ProjectId).ToListAsync();

                var otherMembers = await _context.EmployeeProjects.AsNoTracking().Where(i => loggedInUserProjects.Contains(i.ProjectId) && i.EmployeeId != id).ToListAsync();

                var projectIds = otherMembers.Select(om => om.ProjectId).Distinct();
                var employeeIds = otherMembers.Select(om => om.EmployeeId).Distinct();

                var projectNamesAndEmployeeNamesResponse = await _context.Projects.AsNoTracking().Where(p => projectIds.Contains(p.Id)).ToListAsync();

                var employeeNames = await _context.Employees.AsNoTracking().Where(e => employeeIds.Contains(e.EmployeeId)).ToListAsync();

                var result = projectNamesAndEmployeeNamesResponse
                .Select(p => new CurrentProjectMembersResponse
                {
                    ProjectId = p.Id, // Replace with the actual property name
                    ProjectName = p.ContractName, // Replace with the actual property name
                    EmployeeData = employeeNames.Where(e => otherMembers.Any(om => om.ProjectId == p.Id && om.EmployeeId == e.EmployeeId))
                   .Select(e => new EmployeeResponseData
                   {
                       EmployeeId = e.EmployeeId, // Replace with the actual property name
                       FirstName = e.FirstName, // Replace with the actual property name
                       LastName = e.LastName, // Replace with the actual property name
                   }).ToList()
                }).ToList();

                return result;
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<List<ProjectResponseData>> GetProjectByEmployeeId(Guid id)
        {
            try
            {
                var allProjects = _mapper.Map<List<ProjectResponseData>>(await _context.Projects
                    .Include(x => x.Client)
                    .ThenInclude(x => x.MarketPlaceAccounts)
                    .Include(x => x.Client)
                    .Include(x => x.ProjectDepartments)
                    .ThenInclude(x => x.Department)
                    .Include(x => x.EmployeeProjects.Where(ep => ep.IsActive))
                    .ThenInclude(x => x.Employee)
                    .Include(x => x.Upworks)
                    .Where(p => p.IsActive)
                    .OrderByDescending(p => p.CreatedDate)
                    .ToListAsync());

                return allProjects.Where(employeeProject => employeeProject.EmployeeId == id).ToList();
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<ProjectResponse> CreateProjectForExistingClients(ProjectRequest request)
        {
            try
            {
                request.IsActive = true;
                request.Status = (int)Status.Hired;
                var existingProjectDepartments = await _context.ProjectDepartments.ToListAsync();

                var projectEntity = _mapper.Map<Project>(request);
                await _context.Projects.AddAsync(projectEntity);

                var newRecords = request.DepartmentId
                                        .Select(departmentId => new ProjectDepartment
                                        {
                                            DepartmentId = departmentId,
                                            ProjectId = projectEntity.Id,
                                            IsActive = request.IsActive,
                                        })
                                        .ToList();

                await _context.ProjectDepartments.AddRangeAsync(newRecords);

                var projectHealthEntity = _mapper.Map<ProjectHealth>(request);
                projectHealthEntity.Clients = projectEntity.Client;
                projectHealthEntity.Projects = projectEntity;
                projectHealthEntity.ProjectHealthRate = (int)Enums.ProjectHealthRate.Green;
                await _context.ProjectHealth.AddAsync(projectHealthEntity);

                await _context.SaveChangesAsync();
                return new ProjectResponse { Success = true, Message = "Project Created Successfully!" };
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }

        }

        public async Task<List<ProjectsHistory>> GetProjectsHistoryByProjectId(Guid ProjectId)
        {
            try
            {
                var getProjectHistoryById = await _context.ProjectsHistory
                                                 .AsNoTracking()
                                                 .Where(x => x.Id == ProjectId)
                                                 .OrderByDescending(x => x.CreatedDate)
                                                 .ToListAsync();

                if (getProjectHistoryById != null && getProjectHistoryById.Any())
                {
                    var employeeIds = getProjectHistoryById
                        .Where(x => !string.IsNullOrEmpty(x.EmployeeId))
                        .SelectMany(item => item.EmployeeId.Split(',').Select(Guid.Parse))
                        .Distinct()
                        .ToList();

                    var employees = await _context.Employees
                        .AsNoTracking()
                        .Where(x => employeeIds.Contains(x.EmployeeId))
                        .ToListAsync();

                    var jobList = _mapper.Map<List<ProjectsHistory>>(getProjectHistoryById);

                    foreach (var item in jobList)
                    {
                        if (!string.IsNullOrEmpty(item.EmployeeId))
                        {
                            var employeeNames = item.EmployeeId
                                .Split(',')
                                .Select(empId => Guid.Parse(empId))
                                .Join(
                                    employees,
                                    empId => empId,
                                    emp => emp.EmployeeId,
                                    (empId, emp) => emp.FirstName + " " + emp.LastName
                                )
                                .ToList();

                            item.EmployeeId = string.Join(",", employeeNames);
                        }
                        else
                        {
                            item.EmployeeId = null;
                        }
                    }

                    return jobList;
                }
                else
                {
                    return null;
                }

            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }

        }

        #endregion

        #region Private methods

        private async Task<List<Project>> GetFilteredProjects(bool isBusinessDevelopment, Guid departmentId)
        {
            var projects = await _context.Projects
                .Include(x => x.Client)
                .ThenInclude(x => x.MarketPlaceAccounts)
                .Include(x => x.Client)
                .Include(x => x.ProjectDepartments)
                .ThenInclude(x => x.Department)
                .Include(x => x.EmployeeProjects.Where(ep => ep.IsActive))
                .ThenInclude(x => x.Employee)
                .Include(x => x.ProjectHealth)
                .Where(p => p.IsActive)
                .OrderByDescending(p => p.CreatedDate)
                .ToListAsync();

            return isBusinessDevelopment ? projects : projects.Where(p => p.ProjectDepartments != null && p.ProjectDepartments.Select(x => x.DepartmentId).Contains(departmentId)).ToList();
        }

        /// <summary>
        /// Update Projects/Projects Department/Employee Projects
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>

        private async Task DeleteMappedProjectId(Project project)
        {

            try
            {
                var projectDepartmentById = await _context.ProjectDepartments.Include(x => x.ProjectBillings).AsNoTracking().Where(p => p.ProjectId == project.Id && p.IsActive == true).ToListAsync();
                if (projectDepartmentById is not null && projectDepartmentById.Any())
                {
                    foreach (var projectDepartment in projectDepartmentById)
                    {
                        // Check if ProjectBillings is not null and has elements
                        if (projectDepartment.ProjectBillings is not null && projectDepartment.ProjectBillings.Any())
                        {
                            foreach (var projectBilling in projectDepartment.ProjectBillings)
                            {
                                await _projectBillingService.DeleteProjectBilling(projectBilling.BillingId);
                            }
                        }
                        projectDepartment.IsActive = false;
                    }
                    _context.ProjectDepartments.UpdateRange(projectDepartmentById);
                    //await _context.SaveChangesAsync();
                }

                var employeeProjectsById = await _context.EmployeeProjects?.AsNoTracking().Where(p => p.ProjectId == project.Id && p.IsActive == true).ToListAsync();
                if (employeeProjectsById is not null && employeeProjectsById.Any())
                {
                    foreach (var employeeProject in employeeProjectsById)
                    {
                        employeeProject.IsActive = false;
                    }
                    _context.EmployeeProjects.UpdateRange(employeeProjectsById);
                    //await _context.SaveChangesAsync();
                }

                var projectHealthById = await _context.ProjectHealth?.AsNoTracking().FirstOrDefaultAsync(p => p.ProjectId == project.Id);
                if (projectHealthById is not null)
                {
                    var projectHealth = await _context.ProjectHealth.AsNoTracking().FirstOrDefaultAsync(p => p.Id == projectHealthById.Id);
                    if (projectHealth is not null)
                    {
                        projectHealth.IsActive = false;
                        _context.ProjectHealth.Update(projectHealth);
                        await _context.SaveChangesAsync();
                    }
                }
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        // Helper methods for mapping Upwork and Client information
        private void MapUpworkInfo(ProjectResponseData item)
        {
            var mappedUpworkName = _context.MarketPlaceAccounts.FirstOrDefault(x => x.Id == item.UpworkId);

            if (mappedUpworkName is not null)
            {
                //item.UpworkName = mappedUpworkName.Name ?? _context.MarketPlaceAccounts.FirstOrDefault(x => x.Id == item.HiredId)?.Name ?? string.Empty;
                item.UpworkName = mappedUpworkName.Name ?? string.Empty;
            }
        }

        private void MapClientInfo(ProjectResponseData item)
        {
            var mappedClientInfoById = _context.Clients
                .Include(m => m.MarketPlaceAccounts)
                .Include(p => p.Project)
                    .ThenInclude(pd => pd.ProjectDepartments)
                        .ThenInclude(pd => pd.Department)
                .FirstOrDefault(x => x.ClientId == item.ClientId);

            if (mappedClientInfoById is null)
                return;

            var mappedProjectInfoById = _context.Projects
                .FirstOrDefault(x => x.Id == item.Id);

            var projectIds = mappedClientInfoById.Project
                .SelectMany(project => project.ProjectDepartments
                    .Where(pd => item.DepartmentId.Contains(pd.Department.DepartmentId))
                    .Select(pd => pd.DepartmentId))
                .ToList();

            var department = _context.Departments
                .Where(x => projectIds.Contains(x.DepartmentId))
                .ToList();

            if (mappedProjectInfoById is not null)
            {
                item.ClientName = mappedClientInfoById.ClientName ?? string.Empty; ;
              
                item.Country = mappedClientInfoById.Country ?? string.Empty;
                item.BillingStatus = mappedProjectInfoById.BillingStatus ;
                if (department != null && department.Any())
                {
                    item.DepartmentId = department.Select(d => d.DepartmentId).ToArray();
                }
                else
                {
                    item.DepartmentId = null;
                }
            }
        }

        private async Task<Project> GetProjectInfoById(Guid projectId)
        {
            return await _context.Projects
                .Include(x => x.Client)
                .Include(x => x.EmployeeProjects)
                .Include(x => x.ProjectDepartments)
                .Include(x => x.ProjectHealth)
                .FirstOrDefaultAsync(p => p.Id == projectId);
        }

        private async Task AddProjectHistory(Project project)
        {
            var createProjectHistory = _mapper.Map<ProjectsHistory>(project);

            if (project.EmployeeProjects != null)
            {
                var activeEmployeeProjects = project.EmployeeProjects.Where(ep => ep.IsActive);
                createProjectHistory.EmployeeId = activeEmployeeProjects.Any()
                    ? string.Join(",", activeEmployeeProjects.Select(item => item.EmployeeId.ToString()))
                    : null;

                _context.ProjectsHistory.Add(createProjectHistory);
            }
        }

        private bool IsTeamLeadOrAdmin()
        {
            var userRole = _claimsUtility.GetUserRoleFromClaims();
            return userRole == Role.TeamLead.ToString() || userRole == Role.Admin.ToString();
        }

        private async Task UpdateEmployeeProjects(EditProjectRequest request)
        {
            var existingRecords = await _context.EmployeeProjects
                .Where(p => p.ProjectId == request.ProjectId)
                .ToListAsync();

            existingRecords.ForEach(p =>
            {
                if (p.EmployeeId.HasValue && p.EmployeeId == request.EmployeeId)
                {
                    p.IsActive = true;
                }
                else
                {
                    p.IsActive = false;
                }
            });
            _context.EmployeeProjects.UpdateRange(existingRecords);

            // Add new records if they do not already exist
            var existingEmployeeIds = existingRecords.Select(e => e.EmployeeId).ToList();

            var newRecord = new EmployeeProject
            {
                EmployeeId = request.EmployeeId,
                ProjectId = request.ProjectId,
                IsActive = request.IsActive,
            };

            if (!existingEmployeeIds.Contains(request.EmployeeId) &&
                !_context.EmployeeProjects.Any(existingRecord =>
                    existingRecord.EmployeeId == newRecord.EmployeeId &&
                    existingRecord.ProjectId == newRecord.ProjectId))
            {
                var mappedRecord = _mapper.Map<EmployeeProject>(newRecord);
            }
            await _context.EmployeeProjects.AddAsync(newRecord);
            await _context.SaveChangesAsync();

        }

        private async Task UpdateProjectDepartments(EditProjectRequest request)
        {
            var existingDepartmentRecords = await _context.ProjectDepartments
                .Where(p => p.ProjectId == request.ProjectId)
                .ToListAsync();

            existingDepartmentRecords.ForEach(p =>
            {
                if (p.DepartmentId.HasValue && request.DepartmentId?.Contains(p.DepartmentId.Value) == true)
                {
                    p.IsActive = true;
                }
                else
                {
                    p.IsActive = false;
                }
            });
            _context.ProjectDepartments.UpdateRange(existingDepartmentRecords);
            // Add new records if they do not already exist

            var existingDeparmentIds = existingDepartmentRecords.Select(e => e.DepartmentId).ToList();

            var newDepartmentIds = request.DepartmentId?
                .Cast<Guid?>()
                .Except(existingDeparmentIds)
                .ToList();

            var newDepartmentRecords = newDepartmentIds?
                .Select(departmentId => new ProjectDepartment
                {
                    DepartmentId = departmentId.Value,
                    ProjectId = request.ProjectId,
                    IsActive = request.IsActive,
                })
                .Where(newDepartmentRecords => !_context.ProjectDepartments
                    .Any(existingRecord => existingRecord.DepartmentId == newDepartmentRecords.DepartmentId &&
                                           existingRecord.ProjectId == newDepartmentRecords.ProjectId))
                .Select(_mapper.Map<ProjectDepartment>);

            await _context.ProjectDepartments.AddRangeAsync(newDepartmentRecords);
        }

        private void UpdateProjectInfo(Project projectInfo, EditProjectRequest request)
        {
            var updatedProject = _mapper.Map(request, projectInfo);
            _context.Projects.Update(updatedProject);
        }

        #endregion
    }
}
