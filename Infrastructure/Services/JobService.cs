using AutoMapper;
using ST.ERP.Helper.Context;
using ST.ERP.Helper;
using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;
using Microsoft.EntityFrameworkCore;
using ST.ERP.Infrastructure.Interfaces;
using static ST.ERP.Helper.Enums;
using static ST.ERP.Helper.Extensions.CustomExtensions;

namespace ST.ERP.Infrastructure.Services
{
    public class JobService : IJobService
    {
        private readonly STERPContext _context;
        private readonly IMapper _mapper;
        private readonly ClaimsUtility _claimsUtility;

        public JobService(STERPContext context, IMapper mapper, ClaimsUtility claimsUtility)
        {
            _context = context;
            _mapper = mapper;
            _claimsUtility = claimsUtility;
        }

        public async Task<BidRecordResponse> CreateJob(BidRequest request)
        {
            try
            {
                var jobs = await _context.JobRecords.FirstOrDefaultAsync(c => c.BidId == request.BidId);
                request.IsActive = true;
                request.StartDate = request.StartDate is not null ? request.StartDate : DateTime.Now;

                switch (jobs)
                {
                    case null when request.Status is not (int)Status.Hired:
                        {
                            request.EmployeeId = _claimsUtility.GetEmployeeIdFromClaims();
                            var jobData = _mapper.Map<JobRecords>(request);
                            await _context.JobRecords.AddAsync(jobData);
                            await _context.SaveChangesAsync();
                            return new BidRecordResponse { Success = true, Message = "Bid Created Successfully!" };

                        }

                    case null when request.Status == (int)Status.Hired:
                        {
                            request.BidId = Guid.NewGuid();
                            request.EmployeeId = jobs != null ? jobs.EmployeeId : _claimsUtility.GetEmployeeIdFromClaims();
                            var jobData = _mapper.Map<JobRecords>(request);
                            await _context.JobRecords.AddAsync(jobData);
                            await _context.SaveChangesAsync();
                            var hiredjob = await _context.JobRecords.FirstOrDefaultAsync(c => c.BidId == jobData.BidId);
                            await ProcessJobsStatus(request, hiredjob);
                            return new BidRecordResponse { Success = true, Message = "Bid Updated Successfully!" };
                        }

                    default:
                        if (request.Status is ((int)Status.Lead) or ((int)Status.Applied))
                        {
                            request.EmployeeId = jobs.EmployeeId;
                            var updatedjobData = _mapper.Map(request, jobs);
                            _context.JobRecords.Update(updatedjobData);
                            await _context.SaveChangesAsync();
                            return new BidRecordResponse { Success = true, Message = "Bid Updated Successfully!" };
                        }
                        else
                        {
                            request.EmployeeId = jobs.EmployeeId;
                            await ProcessJobsStatus(request, jobs);
                            return new BidRecordResponse { Success = true, Message = "Bid Updated Successfully!" };
                        }
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        private async Task ProcessJobsStatus(BidRequest request, JobRecords job)
        {
            try
            {
                var lastProjectId = Guid.Empty;
                Guid.TryParse(request.UpworkId, out var upworkIdParsed);
                var jobDataExist = await _context.Projects
                    .Include(x => x.Client)
                    .Include(x => x.ProjectHealth)
                    .FirstOrDefaultAsync(x => x.ProjectUrl == request.ProjectUrl && x.UpworkId == upworkIdParsed && x.ProjectDepartments.Select(x => x.DepartmentId).Contains(request.DepartmentId));

                if (jobDataExist == null)
                {
                    var clientEntity = _mapper.Map<Client>(request);
                    var projectEntity = _mapper.Map<Project>(request);
                    projectEntity.Client = clientEntity;
                    var projectHealthEntity = _mapper.Map<ProjectHealth>(request);
                    projectHealthEntity.Clients = clientEntity;
                    projectHealthEntity.Projects = projectEntity;
                    request.IsActive = true;
                    var data = _mapper.Map(request, new JobRecords()
                    {
                        CreatedBy = job.CreatedBy,
                        CreatedDate = job.CreatedDate,
                    });

                    await _context.Clients.AddAsync(clientEntity);
                    await _context.Projects.AddAsync(projectEntity);
                    await _context.ProjectHealth.AddAsync(projectHealthEntity);

                    var updatedjobData = _mapper.Map(request, job);
                    _context.JobRecords.Update(updatedjobData);
                    await _context.SaveChangesAsync();

                    lastProjectId = _context.Projects
                        .OrderByDescending(item => item.CreatedDate)
                        .Select(item => item.Id)
                        .FirstOrDefault();
                }
                else
                {
                    _mapper.Map(request, jobDataExist.Client);
                    _mapper.Map(request, jobDataExist);
                    _mapper.Map(request, jobDataExist.ProjectHealth);
                    var updatedjobData = _mapper.Map(request, job);
                    _context.JobRecords.Update(updatedjobData);
                    request.IsActive = true;
                    var data = _mapper.Map(request, new JobRecords()
                    {
                        CreatedBy = job.CreatedBy,
                        CreatedDate = job.CreatedDate,
                    });

                    await _context.SaveChangesAsync();
                }

                if (!lastProjectId.Equals(Guid.Empty))
                {
                    var projectDepartment = await _context.ProjectDepartments
                        .AsNoTracking()
                        .Where(p => p.ProjectId == lastProjectId && p.IsActive == true)
                        .FirstOrDefaultAsync();
                    if (projectDepartment == null)
                    {
                        var projectDepartmentEntity = _mapper.Map<ProjectDepartment>(request);
                        var data = _mapper.Map(request, new ProjectDepartment()
                        {
                            ProjectId = lastProjectId,
                        });

                        await _context.ProjectDepartments.AddAsync(data);
                        await _context.SaveChangesAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<BidRecordResponse> DeleteJob(Guid Id)
        {
            try
            {
                var jobs = await _context.JobRecords.FirstOrDefaultAsync(c => c.BidId == Id);
                if (jobs is not null)
                {
                    jobs.IsActive = false;
                    _context.JobRecords.Update(jobs);
                    await _context.SaveChangesAsync();
                    return new BidRecordResponse { Success = true, Message = "Jobs deleted successfully!" };
                }
                return new BidRecordResponse { Success = false, Message = "Jobs doesn't exist!" };

            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<BidRecordResponse> GetJobById(Guid Id)
        {
            try
            {
                var jobs = await _context.JobRecords
                    .FirstOrDefaultAsync(d => d.BidId == Id);
                var bidData = _mapper.Map<BidResponse>(jobs);
                return new BidRecordResponse { Success = true, Bids = bidData, Message = "Jobs found successfully" };
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<List<BidResponse>> GetAllJobs(CustomDepartmentFilterRequest request)
        {
            try
            {
                var currentUserRole = _claimsUtility.GetUserRoleFromClaims();
                var getAllJobs = await _context.JobRecords.Where(x => x.IsActive).OrderByDescending(x => x.CreatedDate).ToListAsync();
                if (currentUserRole == Role.BD.ToString())
                {
                    getAllJobs = getAllJobs.Where(x => x.EmployeeId == _claimsUtility.GetEmployeeIdFromClaims()).OrderByDescending(x => x.CreatedDate).ToList();
                }
                if (request.startDate is not null && request.endDate is not null)
                {
                    getAllJobs = getAllJobs.Where(x => x.CreatedDate.Date >= request.startDate.Value.Date && x.CreatedDate.Date <= request.endDate.Value.Date).ToList();
                }
                if (request.DepartmentId is not null)
                {
                    getAllJobs = getAllJobs.Where(x => x.DepartmentId == request.DepartmentId).ToList();
                }
                if (request.EmployeeId is not null)
                {
                    getAllJobs = getAllJobs.Where(x => x.EmployeeId == request.EmployeeId).ToList();
                }
                if (request.JobStatus is not null)
                {
                    getAllJobs = getAllJobs.Where(x => x.Status == request.JobStatus).ToList();
                }

                var jobList = _mapper.Map<List<BidResponse>>(getAllJobs);
                return jobList;
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get Jobs/ GetJobs by Department Id
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<List<BidResponse>> GetJobsByDepartmentId(Guid? departmentId)
        {
            try
            {
                var jobData = departmentId is not null ?
                    await _context.JobRecords
                    .Where(x => x.DepartmentId == departmentId)
                       .OrderByDescending(x => x.CreatedDate)
                       .ToListAsync()
                    :
                    await _context.JobRecords
                    .Where(x => x.IsActive && x.Status != (int)Status.Hired)
                       .OrderByDescending(x => x.CreatedDate)
                       .ToListAsync();

                var jobList = _mapper.Map<List<BidResponse>>(jobData);
                return jobList;
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }
        public async Task<List<BidReportResponse>> GetJobCalculations()
        {
            DateTime now = DateTime.Now;
            DateTime previousWeekStart = now.AddDays(-((int)now.DayOfWeek + 6) % 7).Date;
            DateTime previousWeekEnd = previousWeekStart.AddDays(6).Date;

            var roles = _claimsUtility.GetUserRoleFromClaims();
            var employeesDetails = new List<BidReportResponse>();

            var employeesQuery = _context.Employees.AsQueryable();

            switch (roles)
            {
                case nameof(Role.BD):
                    {
                        employeesQuery = employeesQuery.Where(x => x.Role == nameof(Role.BD) && x.EmployeeId == _claimsUtility.GetEmployeeIdFromClaims());
                        break;
                    }

                case nameof(Role.BDM):
                case nameof(Role.Admin):
                    {
                        employeesQuery = employeesQuery.Where(x => x.Role == nameof(Role.BDM) || x.Role == nameof(Role.BD));
                        break;
                    }

                default:
                    return new List<BidReportResponse>();
            }

            var employees = await employeesQuery.ToListAsync();

            foreach (var employee in employees)
            {
                var jobsStatus = await _context.JobRecords
                    .Where(x => x.EmployeeId == employee.EmployeeId && x.CreatedDate >= previousWeekStart && x.CreatedDate <= previousWeekEnd)
                    .ToListAsync();

                var employeeDetail = new BidReportResponse
                {
                    EmployeeName = $"{employee.FirstName} {employee.LastName}",
                    TotalApplied = jobsStatus.Count(record => record.Status == 1),
                    TotalLeads = jobsStatus.Count(record => record.Status == 2),
                    TotalHired = jobsStatus.Count(record => record.Status == 3),
                    TotalConnectUsed = jobsStatus.Sum(record => record.Connects)
                };

                employeesDetails.Add(employeeDetail);
            }
            return employeesDetails;
        }
    }
}
