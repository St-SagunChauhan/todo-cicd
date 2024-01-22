using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using ST.ERP.Helper;
using ST.ERP.Helper.Context;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;
using System.Net.Http.Headers;
using System.Text;
using static ST.ERP.Helper.Enums;

namespace ST.ERP.Infrastructure.Services
{
    public class EodService : IEodService
    {
        #region Fields
        private readonly STERPContext _context;
        private readonly ClaimsUtility _claimsUtility;
        private readonly IMapper _mapper;
        private readonly LeavesSettings _leavesSettings;
        Queue<Action> actionQueue = new Queue<Action>();
        #endregion

        #region Constructor
        public EodService(STERPContext context, ClaimsUtility claimsUtility, IMapper mapper, IOptions<LeavesSettings> leavesSettings)
        {
            _context = context;
            _claimsUtility = claimsUtility;
            _mapper = mapper;
            _leavesSettings = leavesSettings.Value;
        }
        #endregion

        #region Public Methods

        /// <summary>
        /// Create EODReport
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<EODReportResponse> CreateEodReport(CreateEODReportRequest request)
        {
            try
            {
                var eodReport = await _context.EODReport?.AsNoTracking()
                    .FirstOrDefaultAsync(c => c.EodReportId == request.EodReportId);

                if (eodReport == null)
                {
                    var projectHours = GetProjectHours(request.ProjectHours);
                    var eodReportData = new EODReport
                    {
                        ProjectHours = projectHours,
                        EmployeeId = request.EmployeeId,
                        IsActive = true,
                        EODDate = request.EODDate,
                        Remarks = request.Remarks,
                        //IsEditable = true,
                    };

                    await _context.EODReport.AddAsync(eodReportData);
                    await _context.SaveChangesAsync();
                    actionQueue.Enqueue(() => SendTeamsLeaveNotificationsAsync(request));
                    while (actionQueue.Count > 0)
                    {
                        Action action = actionQueue.Dequeue();
                        action.Invoke();
                    }
                    return new EODReportResponse { Success = true, Message = "EOD Report Created Successfully!", EODReport = eodReportData };
                }
                else
                {
                    var projectHours = GetProjectHours(request.ProjectHours);
                    var eodReportData = _mapper.Map(request, new EODReport
                    {
                        CreatedDate = eodReport.CreatedDate,
                        CreatedBy = eodReport.CreatedBy,
                        IsActive = true,
                    });
                    eodReportData.ProjectHours = projectHours;
                    _context.EODReport.Update(eodReportData);
                    await _context.SaveChangesAsync();
                    return new EODReportResponse { Success = true, Message = "EOD Report Updated Successfully!", EODReport = eodReportData };
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get Eod Reports
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<List<EODSubReport>> GetEodReports(CustomFilterRequest request)
        {
            try
            {
                DateTime currentDate = DateTime.Now;
                DayOfWeek currentDay = currentDate.DayOfWeek;

                int daysUntilMonday = (int)DayOfWeek.Monday - (int)currentDay;
                if (daysUntilMonday is 0 or < 1)
                {
                    daysUntilMonday -= 7; // If today is already Monday, subtract 7 days to get the last Monday
                }

                DateTime lastMonday = currentDate.AddDays(daysUntilMonday);
                DateTime lastSunday = lastMonday.AddDays(6);

                List<EODSubReport> result;
                var currentUserRole = _claimsUtility.GetUserRoleFromClaims();
                if (currentUserRole == Role.Admin.ToString())
                {
                    result = await GetEODSubReportsForAdminAsync(lastMonday, lastSunday);
                }
                else if (currentUserRole == Role.TeamLead.ToString())
                {
                    result = await GetEODSubReportsForTeamLeadAsync(request, _claimsUtility.GetDepartmentIdFromClaims());
                }
                else
                {
                    result = await GetEODSubReportsForEmployeeAsync(request, _claimsUtility.GetEmployeeIdFromClaims());
                }
                return result;
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<EODReportResponse> GetEodReportById(Guid? id)
        {
            try
            {
                var eodReportData = await _context.EODReport.AsNoTracking().FirstOrDefaultAsync(x => x.EodReportId == id);

                return eodReportData is not null
                ?
                new EODReportResponse { Success = true, Message = "EOD Report founded", EODReport = eodReportData }
                :
                throw new AppException("Unable to get eod report.");
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<BaseResponse> EODReportApprovedByTeamLead(Guid? TeamLeadId, Guid? EodReportId)
        {
            try
            {
                var employee = await _context.Employees.AsNoTracking().FirstOrDefaultAsync(x => x.EmployeeId == TeamLeadId);
                var eod = await _context.EODReport.AsNoTracking().Include(x => x.Employee).FirstOrDefaultAsync(x => x.EodReportId == EodReportId);

                if (employee.Role == Role.TeamLead.ToString() && eod is not null)
                {
                    return null;
                }
                else
                {
                    throw new AppException("Cannot approve eod.");
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        #endregion

        #region Private Methods
        private EODSubReport GetEODSubReport(object totalBilledHours)
        {
            var type = totalBilledHours.GetType();

            var employeeId = (Guid)type.GetProperty(nameof(EODSubReport.EmployeeId)).GetValue(totalBilledHours, null);
            var employeeName = (string)type.GetProperty(nameof(EODSubReport.EmployeeName)).GetValue(totalBilledHours, null);

            // Check if ProjectHours property is not null
            var projectDataProperty = type.GetProperty(nameof(EODSubReport.ProjectHours));
            var projectData = (List<object>)(projectDataProperty?.GetValue(totalBilledHours, null) ?? new List<object>());

            var eodSubReport = new EODSubReport
            {
                EmployeeId = employeeId,
                EmployeeName = employeeName,
                ProjectHours = projectData
                    .Select(entry =>
                    {
                        var entryType = entry.GetType();
                        var totalBilledHoursEntry = entryType.GetProperty(nameof(ProjectHoursData.BillingHours)).GetValue(entry, null)?.ToString() ?? string.Empty;
                        var totalDelightHoursEntry = entryType.GetProperty(nameof(ProjectHoursData.EmployeeDelightHours)).GetValue(entry, null)?.ToString() ?? string.Empty;

                        return new ProjectHoursData
                        {
                            BillingHours = totalBilledHoursEntry,
                            EmployeeDelightHours = totalDelightHoursEntry,
                        };
                    })
                    .ToArray(),
                EODDate = (DateTime?)type.GetProperty(nameof(EODSubReport.EODDate)).GetValue(totalBilledHours, null), // Adjust this as needed
            };

            return eodSubReport;
        }
        private static string GetProjectHours(ProjectHours[] projectHours)
        {
            var myList = projectHours.ToList();
            Dictionary<string, (decimal BillingHours, decimal EmployeeDelightHours)> dix = new Dictionary<string, (decimal, decimal)>();
            foreach (var info in myList)
            {
                dix.Add(info.ProjectId, (info.BillingHours, info.EmployeeDelightHours));
            }
            try
            {
                // Convert values to an anonymous type before serializing
                var myDic = dix.ToDictionary(kv => kv.Key, kv => new { kv.Value.BillingHours, kv.Value.EmployeeDelightHours });

                return JsonConvert.SerializeObject(myDic, Formatting.Indented);
            }
            catch (Exception ex) { throw new AppException(ex.Message); }
        }

        private static string GetHours(KeyValuePair<string, decimal> projectHour, List<Project> projects, bool isEmployeehours = false)
        {
            StringBuilder sb = new();
            ProjectHours projectHours = new ProjectHours();
            string billedOrDelightHours = isEmployeehours ? nameof(projectHours.EmployeeDelightHours) : nameof(projectHours.BillingHours);

            if (!string.IsNullOrEmpty(projectHour.Key))
            {
                var projectId = Guid.Parse(projectHour.Key);
                var project = projects.FirstOrDefault(c => c.Id == projectId);

                if (project is not null)
                {
                    sb.Append($"Projects Name: - {project.ContractName}, {billedOrDelightHours}: - {projectHour.Value}");
                    sb.Append("\n");
                }
            }

            return sb.ToString();
        }

        // Define a method to combine project data
        private object CombineProjectData(IGrouping<Guid, EODReport> group)
        {
            try
            {
                var combinedData = new List<object>();

                var projects = _context.Projects.ToList();

                var totalHoursByProject = group
                    .SelectMany(eod => JsonConvert.DeserializeObject<Dictionary<string, ProjectHoursData>>(eod.ProjectHours))
                    .GroupBy(item => Guid.Parse(item.Key))
                    .ToDictionary(
                    grouping => grouping.Key, grouping => new
                    {
                        BillingHours = grouping.Sum(item => GetValueOrDefault(item.Value, x => x.BillingHours)),
                        EmployeeDelightHours = grouping.Sum(item => GetValueOrDefault(item.Value, x => x.EmployeeDelightHours))
                    });


                foreach (var (projectId, totalHours) in totalHoursByProject)
                {
                    var project = projects.FirstOrDefault(p => p.Id == projectId);

                    if (project is not null)
                    {
                        var entry = new
                        {
                            BillingHours = GetHours(new KeyValuePair<string, decimal>(projectId.ToString(), totalHours.BillingHours), projects, false),
                            EmployeeDelightHours = GetHours(new KeyValuePair<string, decimal>(projectId.ToString(), totalHours.EmployeeDelightHours), projects, true),
                        };

                        combinedData.Add(entry);
                    }
                }

                // Retrieve employee details from the Employees table
                var employeeDetails = _context.Employees.Include(x => x.Department).FirstOrDefault(e => e.EmployeeId == group.Key);

                return new
                {
                    EmployeeId = group.Key,
                    ProjectHours = combinedData,
                    EmployeeName = employeeDetails.FirstName + " " + employeeDetails.LastName,
                    EODDate = group.Max(eod => eod.EODDate)
                };
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        private ProjectHoursData[] GetProjectHoursArray(string projectHour, List<Project> projects, List<string> hourKeys)
        {
            try
            {
                List<ProjectHoursData> projectHoursList = new List<ProjectHoursData>();
                var startDate = DateTime.Now.Date.AddDays(-(int)DateTime.Now.Date.DayOfWeek);
                var endDate = startDate.AddDays(6);
                decimal billingHours = 0;
                // Deserialize the JSON string into a Dictionary
                var projectHoursDict = JsonConvert.DeserializeObject<Dictionary<string, Dictionary<string, decimal>>>(projectHour);

                foreach (var kvp in projectHoursDict)
                {
                    var projectId = Guid.Parse(kvp.Key);
                    var project = projects.FirstOrDefault(c => c.Id == projectId);
                    var projectHours = new ProjectHoursData();
                    Dictionary<string, decimal> accumulatedRemainingHours = new Dictionary<string, decimal>();
                    int flag = 0;

                    // get eod reports on basis of project assigned to employee
                    var eodReportsOfProject = _context.EODReport
                        .Where(x => x.EODDate.Date >= startDate.Date && x.EODDate.Date <= endDate.Date)
                        .AsEnumerable()
                        .Where(x => JsonConvert.DeserializeObject<Dictionary<string, object>>(x.ProjectHours).ContainsKey(projectId.ToString())).ToList();

                    foreach (var eodReportOfProject in eodReportsOfProject)
                    {
                        flag = 0;
                        var projectHoursOfProject = JsonConvert.DeserializeObject<Dictionary<string, Dictionary<string, decimal>>>(eodReportOfProject.ProjectHours);

                        foreach (var eodKVP in projectHoursOfProject)
                        {
                            string key = eodKVP.Key;

                            while (accumulatedRemainingHours.ContainsKey(key) && flag < projectHoursOfProject.Count)
                            {
                                billingHours += eodKVP.Value[nameof(ProjectHoursData.BillingHours)];
                                flag++;
                            }
                            if (accumulatedRemainingHours.ContainsKey(key))
                            {
                                // If yes, add the billing hours to the accumulated value
                                accumulatedRemainingHours[key] = decimal.Parse(project.HoursPerWeek) - billingHours;
                            }
                            else
                            {
                                billingHours = eodKVP.Value[nameof(ProjectHoursData.BillingHours)];
                                // If no, initialize the accumulated value with the current remaining hours
                                accumulatedRemainingHours[key] = decimal.Parse(project.HoursPerWeek) - billingHours;
                            }
                        }
                    }

                    if (project is not null)
                    {
                        var projectHoursData = new ProjectHoursData
                        {
                            ProjectName = project.ContractName,
                            // Use dynamic keys
                            BillingHours = GetHoursValue(kvp.Value, hourKeys, nameof(ProjectHoursData.BillingHours)),
                            EmployeeDelightHours = GetHoursValue(kvp.Value, hourKeys, nameof(ProjectHoursData.EmployeeDelightHours)),
                            ProjectId = project.Id
                        };
                        foreach (var remainingHours in accumulatedRemainingHours.Values)
                        {
                            if (remainingHours < 0)
                            {
                                throw new AppException("No remaining hours are left");
                            }
                            else
                            {
                                projectHoursData.RemainingHours = remainingHours;
                                break;
                            }
                        }
                        projectHoursList.Add(projectHoursData);
                    }
                }

                return projectHoursList.ToArray();
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        private static string GetHoursValue(Dictionary<string, decimal> hoursDict, List<string> hourKeys, string propertyName)
        {
            return hourKeys.Contains(propertyName) ? hoursDict.ContainsKey(propertyName) ? hoursDict[propertyName].ToString() : "0" : "0";
        }

        private async Task<List<EODSubReport>> GetEODSubReportsForAdminAsync(DateTime lastMonday, DateTime lastSunday)
        {
            var dbEodReport = await _context.EODReport
                .Where(x => x.EODDate.Date >= lastMonday.Date && x.EODDate.Date <= lastSunday.Date)
                .AsNoTracking()
                .Include(x => x.Employee)
                .OrderByDescending(c => c.EodReportId)
                .ToListAsync();

            return GetEODSubReports(dbEodReport);
        }

        private async Task<List<EODSubReport>> GetEODSubReportsForTeamLeadAsync(CustomFilterRequest request, Guid deptId)
        {
            var startDate = request.StartDate ?? DateTime.Now.Date.AddDays(-(int)DateTime.Now.Date.DayOfWeek);
            var endDate = request.EndDate ?? startDate.AddDays(6);

            var dbEodReport = await _context.EODReport
                .Where(x => x.Employee.DepartmentId == deptId && x.EODDate.Date >= startDate.Date && x.EODDate.Date <= endDate.Date)
                .AsNoTracking()
                .Include(x => x.Employee)
                .OrderByDescending(c => c.EodReportId)
                .ToListAsync();

            return GetEODSubReportsForTeamLead(dbEodReport);
        }

        private async Task<List<EODSubReport>> GetEODSubReportsForEmployeeAsync(CustomFilterRequest request, Guid empId)
        {
            try
            {
                var startDate = request.StartDate ?? DateTime.Now.Date.AddDays(-(int)DateTime.Now.Date.DayOfWeek);
                var endDate = request.EndDate ?? startDate.AddDays(6);

                var dbEodReport = await _context.EODReport?
                    .AsNoTracking()
                    .Where(x => x.EmployeeId == empId && x.EODDate.Date >= startDate.Date && x.EODDate.Date <= endDate.Date)
                    .Include(x => x.Employee)
                    .OrderByDescending(c => c.EodReportId)
                    .ToListAsync();


                var projects = await _context.Projects.Include(x => x.EmployeeProjects).ToListAsync();

                return dbEodReport?.Select(x => new EODSubReport()
                {
                    EmployeeId = x.Employee.EmployeeId,
                    EmployeeName = $"{x.Employee.FirstName} {x.Employee.LastName}",
                    EODDate = x.EODDate.Date,
                    EodReportId = x.EodReportId,
                    ProjectHours = GetProjectHoursArray(x.ProjectHours, projects,
                    new List<string> { nameof(ProjectHoursData.BillingHours), nameof(ProjectHoursData.EmployeeDelightHours), nameof(ProjectHoursData.RemainingHours)
                    }),
                    Remarks = x.Remarks,
                }).ToList();
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        private List<EODSubReport> GetEODSubReports(List<EODReport> dbEodReport)
        {
            var totalBilledHoursByEmployee = dbEodReport.GroupBy(eod => eod.Employee.EmployeeId).Select(group => CombineProjectData(group)).ToList();

            return totalBilledHoursByEmployee.Select(totalBilledHours => GetEODSubReport(totalBilledHours)).ToList();
        }

        private List<EODSubReport> GetEODSubReportsForTeamLead(List<EODReport> dbEodReport)
        {
            var projects = _context.Projects.ToList();

            return dbEodReport?.Select(x => new EODSubReport()
            {
                EmployeeId = x.Employee.EmployeeId,
                EmployeeName = $"{x.Employee.FirstName} {x.Employee.LastName}",
                EODDate = x.EODDate.Date,
                EodReportId = x.EodReportId,
                ProjectHours = GetProjectHoursArray(x.ProjectHours, projects, new List<string> { nameof(ProjectHoursData.BillingHours) }),
                Remarks = x.Remarks,
            }).ToList();
        }

        private decimal GetValueOrDefault<T>(T value, Func<T, string?> selector)
        {
            var selectedValue = selector(value);
            return decimal.TryParse(selectedValue, out var result) ? result : 0;
        }

        private async Task SendTeamsLeaveNotificationsAsync(CreateEODReportRequest request)
        {
            var eod = await _context.EODReport?.Include(x => x.Employee).ThenInclude(y => y.Department)
                .Where(y => y.EmployeeId == request.EmployeeId).FirstOrDefaultAsync();
            var jsonValue = new Dictionary<string, string>
            {
                { "text", $"<b>{eod.Employee.FirstName} {eod.Employee.LastName}</b> posted new message. Supreme Technologies/EOD Status."
                },
                {"title", "EOD Report" },
                { "type", "MessageCard" },
                { "ThemeColor", "0072C6" }
            };
            if (jsonValue.ContainsValue("Pending"))
            {
                // Hi
            }

            using HttpClient httpClients = new();
            var response = new object();
#if DEBUG
            response = eod.Employee.Department.DepartmentName switch
            {
                "Dot Net Framework Technology Department" => await httpClients.SendAsync(HttpClientRequest(jsonValue, _leavesSettings.TeamsNotificationURL)),
                "Business Development" => await httpClients.SendAsync(HttpClientRequest(jsonValue, _leavesSettings.TeamsNotificationURL)),
                "Creative and Digital Marketing Department" => await httpClients.SendAsync(HttpClientRequest(jsonValue, _leavesSettings.TeamsNotificationURL)),
                "Javascript Framework Technology Department" => await httpClients.SendAsync(HttpClientRequest(jsonValue, _leavesSettings.TeamsNotificationURL)),
                "PHP Technology Department" => await httpClients.SendAsync(HttpClientRequest(jsonValue, _leavesSettings.TeamsNotificationURL)),
                "Quality Analysis Department" => await httpClients.SendAsync(HttpClientRequest(jsonValue, _leavesSettings.TeamsNotificationURL)),
                _ => "No department found"
            };
#else
            response = eod.Employee.Department.DepartmentName switch
            {
                "Dot Net Framework Technology Department" => await httpClients.SendAsync(HttpClientRequest(jsonValue, _leavesSettings.DotNet)),
                "Business Development" => await httpClients.SendAsync(HttpClientRequest(jsonValue, _leavesSettings.BD)),
                "Creative and Digital Marketing Department" => await httpClients.SendAsync(HttpClientRequest(jsonValue, _leavesSettings.WebDesign)),
                "Javascript Framework Technology Department" => await httpClients.SendAsync(HttpClientRequest(jsonValue, _leavesSettings.MERN)),
                "PHP Technology Department" => await httpClients.SendAsync(HttpClientRequest(jsonValue, _leavesSettings.PHP)),
                "Quality Analysis Department" => await httpClients.SendAsync(HttpClientRequest(jsonValue, _leavesSettings.QA)),
                _ => "No department found"
            };
#endif
        }

        private HttpRequestMessage HttpClientRequest(Dictionary<string, string> jsonValue, string setting)
        {
            var request = new HttpRequestMessage(new HttpMethod("POST"), setting);
            request.Content = new StringContent(JsonConvert.SerializeObject(jsonValue));
            request.Content.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");
            return request;
        }

        #endregion
    }
}
