using System.Data;
using System.Drawing;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using OfficeOpenXml.Table;
using ST.ERP.Helper;
using ST.ERP.Helper.Context;
using ST.ERP.Helper.Extensions;
using ST.ERP.Helper.Impoter_Utilites;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Models.CustomModels;
using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;
using static ST.ERP.Helper.Enums;
using ContractStatus = ST.ERP.Models.DAO.ContractStatus;

namespace ST.ERP.Infrastructure.Services
{
    public class ReportService : IReportService
    {

        #region Fields
        private readonly STERPContext _context;
        private readonly IMarketPlaceAccountService _marketplaceAccount;
        private readonly ClaimsUtility _claimsUtility;

        #endregion

        #region Constructor
        public ReportService(STERPContext context, IMarketPlaceAccountService marketplaceAccount, ClaimsUtility claimsUtility)
        {
            _context = context;
            _marketplaceAccount = marketplaceAccount;
            _claimsUtility = claimsUtility;
        }
        #endregion

        /// <summary>
        /// Excel export for master
        /// </summary>
        /// <param name="reportname"></param>
        /// <returns></returns>
        public byte[] MasterExcel(string reportname)
        {
            var list = _context.Projects.Select(x => new ProjectReport
            {
                ContractName = x.ContractName,
                Accounts = x.Accounts.ToString(),
                ContractType = x.ContractType.ToString(),
                HoursPerWeek = x.HoursPerWeek,
                BillingType = x.BillingType.ToString(),
            }).ToList();

            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;

            ExcelPackage pack = new();
            ExcelWorksheet ws = pack.Workbook.Worksheets.Add(reportname);

            var headerCells = ws.Cells[1, 1, 1, 7];
            headerCells.Style.Fill.PatternType = ExcelFillStyle.Solid;
            headerCells.Style.Fill.BackgroundColor.SetColor(Color.LightBlue);
            headerCells.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            headerCells.Style.Font.Size = 15;

            ws.Cells[1, 1, 1, 7].LoadFromCollection(list, c => c.PrintHeaders = true);
            ws.Cells["A2"].LoadFromCollection(list, false, TableStyles.Light1);
            return pack.GetAsByteArray();
        }

        /// <summary>
        /// this is import Master Report files 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<MasterReportResponse> ImportMasterFile(MasterReportRequest model)
        {
            MasterReportResponse response = new();

            try
            {
                var extension = Path.GetExtension(model.File.FileName);
                if (extension.IndexOf("xls") == -1) { throw new Exception("Invalid file type. Please use a valid Excel file."); }

                using (var stream = new MemoryStream())
                {
                    await model.File.CopyToAsync(stream);
                    using (var package = new ExcelPackage(stream))
                    {
                        ExcelWorksheet worksheet = package.Workbook.Worksheets["Sheet1"];
                        List<Project> projectList = new();
                        // count row of excel sheets
                        var rowcount = worksheet.Dimension.Rows + 1;
                        // count excel  columns 
                        var colcount = worksheet.Dimension.Columns;
                        // get all clients from database for client id 
                        var clientsList = _context.Clients.AsTracking().ToList();
                        var projectID = new Guid();

                        List<ProjectDepartment> projectDepartmentList = new();

                        for (int row = 2; row < rowcount; row++)
                        {
                            // get client name from excel
                            var clientName = worksheet.Cells[row, 3].Value?.ToString();
                            // get client name is exist in client lisr
                            var client = clientsList.FirstOrDefault(x => x.ClientEmail.ToLower() == clientName?.ToLower());

                            Guid clientId = Guid.NewGuid();
                            // client exist in database
                            if (client is not null)
                            {
                                clientId = client.ClientId;
                            }
                            else
                            {
                                // if client is not exist in database then first create client in database then get reference id for client
                                Client clientData = new()
                                {
                                    ClientId = clientId,
                                    ClientEmail = worksheet.Cells[row, 2].Value?.ToString(),
                                    Country = worksheet.Cells[row, 7].Value?.ToString(),
                                };
                                _context.Clients.AddRange(clientData);
                                await _context.SaveChangesAsync();
                            }

                            // add excel columns valumns in project list 
                            projectList.Add(new Project
                            {
                                ContractName = worksheet.Cells[row, 4].Value?.ToString(),
                                HoursPerWeek = worksheet.Cells[row, 5].Value?.ToString(),
                                ClientId = clientId,
                                Id = projectID,
                                CreatedDate = new DateTime()
                            });
                            projectDepartmentList.Add(new ProjectDepartment
                            {
                                DepartmentId = model.DepartmentId,
                                ProjectId = projectID,
                            });
                        }

                        await _context.BulkInsertAsync(projectList);
                        await _context.BulkInsertAsync(projectDepartmentList);
                        return new MasterReportResponse { Success = true, Message = "Master file data imported Successfully" };
                    }
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<ClosedProjectReportResponse> ImportClosedReportFile(ClosedProjectReportRequest model)
        {
            ClosedProjectReportResponse response = new();

            try
            {
                var extension = Path.GetExtension(model.File.FileName);
                if (extension.IndexOf("xls") == -1) { throw new Exception("Invalid file type. Please use a valid Excel file."); }

                using (var stream = new MemoryStream())
                {
                    await model.File.CopyToAsync(stream);
                    using (var package = new ExcelPackage(stream))
                    {
                        ExcelWorksheet worksheet = package.Workbook.Worksheets["Sheet1"];
                        List<ProjectDepartment> closedProjectList = new();
                        // count row of excel sheets
                        var rowcount = worksheet.Dimension.Rows + 1;
                        // count excel  columns 
                        var colcount = worksheet.Dimension.Columns;
                        // get all clients from database for client id 
                        var clientsList = _context.Clients.AsTracking().ToList();
                        var projectList = _context.Projects.AsTracking().ToList();
                        var departmentList = _context.Departments.AsTracking().ToList();
                        var projectDepartments = _context.ProjectDepartments.AsTracking().ToList();

                        for (int row = 2; row < rowcount; row++)
                        {
                            // get client email from excel
                            var clientEmail = worksheet.Cells[row, 2].Value == null ? string.Empty : worksheet.Cells[row, 2].Value.ToString().Trim();
                            // get client email  exist in client list
                            var client = clientsList.FirstOrDefault(x => x.ClientEmail == clientEmail);

                            Guid ClientId = Guid.NewGuid();
                            // client exist in database
                            if (client is not null)
                            {
                                ClientId = client.ClientId;
                            }
                            else
                            {
                                // if client is not exist in database then first create client in database then get reference id for client
                                Client clientData = new()
                                {
                                    ClientId = ClientId,
                                    ClientName = worksheet.Cells[row, 1].Value == null ? string.Empty : worksheet.Cells[row, 1].Value.ToString().Trim(),
                                    ClientEmail = worksheet.Cells[row, 2].Value == null ? string.Empty : worksheet.Cells[row, 2].Value.ToString().Trim(),
                                };
                                _context.Clients.AddRange(clientData);
                                await _context.SaveChangesAsync();
                            }

                            // get project name from excel 
                            var projectName = worksheet.Cells[row, 3].Value?.ToString();
                            // get project id from existing projects in database
                            var existProject = projectList.FirstOrDefault(x => x.ContractName.ToLower() == projectName?.ToLower() && x.ClientId == ClientId);
                            // get department name from excel 
                            var departmentName = worksheet.Cells[row, 9].Value?.ToString();
                            // get department id from existing department in database
                            var department = departmentList.FirstOrDefault(x => x.DepartmentName.ToLower() == departmentName?.ToLower());

                            if (existProject is not null && department is not null)
                            {
                                // get project and department is exist in database or not 
                                var projectDepartment = projectDepartments.FirstOrDefault(x => x.DepartmentId == department.DepartmentId && x.ProjectId == existProject.Id);
                                if (projectDepartment is not null)
                                {
                                    closedProjectList.Add(projectDepartment);
                                }
                            }

                        }

                        await _context.BulkUpdateAsync(closedProjectList);
                        return new ClosedProjectReportResponse { Success = true, Message = "Closed project file data imported Successfully" };
                    }
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<ClosedProjectReportResponse> ImportConnectUsedReport(ClosedProjectReportRequest model)
        {
            ClosedProjectReportResponse response = new();
            try
            {
                var extension = Path.GetExtension(model.File.FileName);
                if (extension.IndexOf("xls") == -1) { throw new Exception("Invalid file type. Please use a valid Excel file."); }

                using (var stream = new MemoryStream())
                {
                    await model.File.CopyToAsync(stream);
                    using (var package = new ExcelPackage(stream))
                    {
                        ExcelWorksheet worksheet = package.Workbook.Worksheets["Sheet1"];

                        List<Connect> connectList = new();
                        Connect connects = new();
                        // count row of excel sheets
                        var rowcount = worksheet.Dimension.Rows + 1;
                        // count excel  columns 
                        var colcount = worksheet.Dimension.Columns;
                        // get all clients from database for client id   
                        var departmentList = _context.Departments.AsTracking().ToList();

                        for (int row = 2; row < rowcount; row++)
                        {
                            // get client email from excel
                            var departmentName = worksheet.Cells[row, 1].Value?.ToString();
                            // get client email  exist in client list
                            var department = departmentList.FirstOrDefault(x => x.DepartmentName?.ToLower() == departmentName?.ToLower());
                            if (department is not null)
                            {
                                connects = new()
                                {
                                    DepartmentId = department.DepartmentId,
                                    ConnectUsed = (int)worksheet.Cells[row, 2].Value,
                                    Connect_Date = Convert.ToDateTime(worksheet.Cells[row, 3].Value?.ToString()),
                                };
                                connectList.Add(connects);
                            }
                        }
                        if (connectList.Count > 0)
                        {
                            await _context.BulkInsertAsync(connectList);
                        }

                    }
                }

            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }

            return new ClosedProjectReportResponse { Success = true, Message = "Closed project file data imported Successfully" };
        }

        /// <summary>
        /// Get Projects Report
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<List<ProjectDepartmentResponseData>> GetProjectReport(CustomDepartmentFilterRequest request)
        {
            try
            {
                var projectList = await GetProjectList();

                var projectDepartment = MapProjectListToResponseData(projectList);

                ApplyAdditionalMappings(projectDepartment);

                ApplyFilters(projectDepartment, request);

                return projectDepartment;
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }

        /// <summary>
        /// Get Clients Report
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<List<ProjectDepartmentResponseData>> GetClientReport(CustomDepartmentFilterRequest request)
        {
            try
            {
                var projectDepartment = await GetProjectReport(request);

                var distinctClientsContracts = projectDepartment
                    .GroupBy(pd => new { pd.ClientId })
                    .Select(group => group.Last())
                    .ToList();

                return distinctClientsContracts;
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }

        /// <summary>
        /// Get Connect Report
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<List<ConnectSubReportResponse>> GetConnectReport(ConnectReportRequest request)
        {
            try
            {
                var dbConnectData = await _context.Connects.Include(y => y.Employees).ThenInclude(x => x.EmployeeProjects).ThenInclude(x => x.Projects)
                                    .Include(x => x.MarketPlaceAccount).Include(y => y.Department).ToListAsync();
                var connectData = dbConnectData?.Select(x => new ConnectSubReportResponse()
                {
                    DepartmentName = x.Department.DepartmentName,
                    ConnectUsed = x.ConnectUsed,
                    EmployeeName = x.Employees.FirstName + " " + x.Employees.LastName,
                    JobUrl = x.JobUrl,
                    Status = Convert.ToString(x.ConnectStatus),
                    UpWorkId = x.MarketPlaceAccount?.Name,
                    DepartmentId = x.DepartmentId,
                    connectId = x.ConnectId,
                    Connect_Date = x.Connect_Date.Value.Date,
                    MarketingQualifiedLeads = x.MarketingQualifiedLeads,
                    SalesQualifiedLeads = x.SalesQualifiedLeads,
                    Technology = x.Technology,
                    DealsWon = x.DealsWon,
                }).ToList();
                var data = !string.IsNullOrEmpty(Convert.ToString(request.DepartmentId))
                    ? connectData.Where(x => x.DepartmentId == request.DepartmentId).ToList()
                    :
                    !string.IsNullOrEmpty(Convert.ToString(request.StartDate)) && !string.IsNullOrEmpty(Convert.ToString(request.EndDate))
                    ? connectData.Where(x => x.Connect_Date >= request.StartDate.Value.Date && x.Connect_Date <= request.StartDate.Value.Date).ToList()
                    : !string.IsNullOrEmpty(Convert.ToString(request.DepartmentId)) && !string.IsNullOrEmpty(Convert.ToString(request.StartDate))
                    && !string.IsNullOrEmpty(Convert.ToString(request.EndDate))
                    ? connectData.Where(x => x.DepartmentId == request.DepartmentId && x.Connect_Date >= request.StartDate
                    && x.Connect_Date <= request.EndDate).ToList()
                    : connectData.ToList();
                foreach (var item in data)
                {
                    var statusType = _context.ConnectStatus.AsNoTracking().FirstOrDefault(x => x.Id.ToString() == item.Status);
                    item.Status = statusType.ConnectStatusName;
                }
                return data;
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get Billing Report
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<List<WeeklyBillingReportResponse>> GetBillingReport(BillingReportRequest request)
        {
            try
            {
                var billingList = new List<WeeklyBillingReportResponse>();
                var status = _context.ProjectStatus.Where(x => x.ProjectStatusName == "Completed").First();
                var projectBilling = await _context.ProjectBillings
                     .Include(x => x.Department)
                     .Include(x => x.Projects).ThenInclude(x => x.Client)
                     .Include(x => x.Projects).ThenInclude(x => x.EmployeeProjects).ThenInclude(x => x.Employee)
                     .Include(x => x.MarketPlaceAccount)
                     .Where(x => x.IsActive).ToListAsync();
                projectBilling = projectBilling.Where(x => x.Projects.Status != status.Id).ToList();

                double deptTargetedHours = _context.Employees.Where(x => x.DepartmentId == request.DepartmentId && x.IsActive).Sum(x => x.EmployeeTargetedHours).GetValueOrDefault();
                double deptBilledHours = (double)projectBilling.Where(x => x.DepartmentId == request.DepartmentId && x.IsActive)
                    .Sum(x => x.HoursBilled);
                double deptBilledMinutes = (double)projectBilling.Where(x => x.DepartmentId == request.DepartmentId && x.IsActive)
                    .Sum(x => x.MinutesBilled);

                if (request.DepartmentId is not null)
                {
                    int deptMinutesToHour = (int)(deptBilledMinutes / 60);
                    deptBilledMinutes = deptBilledMinutes % 60;
                    deptBilledHours += deptMinutesToHour;
                }

                double supremeTargetedHours = _context.Employees.Where(x => x.IsActive).Sum(x => x.EmployeeTargetedHours).GetValueOrDefault();
                double supremeBilledHours = (double)projectBilling.Where(x => x.IsActive).Sum(x => x.HoursBilled);
                double supremeBilledMinutes = (double)projectBilling.Where(x => x.IsActive).Sum(x => x.MinutesBilled);
                int supremeMinutesToHour = (int)(supremeBilledMinutes / 60);
                supremeBilledMinutes = supremeBilledMinutes % 60;
                supremeBilledHours += supremeMinutesToHour;

                var projectBillingData = projectBilling.Select(x => new WeeklyBillingReportResponse
                {
                    WeeklyBillingHours = x.Projects?.ProjectBillings?.Select(x => x.BillableHours).FirstOrDefault(),
                    DepartmentId = x.DepartmentId.ToArray().ToList(),
                    DepartmentName = string.Join(',', x.Department?.DepartmentName),
                    EndDate = x.EndDate,
                    StartDate = x.StartDate,
                    TotalHoursBilled = x.HoursBilled,
                    TotalMinutesBilled = x.MinutesBilled,
                    ProjectName = x.Projects.ContractName,
                    UpworkId = x.MarketPlaceAccount.Name,
                    TotalTragetedHours = Convert.ToString(x.Projects?.EmployeeProjects?.Select(x => x.Employee.EmployeeTargetedHours).FirstOrDefault()),
                    BillingType = Convert.ToString(x.Projects.BillingType),
                    ClientName = x.Projects.Client.ClientName,
                    Account = Convert.ToString(x.Projects.Accounts),
                    BilledHours = request.DepartmentId is not null ? Convert.ToDouble(deptBilledHours + "." + deptBilledMinutes) : Convert.ToDouble(supremeBilledHours + "." + supremeBilledMinutes),
                    TargetedHours = request.DepartmentId is not null ? deptTargetedHours : supremeTargetedHours,
                    TotalWeeklyCapacity = request.DepartmentId is not null
                        ? (deptBilledHours / deptTargetedHours) * 100
                        :
                        (supremeBilledHours / supremeTargetedHours) * 100,
                });

                var data = projectBillingData.ToList();
                foreach (var item in data)
                {
                    var billingType = _context.BillingTypes.AsNoTracking().FirstOrDefault(x => x.Id.ToString() == item.BillingType);
                    var accountsType = _context.AccountTypes.AsNoTracking().FirstOrDefault(x => x.Id.ToString() == item.Account);
                    item.BillingType = billingType.BillingTypesName;
                    item.Account = accountsType.AccountTypesName;
                }

                if (request.DepartmentId is not null)
                {
                    data = data.Where(x => x.DepartmentId.Contains(request.DepartmentId)).ToList();
                }
                if (request.StartDate.HasValue && request.EndDate.HasValue)
                {
                    data = data.Where(x =>
                        x.StartDate == request.StartDate &&
                        x.EndDate == request.EndDate).ToList();
                }

                return data;
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        //      /// <summary>
        //      /// Get Capacity Report
        //      /// </summary>
        //      /// <param name="request"></param>
        //      /// <returns></returns>
        //      public async Task<List<CapacityReportResponse>> GetCapacityReport(BillingReport request)
        //{
        //	var billingList = new List<CapacityReportResponse>();
        //	var data = await GetBillingReport(request);
        //	billingList = data?.GroupBy(x => new { A = x.TotalHoursBilled, B = x.DepartmentName, C = x.WeeklyBillingHours, D = x.BillingSubReport })
        //			  .Select(grp => new CapacityReportResponse
        //			  {
        //				  DepartmentName = grp.Key.B,
        //				  TotalBilledHours = grp.Key.A,
        //				  TotalBillingHours = grp.Key.C,
        //				  Week = grp.Key.D.Select(x => x.Week).FirstOrDefault(),
        //				  Capacity = (grp.Key.A) > 0 ? (grp.Key.A / grp.Key.C) * 100 : 0,
        //				  BillingDate = grp.Key.D.Select(x => x.BillingDate).FirstOrDefault(),
        //			  }).ToList();
        //	return billingList;
        //}

        /// <summary>
        /// Get Custom Projects Report
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public async Task<List<ProjectReportNew>> ProjectReport(BillingReportRequest request)
        {
            var project = await _context.Projects?.Include(x => x.ProjectDepartments).ThenInclude(y => y.Department).Where(x => x.IsActive).ToListAsync();
            var ProjectReportList = new List<ProjectReportNew>();
            var connectData = new List<Project>();
            //var status = ProjectStatus.Completed.ToString();
            connectData = await _context.Projects
                .Include(x => x.ProjectDepartments)
                .ToListAsync();
            if (!string.IsNullOrEmpty(Convert.ToString(request.DepartmentId)))
            {
                //connectData = connectData.Where(c => c.ProjectDepartments.Any(s=>s.Department?.DepartmentId == request.DepartmentId)).ToList();
                connectData = connectData.Where(c => c.ProjectDepartments.Any(x => x.DepartmentId == request.DepartmentId)).ToList();
            }

            var ProjectReportgroup = connectData.GroupBy(x => x.ProjectDepartments.Select(d => d.Department.DepartmentName)).ToList();

            foreach (var projectReport in connectData.GroupBy(x => x.ProjectDepartments.Select(x => x.Department.DepartmentName)))
            {
                var result = new ProjectReportNew
                {
                    ProjectReports = new List<ProjectReport>()
                };
                int count = 0;

                foreach (var item in projectReport)
                {
                    if (count == 0)
                    {
                        result.DepartmentName = string.Join(',', item.ProjectDepartments.Select(x => x.Department.DepartmentName).ToList());
                    }
                    result.ProjectReports.Add(new ProjectReport
                    {
                        Accounts = Convert.ToString(item.Accounts),
                        BillingType = Convert.ToString(item.BillingType),
                        ClientEmail = item.Client.ClientEmail,
                        ContractName = item.ContractName,
                        ContractType = Convert.ToString(item.ContractType),
                        Country = item.Client.Country,
                        HoursPerWeek = item.HoursPerWeek,
                        DepartmentName = string.Join(',', item.ProjectDepartments.Select(x => x.Department.DepartmentName).ToList())
                        //TODO: change property name to DepartmentNames and change it in the client app as well
                    });
                    count++;

                };
                ProjectReportList.Add(result);
            }
            return ProjectReportList;
        }

        /// <summary>
        /// Get Master Billing Report
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public async Task<List<MasterBillingReportResponse>> MasterBillingReport(MasterBillingReportRequest request)
        {
            try
            {
                var MasterReportBilling = await _context.ProjectBillings
                    .Include(x => x.Department)
                    .Include(x => x.Projects)
                   .Include(x => x.Department).ThenInclude(x => x.Employees).Where(x => x.IsActive).ToListAsync();
                var masterbilling = new List<MasterBillingReportResponse>();
                decimal? supremeCapaicity = 0;
                decimal? supremeTargetedHours = 0;
                decimal? supremeHourbilled = 0;
                decimal? hourBilled = 0;
                decimal? hourTrageted = 0;
                var today = DateTime.Now;

                DayOfWeek weekStart = DayOfWeek.Monday;
                DateTime startingDate = DateTime.Today;

                while (startingDate.DayOfWeek != weekStart)
                {
                    startingDate = startingDate.AddDays(-1);
                }

                DateTime previousWeekEnd = startingDate.AddDays(-3);
                DateTime previousWeekStart = startingDate.AddDays(-7);
                DateTime firstMonthDay = new DateTime(previousWeekStart.Date.Year, previousWeekStart.Date.Month, 1);
                DateTime firstMonthMonday = firstMonthDay.AddDays((DayOfWeek.Monday + 7 - firstMonthDay.DayOfWeek) % 7);
                if (firstMonthMonday > previousWeekStart.Date)
                {
                    firstMonthDay = firstMonthDay.AddMonths(-1);
                    firstMonthMonday = firstMonthDay.AddDays((DayOfWeek.Monday + 7 - firstMonthDay.DayOfWeek) % 7);
                }
                var weeknumber = (previousWeekStart.Date - firstMonthMonday).Days / 7 + 1;


                if (!string.IsNullOrEmpty(Convert.ToString(request.StartDate)) && !string.IsNullOrEmpty(Convert.ToString(request.CurrentDate)))
                {
                    MasterReportBilling = MasterReportBilling.Where(c => c.StartDate >= request.StartDate && c.EndDate <= request.CurrentDate).ToList();
                }
                foreach (var master in MasterReportBilling?.GroupBy(x => x.Department.DepartmentName))
                {
                    var result = new MasterBillingReportResponse
                    {
                        DepartmentName = string.Empty,
                    };

                    int count = 0;

                    using (var sw = new StreamWriter(master.Key))
                    {
                        if (count == 0)
                        {
                            result.DepartmentName = master.Key;
                        }

                        var hourTragetedList = _context.Employees.Where(x => x.Department.DepartmentName == result.DepartmentName && x.IsActive).Select(x => x.EmployeeTargetedHours).ToList();
                        var hourBilledList = MasterReportBilling.Where(x => x.Department.DepartmentName == result.DepartmentName).Select(x => x.HoursBilled + "." + x.MinutesBilled).ToList();
                        hourTrageted = hourTragetedList.Sum() * weeknumber;
                        hourBilled = hourBilledList.Sum(x => Convert.ToDecimal(x));

                        foreach (var item in master)
                        {
                            result.OverallDepartmentBilling = hourBilled;
                            result.OverallTragetedBilling = hourTrageted;
                            result.Overallcapacity = hourTrageted == 0 || hourBilled == 0 ? 0 :
                                (decimal)(result.OverallDepartmentBilling / result.OverallTragetedBilling) * 100;
                            result.StartDate = new DateTime(today.Year, today.Month, 1);
                            result.CurrentDate = DateTime.Today;
                        };
                        count++;

                        supremeCapaicity += result.Overallcapacity;
                        supremeTargetedHours += result.OverallTragetedBilling;
                        supremeHourbilled += result.OverallDepartmentBilling;
                        masterbilling.Add(result);

                    }
                }
                masterbilling.Add(new MasterBillingReportResponse
                {
                    DepartmentName = "SupremeTechnologies",
                    Overallcapacity = supremeCapaicity is not 0 && supremeTargetedHours is not 0 ? Decimal.Round((decimal)(supremeCapaicity / supremeTargetedHours) * 100) : 0,
                    OverallDepartmentBilling = supremeHourbilled,
                    OverallTragetedBilling = supremeTargetedHours,
                    StartDate = new DateTime(today.Year, today.Month, 1),
                    CurrentDate = DateTime.Today,

                });
                masterbilling.Reverse();
                return masterbilling;
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }

        public async Task<ExportReportResponse> DownloadWeeklyBillingReport()
        {
            try
            {
                BillingReportRequest billingReport = new();
                var data = await GetBillingReport(billingReport);
                var departments = await _context.Departments.ToListAsync();
                foreach (var item in departments)
                {
                    var isExists = data.Any(x => x.DepartmentName == item.DepartmentName);
                    if (!isExists)
                    {
                        var newModel = new WeeklyBillingReportResponse
                        {
                            DepartmentName = item.DepartmentName,
                            BillingSubReports = new List<WeeklyBillingSubReportResponse>(),
                        };
                        data.Add(newModel);
                    }
                }

                MemoryStream stream = new();
                ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;
                using var excelFile = new ExcelPackage(stream);

                if (!excelFile.Workbook.Worksheets.Any(ar => ar.Name == "Posts"))
                {
                    excelFile.Workbook.Worksheets.Add("Posts");
                }
                var worksheet = excelFile.Workbook.Worksheets["Posts"];

                // headers
                worksheet.Cells[1, 1].Value = "Department Name";
                worksheet.Cells[1, 2].Value = "Total Hours Billed";
                worksheet.Cells[1, 3].Value = "Weekly Billing Hours";
                worksheet.Cells[1, 4].Value = "Total Trageted Hours";
                worksheet.Cells[1, 5].Value = "Total Weekly Capacity";

                int startHeaderColumn = 1; int endHeaderColumn = 5;
                for (int a = startHeaderColumn; a <= endHeaderColumn; a++)
                {
                    worksheet.Cells[1, a].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    worksheet.Cells[1, a].Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#e69138")); //Light Orange
                }

                worksheet.Cells[1, 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
                worksheet.Cells[1, 1].Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#0b5394")); //Dark Blue

                int row = 2;
                foreach (var o in data)
                {
                    worksheet.Cells[row, 1].Value = o.DepartmentName;
                    worksheet.Cells[row, 2].Value = o.TotalHoursBilled;
                    worksheet.Cells[row, 3].Value = o.WeeklyBillingHours;
                    worksheet.Cells[row, 4].Value = o.TotalTragetedHours;
                    worksheet.Cells[row, 5].Value = o.TotalWeeklyCapacity;

                    int startDataColumn = 2; int endDataColumn = 5;
                    for (int a = startDataColumn; a <= endDataColumn; a++)
                    {
                        if (o.TotalHoursBilled is not null)
                        {
                            worksheet.Cells[row, a].Style.Fill.PatternType = ExcelFillStyle.Solid;
                            worksheet.Cells[row, a].Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#00ffff")); //Greenish-blue
                        }
                    }

                    worksheet.Cells[row, 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    worksheet.Cells[row, 1].Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#6aa84f")); //Green
                    worksheet.Cells[row, 1].Style.Font.Bold = true;

                    row++;

                    worksheet.Cells[row, 1].Value = "Contract";
                    worksheet.Cells[row, 2].Value = "Client Name";
                    worksheet.Cells[row, 3].Value = "Weekly Hours";
                    worksheet.Cells[row, 4].Value = "Hours Billed";
                    worksheet.Cells[row, 5].Value = "Manaual/Tracker";
                    worksheet.Cells[row, 6].Value = "UpWorkd Id";
                    worksheet.Cells[row, 7].Value = "Agency/Individual";

                    int startDataHeaderColumn = 1; int endDataHeaderColumn = 7;
                    for (int a = startDataHeaderColumn; a <= endDataHeaderColumn; a++)
                    {
                        worksheet.Cells[row, a].Style.Fill.PatternType = ExcelFillStyle.Solid;
                        worksheet.Cells[row, a].Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#6d9eeb")); //Cornflower Blue
                    }

                    worksheet.Row(row).Style.Font.Bold = true;
                    worksheet.Row(row).Style.Font.Color.SetColor(Color.White);
                    row++;

                    foreach (var item in o.BillingSubReports)
                    {
                        worksheet.Cells[row, 1].Value = item.ProjectName;
                        worksheet.Cells[row, 2].Value = item.ClientName;
                        worksheet.Cells[row, 3].Value = item.BillableHours;
                        worksheet.Cells[row, 4].Value = item.HourBilled;
                        worksheet.Cells[row, 5].Value = item.BillingType;
                        if (item.BillingType == "UpworkManualHours")
                        {
                            worksheet.Cells[row, 5].Style.Fill.PatternType = ExcelFillStyle.Solid;
                            worksheet.Cells[row, 5].Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#e69138")); //Light Orange
                        }
                        worksheet.Cells[row, 6].Value = item.UpworkId;
                        worksheet.Cells[row, 7].Value = item.Accounts;
                        row++;
                    }

                    row++;
                }

                worksheet.Row(1).Style.Font.Color.SetColor(Color.White);
                worksheet.Row(1).Style.Font.Bold = true;
                excelFile.Save();

                stream.Position = 0;
                return new ExportReportResponse() { Streams = stream, Success = true };
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }

        public async Task<ExportReportResponse> DownloadProjectStatusReport(CustomDepartmentFilterRequest request)
        {
            try
            {
                var data = await GetProjectReport(request);

                MemoryStream stream = new();
                ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;
                using var excelFile = new ExcelPackage(stream);

                if (!excelFile.Workbook.Worksheets.Any(ar => ar.Name == "Posts"))
                {
                    excelFile.Workbook.Worksheets.Add("Posts");
                }
                var worksheet = excelFile.Workbook.Worksheets["Posts"];

                int row = 1;

                foreach (var o in data)
                {
                    worksheet.Cells[row, 1].Value = o.Status;

                    worksheet.Cells[row, 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    worksheet.Cells[row, 1].Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#0b5394")); //Dark Blue

                    worksheet.Cells[row, 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    worksheet.Cells[row, 1].Style.Font.Bold = true;
                    worksheet.Row(row).Style.Font.Color.SetColor(Color.White);

                    row++;

                    worksheet.Cells[row, 1].Value = "Accounts";
                    worksheet.Cells[row, 2].Value = "UpWork Id";
                    worksheet.Cells[row, 3].Value = "Contract Name";
                    worksheet.Cells[row, 4].Value = "Contract Type";
                    worksheet.Cells[row, 5].Value = "Communication Mode";
                    worksheet.Cells[row, 6].Value = "Department";
                    worksheet.Cells[row, 7].Value = "Start Date";
                    worksheet.Cells[row, 8].Value = "Close Date";
                    worksheet.Cells[row, 9].Value = "Projects Review";
                    worksheet.Cells[row, 10].Value = "Billing Type";
                    worksheet.Cells[row, 11].Value = "Country";

                    int startDataHeaderColumn = 1; int endDataHeaderColumn = 11;
                    for (int a = startDataHeaderColumn; a <= endDataHeaderColumn; a++)
                    {
                        worksheet.Cells[row, a].Style.Fill.PatternType = ExcelFillStyle.Solid;
                        worksheet.Cells[row, a].Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#6d9eeb")); //Cornflower Blue
                        worksheet.Cells[row, a].Style.Font.Bold = true;
                        worksheet.Row(row).Style.Font.Color.SetColor(Color.White);
                    }

                    row++;

                    foreach (var item in o.ProjectDepartments)
                    {
                        worksheet.Cells[row, 1].Value = item.Accounts;
                        worksheet.Cells[row, 2].Value = item.UpWorkId;
                        worksheet.Cells[row, 3].Value = item.ContractName;
                        worksheet.Cells[row, 4].Value = item.ContractType;
                        worksheet.Cells[row, 5].Value = item.Communication;
                        worksheet.Cells[row, 6].Value = item.DepartmentName;
                        worksheet.Cells[row, 7].Value = item.StartDate;
                        worksheet.Cells[row, 8].Value = item.CloseDate;
                        worksheet.Cells[row, 9].Value = item.ProjectReview;
                        worksheet.Cells[row, 10].Value = item.BillingType;
                        if (item.BillingType == "UpworkManualHours")
                        {
                            worksheet.Cells[row, 10].Style.Fill.PatternType = ExcelFillStyle.Solid;
                            worksheet.Cells[row, 10].Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#6aa84f")); //Green
                        }
                        worksheet.Cells[row, 11].Value = item.Country;
                        row++;
                    }

                    row++;
                }

                excelFile.Save();
                stream.Position = 0;

                return new ExportReportResponse() { Streams = stream, Success = true };
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }

        /*public async Task<ExportReportResponse> DownloadConnectHistoryReport()
        {
            try
            {
                ConnectReportRequest connectReportRequest = new();
                var data = await GetConnectReport(connectReportRequest);
                var departments = await _context.Department.ToListAsync();
                foreach (var item in departments)
                {
                    var isExists = data.Any(x => x.DepartmentName == item.DepartmentName);
                    if (!isExists)
                    {
                        var newModel = new ConnectReportResponse
                        {
                            DepartmentName = item.DepartmentName,
                            ConnectSubReports = new List<ConnectSubReportResponse>(),
                        };
                        data.Add(newModel);
                    }
                }

                MemoryStream stream = new();
                ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;
                using var excelFile = new ExcelPackage(stream);

                if (!excelFile.Workbook.Worksheets.Any(ar => ar.Name == "Posts"))
                    excelFile.Workbook.Worksheets.Add("Posts");
                var worksheet = excelFile.Workbook.Worksheets["Posts"];
                int row = 1;

                foreach (var o in data)
                {
                    worksheet.Cells[row, 1].Value = o.DepartmentName;

                    worksheet.Cells[row, 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    worksheet.Cells[row, 1].Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#0b5394")); //Dark Blue
                    worksheet.Cells[row, 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    worksheet.Cells[row, 1].Style.Font.Bold = true;
                    worksheet.Row(row).Style.Font.Color.SetColor(Color.White);

                    row++;

                    worksheet.Cells[row, 1].Value = "Profile Name";
                    worksheet.Cells[row, 2].Value = "Department Name";
                    worksheet.Cells[row, 3].Value = "UpWork Id";
                    worksheet.Cells[row, 4].Value = "Job Url";
                    worksheet.Cells[row, 5].Value = "Connects Used";
                    worksheet.Cells[row, 6].Value = "Status";

                    int startDataHeaderColumn = 1; int endDataHeaderColumn = 6;
                    for (int a = startDataHeaderColumn; a <= endDataHeaderColumn; a++)
                    {
                        worksheet.Cells[row, a].Style.Fill.PatternType = ExcelFillStyle.Solid;
                        worksheet.Cells[row, a].Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#6d9eeb")); //Cornflower Blue
                        worksheet.Cells[row, a].Style.Font.Bold = true;
                        worksheet.Row(row).Style.Font.Color.SetColor(Color.White);
                    }

                    row++;

                    foreach (var item in o.ConnectSubReports)
                    {
                        worksheet.Cells[row, 1].Value = item.EmployeeName;
                        worksheet.Cells[row, 2].Value = item.DepartmentName;
                        worksheet.Cells[row, 3].Value = item.UpWorkId;
                        worksheet.Cells[row, 4].Value = item.JobUrl;
                        worksheet.Cells[row, 5].Value = item.ConnectUsed;
                        worksheet.Cells[row, 6].Value = item.Status;
                        row++;
                    }

                    row++;
                }

                excelFile.Save();
                stream.Position = 0;
                return new ExportReportResponse() { Streams = stream, Success = true };
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }*/

        public async Task<ExportReportResponse> DownloadMasterReport(CustomDepartmentFilterRequest depFilter)
        {
            try
            {
                MasterBillingReportRequest request = new();
                var data = await MasterBillingReport(request);
                var departments = await _context.Departments.ToListAsync();
                foreach (var item in departments)
                {
                    var isExists = data.Any(x => x.DepartmentName == item.DepartmentName);
                    if (!isExists)
                    {
                        var newModel = new MasterBillingReportResponse
                        {
                            DepartmentName = item.DepartmentName,
                            OverallDepartmentBilling = 0,
                            Overallcapacity = 0,
                            OverallTragetedBilling = 0,
                        };
                        data.Add(newModel);
                    }
                }

                MemoryStream stream = new();
                ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;
                using var excelFile = new ExcelPackage(stream);

                if (!excelFile.Workbook.Worksheets.Any(ar => ar.Name == "Posts"))
                {
                    excelFile.Workbook.Worksheets.Add("Posts");
                }
                var worksheet = excelFile.Workbook.Worksheets["Posts"];

                worksheet.Cells[1, 1].Value = "Monthly Overview";
                worksheet.Cells[1, 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
                worksheet.Cells[1, 1].Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#0b5394"));
                worksheet.Row(1).Style.Font.Bold = true;
                worksheet.Row(1).Style.Font.Color.SetColor(Color.White);

                int row = 2;
                foreach (var o in data)
                {
                    worksheet.Cells[row, 1].Value = o.DepartmentName;
                    worksheet.Cells[row, 2].Value = o.Overallcapacity + "%";
                    row++;
                }

                row++;
                row++;

                worksheet.Cells[row, 1].Value = "Capacity Of Teams";
                worksheet.Cells[row, 2].Value = "Hours Target";
                worksheet.Cells[row, 3].Value = "Billed Hours";

                int startDataHeaderColumn = 1; int endDataHeaderColumn = 3;
                for (int a = startDataHeaderColumn; a <= endDataHeaderColumn; a++)
                {
                    worksheet.Cells[row, a].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    worksheet.Cells[row, a].Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#0b5394")); //Dark Blue
                    worksheet.Cells[row, a].Style.Font.Bold = true;
                    worksheet.Cells[row, a].Style.Font.Color.SetColor(Color.White);
                }
                row++;

                foreach (var item in data)
                {
                    worksheet.Cells[row, 1].Value = item.DepartmentName;
                    worksheet.Cells[row, 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    worksheet.Cells[row, 1].Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#6d9eeb")); //Cornflower Blue
                    worksheet.Cells[row, 1].Style.Font.Bold = true;
                    worksheet.Cells[row, 1].Style.Font.Color.SetColor(Color.White);
                    worksheet.Cells[row, 2].Value = item.OverallTragetedBilling;
                    worksheet.Cells[row, 3].Value = item.OverallDepartmentBilling;

                    row++;
                }

                row++;
                var projectData = await GetProjectReport(depFilter);

                foreach (var o in projectData)
                {
                    worksheet.Cells[row, 1].Value = o.Status;

                    worksheet.Cells[row, 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    worksheet.Cells[row, 1].Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#0b5394")); //Dark Blue
                    worksheet.Cells[row, 1].Style.Font.Bold = true;
                    worksheet.Cells[row, 1].Style.Font.Color.SetColor(Color.White);

                    row++;

                    worksheet.Cells[row, 1].Value = "Accounts";
                    worksheet.Cells[row, 2].Value = "UpWork Id";
                    worksheet.Cells[row, 3].Value = "Contract Name";
                    worksheet.Cells[row, 4].Value = "Contract Type";
                    worksheet.Cells[row, 5].Value = "Communication Mode";
                    worksheet.Cells[row, 6].Value = "Department";
                    worksheet.Cells[row, 7].Value = "Start Date";
                    worksheet.Cells[row, 8].Value = "Close Date";
                    worksheet.Cells[row, 9].Value = "Projects Review";
                    worksheet.Cells[row, 10].Value = "Billing Type";
                    worksheet.Cells[row, 11].Value = "Country";

                    int startHeaderColumn = 1; int endHeaderColumn = 11;
                    for (int a = startHeaderColumn; a <= endHeaderColumn; a++)
                    {
                        worksheet.Cells[row, a].Style.Fill.PatternType = ExcelFillStyle.Solid;
                        worksheet.Cells[row, a].Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#6d9eeb")); //Cornflower Blue
                        worksheet.Cells[row, a].Style.Font.Bold = true;
                        worksheet.Row(row).Style.Font.Color.SetColor(Color.White);
                    }

                    row++;

                    foreach (var item in o.ProjectDepartments)
                    {
                        worksheet.Cells[row, 1].Value = item.Accounts;
                        worksheet.Cells[row, 2].Value = item.UpWorkId;
                        worksheet.Cells[row, 3].Value = item.ContractName;
                        worksheet.Cells[row, 4].Value = item.ContractType;
                        worksheet.Cells[row, 5].Value = item.Communication;
                        worksheet.Cells[row, 6].Value = item.DepartmentName;
                        worksheet.Cells[row, 7].Value = item.StartDate;
                        worksheet.Cells[row, 8].Value = item.CloseDate;
                        worksheet.Cells[row, 9].Value = item.ProjectReview;
                        worksheet.Cells[row, 10].Value = item.BillingType;
                        if (item.BillingType == "UpworkManualHours")
                        {
                            worksheet.Cells[row, 10].Style.Fill.PatternType = ExcelFillStyle.Solid;
                            worksheet.Cells[row, 10].Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#6aa84f")); //Green
                        }
                        worksheet.Cells[row, 11].Value = item.Country;
                        row++;
                    }

                    row++;
                }

                excelFile.Save();
                stream.Position = 0;
                return new ExportReportResponse() { Streams = stream, Success = true };
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }

        public async Task<ExportReportResponse> DownloadConnectHistoryReport()
        {
            try
            {
                MemoryStream stream = new();
                ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;
                using var excelFile = new ExcelPackage(stream);
                {
                    #region Main Sheet
                    ExcelWorksheet mainSheet = excelFile.Workbook.Worksheets.Add("MainSheet");
                    var row = 1;
                    mainSheet.Cells[row, 1].Value = "Profile Name";
                    mainSheet.Cells[row, 2].Value = "Department Name";
                    mainSheet.Cells[row, 3].Value = "UpWork Id";
                    mainSheet.Cells[row, 4].Value = "Job Url";
                    mainSheet.Cells[row, 5].Value = "Connects Used";
                    mainSheet.Cells[row, 6].Value = "Status";
                    mainSheet.Cells[row, 7].Value = "Connect Date";
                    mainSheet.Cells[row, 8].Value = "Marketing Qualified Leads";
                    mainSheet.Cells[row, 9].Value = "Sales Qualified Leads";
                    mainSheet.Cells[row, 10].Value = "Technology";
                    mainSheet.Cells[row, 11].Value = "Deals Won";
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
                    mainSheet.Cells["A2"].Value = "Employee Name";
                    mainSheet.Cells["C2"].Value = "UpWork Id  from  MarketPlace Sheet";
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

        public async Task<ExportReportResponse> ImportConnectHistoryFile(ImportConnectsHistory model)
        {
            try
            {
                var extension = Path.GetExtension(model.File.FileName);
                var connectStatus = _context.ContractType.ToList();
                if (extension.IndexOf("xls") == -1) { throw new Exception("Invalid file type. Please use a valid Excel file."); }
                using (var stream = new MemoryStream())
                {
                    await model.File.CopyToAsync(stream);
                    ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;
                    using (var package = new ExcelPackage(stream))
                    {
                        int iSheetsCount = package.Workbook.Worksheets.Count;
                        if (iSheetsCount > 0)
                        {
                            // Get the sheet by index
                            ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                            var project = UploadExcelFile.GetExcelData<ImportConnectRequest>(worksheet);
                            foreach (var row in project)
                            {
                                //CONTRACT NAME
                                var marketplaceName = _context.MarketPlaceAccounts.Where(x => x.Name == row.UpWorkId).FirstOrDefault();
                                var deptName = _context.Departments.Where(y => y.DepartmentName == row.DepartmentName).FirstOrDefault();
                                var empName = _context.Employees.Where(c => c.FirstName + c.LastName == row.ProfileName).FirstOrDefault();
                                var dbProject = new Connect
                                {
                                    JobUrl = row.JobUrl,
                                    DealsWon = Convert.ToInt32(row.DealsWon),
                                    MarketingQualifiedLeads = Convert.ToInt32(row.MarketingQualifiedLeads),
                                    SalesQualifiedLeads = Convert.ToInt32(row.SalesQualifiedLeads),
                                    Technology = row.Technology,
                                    MarketPlaceAccountId = marketplaceName.Id,
                                    DepartmentId = deptName.DepartmentId,
                                    EmployeeId = empName.EmployeeId,
                                    ConnectUsed = Convert.ToInt32(row.ConnectsUsed),
                                    Connect_Date = Convert.ToDateTime(row.ConnectDate),
                                    IsActive = true,
                                };
                                if (row.Status == "Hired")
                                {
                                    dbProject.ConnectStatus = connectStatus.FirstOrDefault(x => x.ContractTypesName == row.Status).Id;
                                }
                                else if (row.Status == "Lead")
                                {
                                    dbProject.ConnectStatus = connectStatus.FirstOrDefault(x => x.ContractTypesName == row.Status).Id;
                                }
                                else
                                {
                                    dbProject.ConnectStatus = connectStatus.FirstOrDefault(x => x.ContractTypesName == row.Status).Id;
                                }
                                _context.Connects.AddRange(dbProject);
                            }
                            await _context.SaveChangesAsync();
                        }
                    }
                    return new ExportReportResponse { Success = true, Message = "Connects History imported Successfully" };
                }
                return new ExportReportResponse();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<List<BidReportResponse>> WeeklyJobReport()
        {
            try
            {
                DateTime currentDate = DateTime.Now;
                DateTime lastMonday = GetLastMonday(currentDate);
                DateTime lastSunday = lastMonday.AddDays(6);

                List<BidReportResponse> bidData = await GetJobReport(_claimsUtility.GetUserRoleFromClaims(), lastMonday, lastSunday);

                return bidData;
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<List<ContractStatus>> GetContractStatus()
        {
            try
            {
                return await _context.ContractStatus.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new AppException("Failed to retrieve contract status.", ex.Message);
            }
        }

        #region commented method

        //public async Task<ExportReportResponse> DownloadWeeklyProjectReport()
        //{
        //    try
        //    {
        //        BillingReport billingReport = new();
        //        var data = await ProjectReport(billingReport);
        //        var departments = await _context.Department.ToListAsync();
        //        foreach (var item in departments)
        //        {
        //            var isExists = data.Any(x => x.DepartmentName == item.DepartmentName);
        //            if (!isExists)
        //            {
        //                var newModel = new ProjectReportNew
        //                {
        //                    DepartmentName = item.DepartmentName,
        //                    ProjectReports = new List<ProjectReport>(),
        //                };
        //                data.Add(newModel);
        //            }
        //        }

        //        MemoryStream stream = new();
        //        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        //        using var excelFile = new ExcelPackage(stream);

        //        if (!excelFile.Workbook.Worksheets.Any(ar => ar.Name == "Posts"))
        //            excelFile.Workbook.Worksheets.Add("Posts");
        //        var worksheet = excelFile.Workbook.Worksheets["Posts"];

        //        int row = 1;

        //        foreach (var o in data)
        //        {
        //            worksheet.Cells[row, 1].Value = o.DepartmentName;

        //            worksheet.Cells[row, 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
        //            worksheet.Cells[row, 1].Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#0b5394")); //Dark Blue
        //            worksheet.Cells[row, 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
        //            worksheet.Cells[row, 1].Style.Font.Bold = true;
        //            worksheet.Row(row).Style.Font.Color.SetColor(Color.White);

        //            row++;

        //            worksheet.Cells[row, 1].Value = "Contract Type";
        //            worksheet.Cells[row, 2].Value = "Accounts";
        //            worksheet.Cells[row, 3].Value = "Client Email";
        //            worksheet.Cells[row, 4].Value = "Contract Name";
        //            worksheet.Cells[row, 5].Value = "Hours Per Week";
        //            worksheet.Cells[row, 6].Value = "Billing Type";
        //            worksheet.Cells[row, 7].Value = "Country";

        //            int startDataHeaderColumn = 1; int endDataHeaderColumn = 7;
        //            for (int a = startDataHeaderColumn; a <= endDataHeaderColumn; a++)
        //            {
        //                worksheet.Cells[row, a].Style.Fill.PatternType = ExcelFillStyle.Solid;
        //                worksheet.Cells[row, a].Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#6d9eeb")); //Cornflower Blue
        //                worksheet.Cells[row, a].Style.Font.Bold = true;
        //                worksheet.Row(row).Style.Font.Color.SetColor(Color.White);
        //            }

        //            row++;

        //            foreach (var item in o.ProjectReports)
        //            {
        //                worksheet.Cells[row, 1].Value = item.ContractType;
        //                worksheet.Cells[row, 2].Value = item.Accounts;
        //                worksheet.Cells[row, 3].Value = item.ClientEmail;
        //                worksheet.Cells[row, 4].Value = item.ContractName;
        //                worksheet.Cells[row, 5].Value = item.HoursPerWeek;
        //                worksheet.Cells[row, 6].Value = item.BillingType;
        //                worksheet.Cells[row, 7].Value = item.Country;
        //                row++;
        //            }

        //            row++;
        //        }

        //        excelFile.Save();
        //        stream.Position = 0;
        //        return new ExportReportResponse() { Streams = stream, Success = true };
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new AppException(ex.ToString());
        //    }
        //}


        #endregion

        #region private methods
        private DateTime GetLastMonday(DateTime currentDate)
        {
            DayOfWeek currentDay = currentDate.DayOfWeek;
            int daysUntilMonday = (int)DayOfWeek.Monday - (int)currentDay;

            if (daysUntilMonday <= 0)
            {
                daysUntilMonday -= 7; // If today is already Monday, subtract 7 days to get the last Monday
            }

            return currentDate.AddDays(daysUntilMonday);
        }

        private async Task<List<JobRecords>> GetJobsFromDB(string role, DateTime lastMonday, DateTime lastSunday)
        {
            try
            {

                return role is not (nameof(Role.Admin)) and not (nameof(Role.BDM)) ?
                    await _context.JobRecords.AsNoTracking()
                    .Where(c => c.CreatedDate.Date >= lastMonday.Date && c.CreatedDate.Date <= lastSunday.Date && c.EmployeeId == _claimsUtility.GetEmployeeIdFromClaims())
                    .Include(e => e.Employee).ToListAsync() :

                await _context.JobRecords.AsNoTracking()
                .Where(c => c.CreatedDate.Date >= lastMonday.Date && c.CreatedDate.Date <= lastSunday.Date)
                .Include(e => e.Employee).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        private async Task<List<BidReportResponse>> GetJobReport(string role, DateTime lastMonday, DateTime lastSunday)
        {
            try
            {
                var jobRecords = await GetJobsFromDB(role, lastMonday, lastSunday);

                return jobRecords
                    .GroupBy(record => record.EmployeeId)
                    .Select(group => new BidReportResponse
                    {
                        BidId = group.First().BidId,
                        EmployeeName = $"{group.FirstOrDefault()?.Employee?.FirstName} {group.FirstOrDefault()?.Employee?.LastName}",
                        TotalApplied = group.Count(record => record.Status == (int)Status.Applied),
                        TotalLeads = group.Count(record => record.Status == (int)Status.Lead),
                        TotalHired = group.Count(record => record.Status == (int)Status.Hired),
                        TotalConnectUsed = group.Sum(record => record.Connects),
                    }).ToList();
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        private async Task<List<Project>> GetProjectList()
        {
            try
            {
                return await _context.Projects?
                .Include(x => x.EmployeeProjects.Where(x => x.IsActive)).ThenInclude(x => x.Employee)
                .Include(x => x.Client).ThenInclude(x => x.MarketPlaceAccounts)
                .Include(x => x.ProjectDepartments.Where(x => x.IsActive))
                .ThenInclude(y => y.Department)
                .Include(x => x.ProjectHealth)
                .Include(x => x.Upworks)
                .Where(x => x.IsActive)
                .OrderByDescending(p => p.CreatedDate)
                .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }

        private List<ProjectDepartmentResponseData> MapProjectListToResponseData(List<Project> projectList)
        {
            try
            {
                return projectList?
                .Where(x => x != null)
                .Select(x => new ProjectDepartmentResponseData()
                {
                    ProjectId = x.Id,
                    HoursPerWeek = x.HoursPerWeek ?? string.Empty,
                    ClientId = x.ClientId,
                    ClientName = x.Client?.ClientName ?? string.Empty,
                    Country = x.Client?.Country ?? string.Empty,
                    ContractName = x.ContractName ?? string.Empty,
                    DepartmentName = string.Join(", ", x.ProjectDepartments?.Select(y => y.Department?.DepartmentName)) ?? string.Empty,
                    DepartmentId = x.ProjectDepartments?.Select(y => y.Department?.DepartmentId)?.ToList() ?? new List<Guid?>(),
                    EmployeeId = x.EmployeeProjects?.Select(y => y.Employee?.EmployeeId)?.ToList() ?? new List<Guid?>(),
                    EmployeeName = string.Join(", ", x.EmployeeProjects?.Select(y => $"{y.Employee?.FirstName} {y.Employee?.LastName}")) ?? string.Empty,
                    BillingType = x.BillingType.ToString(),
                    Accounts = x.Accounts.ToString(),
                    ContractType = x.ContractType.ToString(),
                    Status = x.Status.ToString(),
                    IsActive = x.IsActive,
                    ClientEmail = x.Client?.ClientEmail ?? string.Empty,
                    StartDate = x.StartDate.Date,
                    CloseDate = x.EndDate.HasValue ? x.EndDate.Value.ToString("dd/MM/yyyy") : string.Empty,
                    Communication = x.CommunicationMode,
                    UpWorkId = x.Upworks?.Name ?? string.Empty,
                    ProjectReview = x.ProjectReview ?? string.Empty,
                    ProjectUrl = x.ProjectUrl ?? string.Empty,
                    Rating = x.Rating,
                    ContractStatus = x.BillingStatus.ToString(),
                    Reason = x.Reason,
                    ProjectHealthRate = x.ProjectHealth?.ProjectHealthRate,
                })
                .Where(x => (bool) x.IsActive)
                .ToList();
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }

        private void ApplyAdditionalMappings(List<ProjectDepartmentResponseData> projectDepartment)
        {
            try
            {
                foreach (var item in projectDepartment)
                {
                    var contractType = _context.ContractType.AsNoTracking().FirstOrDefault(x => x.Id.ToString() == item.ContractType);
                    var billingType = _context.BillingTypes.AsNoTracking().FirstOrDefault(x => x.Id.ToString() == item.BillingType);
                    var contractStatus = _context.ContractStatus.AsNoTracking().FirstOrDefault(x => x.Id.ToString() == item.ContractStatus);
                    var statusType = _context.ProjectStatus.AsNoTracking().FirstOrDefault(x => x.Id.ToString() == item.Status);
                    var accountsType = _context.AccountTypes.AsNoTracking().FirstOrDefault(x => x.Id.ToString() == item.Accounts);
                    item.ContractType = contractType?.ContractTypesName;
                    item.BillingType = billingType?.BillingTypesName;
                    item.Status = statusType?.ProjectStatusName;
                    item.Accounts = accountsType?.AccountTypesName;
                    item.ContractStatus = contractStatus?.ContractStatusName;
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }

        private void ApplyFilters(List<ProjectDepartmentResponseData> projectDepartment, CustomDepartmentFilterRequest request)
        {
            try
            {
                if (request.ContractStatus is not null)
                {
                    projectDepartment = projectDepartment.Where(c => c.ContractStatus == request.ContractStatus.ToString()).ToList();
                }

                if (request.DepartmentId.HasValue)
                {
                    projectDepartment = projectDepartment.Where(p => p.DepartmentId.Contains(request.DepartmentId)).ToList();
                }

                if (request.startDate is not null && request.endDate is not null)
                {
                    projectDepartment = projectDepartment
                        .Where(p => p.StartDate.Date >= request.startDate.Value.Date && p.StartDate.Date <= request.endDate.Value.Date)
                        .ToList();
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }

        #endregion
    }
}
