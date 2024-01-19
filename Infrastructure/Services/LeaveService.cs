using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using ST.ERP.Helper;
using ST.ERP.Helper.Context;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;
using System.Data;
using System.Net.Http.Headers;
using static ST.ERP.Helper.Enums;

namespace ST.ERP.Infrastructure.Services
{
    public class LeavesService : ILeavesService
    {
        #region Fields

        private readonly STERPContext _context;
        private readonly IMapper _mapper;
        private readonly LeavesSettings _leavesSettings;
        Queue<Action> actionQueue = new Queue<Action>();
        private readonly ClaimsUtility _claimsUtility;

        #endregion

        #region Constructor
        public LeavesService(STERPContext context, IMapper mapper, ClaimsUtility claimsUtility, IOptions<LeavesSettings> leavesSettings)
        {
            _context = context;
            _mapper = mapper;
            _leavesSettings = leavesSettings.Value;
            _claimsUtility = claimsUtility;
        }

        #endregion

        #region Public Methods
        public class DateRange
        {
            public DateTime StartDate { get; set; }
            public DateTime EndDate { get; set; }

            public bool Overlaps(DateRange other)
            {
                return StartDate < other.EndDate && EndDate > other.StartDate;
            }
        }
        /// <summary>
        /// Apply Leaves
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<LeaveResponse> ApplyLeaves(LeaveRequest request)
        {
            try
            {
                var leave = await _context.Leaves.AsNoTracking().FirstOrDefaultAsync(c => c.Id == request.Id);
                var leaves = await _context.Leaves.AsNoTracking().Where(x => x.IsActive).ToListAsync();
                var leavesOfEmployee = leaves.Where(x => x.EmployeeId == request.EmployeeId).ToList();
                var dbLeaveHistory = await _context.LeaveHistory.AsNoTracking().ToListAsync();
                var employeeData = await _context.Employees.AsNoTracking().FirstOrDefaultAsync(c => c.EmployeeId == request.EmployeeId);
                var leaveTypes = await _context.LeaveTypes.AsNoTracking().FirstOrDefaultAsync(c => c.LeaveTypeName == request.LeaveType);
                var statusTypes = await _context.StatusType.AsNoTracking().FirstOrDefaultAsync(c => c.StatusTypeName == request.Status);

                request.LeaveType = leaveTypes.Id.ToString();
                request.Status = statusTypes.Id.ToString();
                var leaveData = _mapper.Map<Leave>(request);
                if (leave == null)
                {
                    if (employeeData.CasualLeaves > 0 || employeeData.SickLeaves > 0)
                    {
                        DateRange range2 = new DateRange
                        {
                            StartDate = request.StartDate.Value.Date,
                            EndDate = request.EndDate is not null ? request.EndDate.Value.Date : request.StartDate.Value.Date
                        };
                        for (int i = 0; i < leavesOfEmployee.Count; i++)
                        {
                            var endDate = leavesOfEmployee[i].EndDate is not null ? leavesOfEmployee[i].EndDate.Value.Date : leavesOfEmployee[i].StartDate.Value.Date;
                            DateRange range1 = new DateRange
                            {
                                StartDate = leavesOfEmployee[i].StartDate.Value.Date,
                                EndDate = endDate
                            };
                            bool overlaps = range1.Overlaps(range2);
                            if (overlaps)
                            {
                                throw new AppException($"Leave for same date has been already applied");
                            }
                        }
                        request.EndDate = request.EndDate is not null ? request.EndDate : request.StartDate;
                        var leavedata = _context.LeaveTypes.Where(x => x.Id.ToString() == request.LeaveType).First();
                        switch (leavedata.LeaveTypeName)
                        {
                            case "ShortLeave":
                                leaveData.StartDate = DateTime.Now.Date;
                                break;
                            case "HalfDay":
                                leaveData.StartDate = DateTime.Now.Date;
                                break;
                            case "CasualLeave":
                                if (request.StartDate == request.EndDate)
                                {
                                    employeeData.CasualLeaves--;
                                }
                                break;
                            case "SickLeave":
                                if (request.StartDate == request.EndDate)
                                {
                                    employeeData.SickLeaves--;
                                }
                                break;
                        }
                        leaveData.Status = 3;
                        await _context.Leaves.AddRangeAsync(leaveData);
                        await _context.SaveChangesAsync();
                        actionQueue.Enqueue(() => SendTeamsLeaveNotificationsAsync(request));
                        while (actionQueue.Count > 0)
                        {
                            Action action = actionQueue.Dequeue();
                            action.Invoke();
                        }
                        return new LeaveResponse { Success = true, Message = "Leave Applied Successfully", Data = leaveData };
                    }
                    else
                    {
                        throw new AppException("You don't have sufficient leaves in the account");
                    }
                }
                else
                {
                    var getLeaveHistory = await _context.LeaveHistory.AsNoTracking().FirstOrDefaultAsync(x => x.LeaveId == request.Id);
                    var data = _mapper.Map(request, new Leave()
                    {
                        CreatedBy = leave.CreatedBy,
                        CreatedDate = leave.CreatedDate,
                        IsActive = leave.IsActive,
                    });
                    var leaveHistory = new LeaveHistory
                    {
                        LeaveId = data.Id,
                        EmployeeId = request.EmployeeId,
                    };
                    var leaveStatus = await _context.StatusType.AsNoTracking().FirstOrDefaultAsync(x => x.Id.ToString() == request.Status);
                    var leaveType = await _context.LeaveTypes.AsNoTracking().FirstOrDefaultAsync(x => x.Id.ToString() == request.LeaveType);
                    if (leaveStatus.StatusTypeName == "Accepted")
                    {
                        switch (leaveType.LeaveTypeName)
                        {
                            case "CasualLeave":
                                var leaveDays = 1;
                                if (leaveData.EndDate is not null)
                                {
                                    leaveDays = (leaveData.EndDate.Value.Date - leaveData.StartDate.Value.Date).Days;
                                }
                                if (getLeaveHistory == null)
                                {
                                    if (employeeData.CasualLeaves >= leaveDays)
                                    {
                                        employeeData.CasualLeaves -= leaveDays;
                                        leaveHistory.CasualLeave = leaveDays;
                                    }
                                    else if (request.StartDate == request.EndDate)
                                    {
                                        employeeData.CasualLeaves--;
                                    }
                                    else
                                    {
                                        throw new AppException("You don't have sufficient leaves in the account");
                                    }
                                }
                                else
                                {
                                    throw new AppException("This leave is already accepted");
                                }
                                break;

                            case "SickLeave":
                                if (getLeaveHistory == null)
                                {
                                    var leaveDay = 1;
                                    if (leaveData.EndDate is not null)
                                    {
                                        leaveDay = (leaveData.EndDate.Value.Date - leaveData.StartDate.Value.Date).Days;
                                    }
                                    if (employeeData.SickLeaves >= leaveDay)
                                    {
                                        employeeData.SickLeaves -= leaveDay;
                                        leaveHistory.SickLeave = leaveDay;
                                    }
                                    else if (request.StartDate == request.EndDate)
                                    {
                                        employeeData.SickLeaves--;
                                    }
                                    else
                                    {
                                        throw new AppException("You don't have sufficient leaves in the account");
                                    }
                                }
                                else
                                {
                                    throw new AppException("This leave is already accepted");
                                }
                                break;
                            case "ShortLeave":
                                if (getLeaveHistory == null)
                                {
                                    leaveHistory.ShortLeave += 1;
                                    employeeData.CreatedDate = data.CreatedDate;
                                }
                                else
                                {
                                    throw new AppException("This leave is already accepted");
                                }
                                break;
                            case "HalfDay":
                                if (getLeaveHistory == null)
                                {
                                    leaveHistory.HalfDayLeave += 1;
                                    employeeData.CreatedDate = data.CreatedDate;
                                }
                                else
                                {
                                    throw new AppException("This leave is already accepted");
                                }
                                break;
                        }
                        var leaveHistoryData = _mapper.Map(leaveHistory, new LeaveHistory
                        {
                            LeaveId = leaveHistory.LeaveId,
                        });
                        _context.Leaves.Update(leaveData);
                        await _context.LeaveHistory.AddAsync(leaveHistoryData);
                        _context.Employees.Update(employeeData);
                        await _context.SaveChangesAsync();
                    }
                    else if (leaveStatus.StatusTypeName == "Rejected")
                    {
                        if (leaveType.LeaveTypeName == "CasualLeave" || leaveType.LeaveTypeName == "SickLeave"
                        || leaveType.LeaveTypeName == "HalfDay" || leaveType.LeaveTypeName == "ShortLeave")
                        {
                            _context.Leaves.Update(leaveData);
                            await _context.SaveChangesAsync();
                        }
                    }
                    else if (leaveStatus.StatusTypeName == "Pending")
                    {
                        if (leaveType.LeaveTypeName == "ShortLeave" || leaveType.LeaveTypeName == "HalfDay")
                        {
                            leaveData.StartDate = DateTime.Now;
                            leaveData.EndDate = DateTime.Now;
                            _context.Leaves.Update(leaveData);
                        }

                        if (leaveStatus.StatusTypeName == "CasualLeave")
                        {
                            var leaveDays = (leaveData.EndDate.Value.Date - leaveData.StartDate.Value.Date).Days;
                            if (getLeaveHistory is not null)
                            {
                                _context.LeaveHistory.Remove(getLeaveHistory);
                                employeeData.CasualLeaves += leaveDays;
                                _context.Employees.Update(employeeData);
                            }
                            _context.Leaves.Update(leaveData);

                            await _context.SaveChangesAsync();
                        }

                        if (leaveStatus.StatusTypeName == "SickLeave")
                        {
                            var leaveDays = (leaveData.EndDate.Value.Date - leaveData.StartDate.Value.Date).Days;
                            if (getLeaveHistory is not null)
                            {
                                _context.LeaveHistory.Remove(getLeaveHistory);
                                employeeData.SickLeaves += leaveDays;
                                _context.Employees.Update(employeeData);
                            }
                            _context.Leaves.Update(leaveData);
                            await _context.SaveChangesAsync();
                        }

                    }
                    await _context.SaveChangesAsync();
                    actionQueue.Enqueue(() => SendTeamsLeaveNotificationsAsync(request));
                    while (actionQueue.Count > 0)
                    {
                        Action action = actionQueue.Dequeue();
                        action.Invoke();
                    }
                    return new LeaveResponse { Success = true, Message = "Leave Updated Successfully", Data = data };
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }

        }

        /// <summary>
        /// Get Leave By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<LeaveResponse> GetLeaveById(Guid id)
        {
            try
            {
                var leave = await _context.Leaves.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
                if (leave == null)
                {
                    return new LeaveResponse { Success = false, Message = "Leave not found" };
                }
                var leaveData = _mapper.Map<LeaveResponseData>(leave);
                var leavetypes = _context.LeaveTypes.AsNoTracking().FirstOrDefault(x => x.Id.ToString() == leaveData.LeaveType);
                var statustypes = _context.StatusType.AsNoTracking().FirstOrDefault(x => x.Id.ToString() == leaveData.Status);
                leaveData.Status = statustypes.StatusTypeName;
                leaveData.LeaveType = leavetypes.LeaveTypeName;
                return new LeaveResponse { Success = true, LeaveModel = leaveData, Message = "Leave found successfully" };
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get Leaves
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<List<LeaveResponseData>> GetLeaves(CustomFilterRequest request)
        {
            try
            {
                var query = _context.Leaves
                    .Include(x => x.Employee)
                    .ThenInclude(y => y.Department)
                    .Where(x => x.IsActive && x.Employee.IsActive);

                if (request.StartDate.HasValue && request.EndDate.HasValue)
                {
                    query = query.Where(leave => leave.StartDate.Value.Date == request.StartDate.Value.Date && leave.EndDate.Value.Date == request.EndDate.Value.Date);
                }

                if (request.EmployeeId.HasValue)
                {
                    query = query.Where(Leave => Leave.EmployeeId == request.EmployeeId);
                }

                if (request.DepartmentId.HasValue)
                {
                    query = query.Where(leave => leave.Employee.DepartmentId == request.DepartmentId);
                }

                if (!string.IsNullOrEmpty(request.LeaveStatus))
                {
                    var leaveStatusValue = _context.StatusType.FirstOrDefault(x => x.StatusTypeName == request.LeaveStatus);
                    query = query.Where(leave => leave.Status == leaveStatusValue.Id);
                }



                var leaves = await query.AsNoTracking().OrderByDescending(x => x.CreatedDate).ToListAsync();
                var allLeaves = _mapper.Map<List<LeaveResponseData>>(leaves);
                foreach (var item in allLeaves)
                {
                    var leaveTypes = await _context.LeaveTypes?.AsNoTracking().FirstOrDefaultAsync(x => x.Id.ToString() == item.LeaveType);
                    var Status = await _context.StatusType?.AsNoTracking().FirstOrDefaultAsync(x => x.Id.ToString() == item.Status);

                    item.LeaveType = leaveTypes.LeaveTypeName;
                    item.Status = Status.StatusTypeName;
                }
                var currentUserRole = _claimsUtility.GetUserRoleFromClaims();
                if (currentUserRole == "Employee")
                {
                    return allLeaves.Where(x => x.EmployeeId == _claimsUtility.GetEmployeeIdFromClaims()).ToList();
                }
                else if (currentUserRole == "TeamLead")
                {
                    var leavesForTL = leaves.Where(x => x.Employee.AssignedTo == _claimsUtility.GetEmployeeIdFromClaims() || x.EmployeeId == _claimsUtility.GetEmployeeIdFromClaims()).ToList();
                    allLeaves = _mapper.Map<List<LeaveResponseData>>(leavesForTL);
                    return allLeaves;
                }
                else
                {
                    var filteredLeaves = allLeaves.Where(x => x.DepartmentId == _claimsUtility.GetDepartmentIdFromClaims()).ToList();
                    return currentUserRole is nameof(Role.Admin) or nameof(Role.HR) ? allLeaves : filteredLeaves;
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Remove Leave
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<LeaveResponse> RemoveLeave(Guid id)
        {
            var leave = await _context.Leaves.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);
            var dbLeaveHistory = await _context.LeaveHistory?.AsNoTracking().FirstOrDefaultAsync(c => c.LeaveId == id);
            if (leave is not null)
            {
                leave.IsActive = false;
                _context.Leaves.Update(leave);
                if (dbLeaveHistory is not null)
                {
                    _context.LeaveHistory.Remove(dbLeaveHistory);
                }
                await _context.SaveChangesAsync();
                return new LeaveResponse { Success = true, Message = "Leave deleted successfully!" };
            }

            throw new AppException($"Leave not Found/Removed");
        }

        /// <summary>
        /// Search Leaves
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<List<LeaveResponseData>> SearchLeaves(LeaveRequest model)
        {
            try
            {
                var leaveList = new List<LeaveResponseData>();
                var leaveData = new List<Leave>();

                leaveData = await _context.Leaves.Include(e => e.Employee).ThenInclude(d => d.Department).ToListAsync();
                if (model.StartDate is not null && model.EndDate is not null)
                {
                    leaveData = leaveData.Where(d => d.StartDate >= model.StartDate && d.StartDate <= model.EndDate).ToList();
                }
                if (model.EmployeeId is not null)
                {
                    leaveData = leaveData.Where(d => d.Employee.EmployeeId == model.EmployeeId).ToList();
                }
                if (model.DepartmentId is not null)
                {
                    leaveData = leaveData.Where(d => d.Employee.Department.DepartmentId == model.DepartmentId).ToList();
                }
                if (model.EmployeeNumber is not null)
                {
                    leaveData = leaveData.Where(e => e.Employee.EmployeeNumber == model.EmployeeNumber).ToList();
                }
                leaveList = leaveData?.Select(d => new LeaveResponseData
                {
                    Id = d.Id,
                    FirstName = d.Employee?.FirstName,
                    LastName = d.Employee?.FirstName,
                    EmployeeNumber = d.Employee?.EmployeeNumber,
                    StartDate = d.StartDate,
                    Reason = d.Reason,
                    Status = d.Status.ToString(),
                    LeaveType = d.LeaveType.ToString(),
                    DepartmentId = d.Employee?.DepartmentId,
                    EmployeeId = d.Employee?.EmployeeId,
                    DepartmentName = d.Employee?.Department?.DepartmentName,
                    EndDate = d.EndDate
                }).ToList();
                return leaveList;
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);

            }
        }

        public async Task NotifyToChangeLeaveStatus()
        {
            try
            {
                var leavesData = await _context.Leaves
                    .Include(x => x.Employee)
                    .ThenInclude(y => y.Department)
                    .OrderByDescending(x => x.CreatedDate)
                    .Where(y => y.IsActive && y.Status == 3)
                    .ToListAsync();

                if (leavesData.Count > 0)
                {
                    using var httpClient = new HttpClient();

                    foreach (var item in leavesData)
                    {
                        if (item.StartDate == null)
                        {
                            continue;
                        }

                        var result = DateTime.Now.Date.CompareTo(item.StartDate);

                        if (result < 0)
                        {
                            var teamLead = await _context.Employees
                                .Include(y => y.Department)
                                .Where(x => x.Department.DepartmentId == (Guid)item.Employee.Department.DepartmentId && x.Role == "TeamLead")
                                .FirstOrDefaultAsync();

                            if (teamLead is not null)
                            {
                                var mentionDisplayName = $"{teamLead.FirstName} {teamLead.LastName}";
#if DEBUG
                                var teamsNotificationURL = SendTestNotifications();
#else
                                var teamsNotificationURL = GetTeamsNotificationURL(item.Employee.Department.DepartmentName);
#endif
                                if (!string.IsNullOrEmpty(teamsNotificationURL))
                                {
                                    var messageText = $"<b>Important</b>: Please check this pending leave" +
                                                      $"Leave notification: <b>{item.Employee.FirstName} {item.Employee.LastName} (Employee No: {item.Employee.EmployeeNumber})</b> from " +
                                                      $"the <b>{item.Employee.Department.DepartmentName}</b> team has applied for <b>{item.LeaveType}</b> between " +
                                                      $"<b>{item.StartDate.Value.Date.ToShortDateString()}</b> and <b>{item.EndDate.Value.Date.ToShortDateString()}</b> with the reason: <b>{item.Reason}</b>.";

                                    var jsonValue = new Dictionary<string, string>
                                    {
                                        { "text", messageText },
                                        { "title", item.Status.ToString() },
                                        { "type", "MessageCard" },
                                        { "ThemeColor", "0072C6" }
                                    };
                                    var response = await httpClient.SendAsync(HttpClientRequest(jsonValue, teamsNotificationURL));
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
        }

        private string GetTeamsNotificationURL(string departmentName)
        {
            switch (departmentName)
            {
                case "Dot Net Framework Technology Department":
                    return _leavesSettings.DotNet;
                case "Business Development":
                    return _leavesSettings.BD;
                case "Creative and Digital Marketing Department":
                    return _leavesSettings.WebDesign;
                case "Javascript Framework Technology Department":
                    return _leavesSettings.MERN;
                case "PHP Technology Department":
                    return _leavesSettings.PHP;
                case "Quality Analysis Department":
                    return _leavesSettings.QA;
                default:
                    return null; // Handle unknown departments
            }
        }

        private string SendTestNotifications()
        {
            return _leavesSettings.TeamsNotificationURL;
        }
        #endregion

        #region private methods

        private async Task SendTeamsLeaveNotificationsAsync(LeaveRequest leaveRequest)
        {
            var leaves = await _context.Leaves?.Include(x => x.Employee).ThenInclude(y => y.Department)
                .Where(y => y.EmployeeId == leaveRequest.EmployeeId).FirstOrDefaultAsync();

            var statusTypes = await _context.StatusType.AsNoTracking().FirstOrDefaultAsync(x => x.Id == leaves.Status);

            var leaveTypes = await _context.LeaveTypes.AsNoTracking().FirstOrDefaultAsync(x => x.Id.ToString() == leaveRequest.LeaveType);
            var jsonValue = new Dictionary<string, string>
            {
                { "text", $"Leave notification : <b>{leaves.Employee.FirstName} {leaves.Employee.LastName}(Employee No : {leaves.Employee.EmployeeNumber})</b> from the" +
                $" <b>{leaves.Employee.Department.DepartmentName}</b> team has applied for <b>{leaveTypes.LeaveTypeName}</b> between <b>{leaves.StartDate.Value.Date.ToShortDateString()}</b>" +
                $" and <b>{leaves.EndDate.Value.Date.ToShortDateString()}</b> with the reason: <b>{leaveRequest.Reason}</b>." },
                { "title", statusTypes.StatusTypeName },
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
            response = leaves.Employee.Department.DepartmentName switch
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
response = leaves.Employee.Department.DepartmentName switch
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
