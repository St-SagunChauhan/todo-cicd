using Microsoft.EntityFrameworkCore;
using ST.ERP.Helper;
using ST.ERP.Helper.Context;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;

namespace ST.ERP.Infrastructure.Services
{
    public class DashboardService : IDashboardService
    {
        #region Fields

        private readonly STERPContext _context;
        private readonly ClaimsUtility _claimsUtility;

        #endregion

        #region Constructor

        public DashboardService(STERPContext context, ClaimsUtility claimsUtility)
        {
            _context = context;
            _claimsUtility = claimsUtility;
        }

        #endregion

        /// <summary>
        /// Get Employee Hours Detail
        /// </summary>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<DashBoardResponse> GetEmployeeHoursDetail()
        {
            DashBoardResponse employeeHoursDetail = new DashBoardResponse();

            try
            {
                var claimsDepartmentId = _claimsUtility.GetDepartmentIdFromClaims();
                var employees = GetDepartmentEmployees(claimsDepartmentId);
                var employeeList = GetEmployees();
                if (!employees.Any())
                {
                    return employeeHoursDetail;
                }
                var projectDepartmentIds = await GetProjectDepartmentIds(claimsDepartmentId);
                var billings = await GetProjectBillings(projectDepartmentIds);

                if (projectDepartmentIds.Any())
                {
                    PopulateDashboardSummary(employeeHoursDetail, employees, billings);
                }

                PopulateDashboardEmployees(employeeHoursDetail, employeeList, employees);

                return employeeHoursDetail;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        private  List<Employee> GetEmployees()
        {
            return  _context.Employees.Include(d => d.Department).Where(x => x.IsActive).OrderByDescending(e => e.EmployeeId).ToList();
        }

        private List<Employee> GetDepartmentEmployees(Guid deptId)
        {
            return _context.Employees
                            .Include(x => x.Department)
                            .Where(x => x.Department.DepartmentId == deptId)
                            .Include(x => x.EmployeeProjects)
                            .ToList();
        }
        private async Task<List<Guid>> GetProjectDepartmentIds(Guid deptId)
        {
            return await _context.ProjectDepartments
                .Where(x => x.DepartmentId == deptId)
                .Select(x => x.Id)
                .ToListAsync();
        }

        private async Task<List<ProjectBilling>> GetProjectBillings(List<Guid> projectDepartmentIds)
        {
            return await _context.ProjectBillings
                .Where(x => projectDepartmentIds.Contains(x.ProjectDepartmentId.Value))
                .ToListAsync();
        }

        private void PopulateDashboardSummary(DashBoardResponse employeeHoursDetail, List<Employee> employees, List<ProjectBilling> billings)
        {
            employeeHoursDetail.DepartmentName = employees.Select(x => x.Department.DepartmentName).FirstOrDefault();
            employeeHoursDetail.TotalWeeklyHours = billings.Sum(x => x.BillableHours);
            employeeHoursDetail.TotalBilledHours = billings.Sum(x => Convert.ToDecimal(x.HoursBilled));
            employeeHoursDetail.TotalUnbilledHours = employeeHoursDetail.TotalWeeklyHours - employeeHoursDetail.TotalBilledHours;
            employeeHoursDetail.TotalTargetHours = employees.Sum(x => x.EmployeeTargetedHours);
            employeeHoursDetail.OverAllCapacity = Math.Round((decimal)((employeeHoursDetail.TotalBilledHours / employeeHoursDetail.TotalTargetHours) * 100), 2);
        }

        private void PopulateDashboardEmployees(DashBoardResponse employeeHoursDetail, List<Employee> employeeList, List<Employee> employees)
        {
            foreach (var item in employeeList)
            {
                var employeeBillings = GetEmployeeBillings(item.EmployeeId);

                var result = employees.Find(x => x.EmployeeId == item.EmployeeId);
                employeeHoursDetail.DashBoardEmployees.Add(new DashBoardEmployeesResponse
                {
                    EmployeeName = $"{item.FirstName} {item.LastName}",
                    EmployeeDesignation = item.Role,
                    EmployeeTargetedHours = item.EmployeeTargetedHours,
                    EmployeeBillableHours = employeeBillings.Sum(x => x.BillableHours),
                    EmployeeBilledHours = employeeBillings.Sum(x => Convert.ToDecimal(x.HoursBilled)),
                    EmployeeUnBilledHours = employeeBillings.Sum(x => x.BillableHours) - employeeBillings.Sum(x => Convert.ToDecimal(x.HoursBilled)),
                });
            }
        }

        private List<ProjectBilling> GetEmployeeBillings(Guid employeeId)
        {
            var result = _context.Employees
                 .Join(_context.EmployeeProjects, e => e.EmployeeId, ep => ep.EmployeeId, (e, ep) => new { e, ep })
                 .Join(_context.ProjectDepartments, combined => combined.ep.ProjectId, pd => pd.ProjectId, (combined, pd) => new { combined.e, combined.ep, pd })
                 .Join(_context.ProjectBillings, combined => combined.pd.Id, pb => pb.ProjectDepartmentId, (combined, pb) => new { combined.e, combined.ep, combined.pd, pb })
                 .Where(combined => combined.e.EmployeeId == employeeId)
                 .Select(combined => combined.pb)  // Select the ProjectBilling object
                 .ToList();

            return result;
        }

    }
}
