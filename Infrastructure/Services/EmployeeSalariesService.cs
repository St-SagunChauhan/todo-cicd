using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ST.ERP.Helper;
using ST.ERP.Helper.Context;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;
using static ST.ERP.Helper.Enums;

namespace ST.ERP.Infrastructure.Services
{
    public class EmployeeSalariesService : IEmployeeSalariesService
    {
        #region Fields
        private readonly STERPContext _context;
        private readonly IMapper _mapper;
        private readonly ClaimsUtility _claimsUtility;
        #endregion

        #region Constructor
        public EmployeeSalariesService(STERPContext context, IMapper mapper, ClaimsUtility claimsUtility)
        {
            _context = context;
            _mapper = mapper;
            _claimsUtility = claimsUtility;
        }
        #endregion

        #region PublicMethod

        /// <summary>
        /// Create Employee Salary
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<EmployeeSalariesResponse> CreateEmployeeSalary(EmployeeSalariesRequest request)
        {
            try
            {
                var employeeSalary = await _context.EmployeeSalaries.AsNoTracking().FirstOrDefaultAsync(e => e.SalaryId == request.SalaryId);

                if (employeeSalary is null)
                {
                    var employeeSalaryData = _mapper.Map<EmployeeSalary>(request);
                    await _context.EmployeeSalaries.AddAsync(employeeSalaryData);
                    await _context.SaveChangesAsync();
                    return new EmployeeSalariesResponse { Success = true, EmployeeSalaries = employeeSalary, Message = "Employee Salary Added Successfully" };
                }
                else
                {
                    var data = _mapper.Map(request, new EmployeeSalary()
                    {
                        CreatedBy = employeeSalary.CreatedBy,
                        CreatedDate = employeeSalary.CreatedDate,
                    });
                    _context.EmployeeSalaries.Update(data);
                    await _context.SaveChangesAsync();
                    return new EmployeeSalariesResponse { Success = true, Message = "Employee Salary Updated Successfully" };
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }

        /// <summary>
        /// Delete Employee Salary
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<EmployeeSalariesResponse> DeleteEmployeeSalary(Guid id)
        {
            try
            {
                var employeeSalary = await _context.EmployeeSalaries.AsNoTracking().FirstOrDefaultAsync(e => e.SalaryId == id);
                if (employeeSalary is null)
                {
                    throw new KeyNotFoundException($"Employee Salary is not exists!");
                }
                employeeSalary.IsActive = false;
                _context.EmployeeSalaries.Update(employeeSalary);
                await _context.SaveChangesAsync();
                return new EmployeeSalariesResponse { Success = true, Message = "Employee Salary deleted successfully!" };
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get All Employee Salary
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<List<EmployeeSalaryResponse>> GetAllEmployeeSalary(CustomDepartmentFilterRequest request)
        {
            try
            {
                var currentUserRole = _claimsUtility.GetUserRoleFromClaims();
                var employeeSalariesList = new List<EmployeeSalaryResponse>();
                var employeeSalaries = request.DepartmentId is not null ?
                    await _context.EmployeeSalaries.AsNoTracking()
                    .Include(e => e.Employee).ThenInclude(e => e.Department).Where(x => x.IsActive && x.Employee.DepartmentId == request.DepartmentId).ToListAsync()
                     :
                     await _context.EmployeeSalaries.AsNoTracking()
                    .Include(e => e.Employee).ThenInclude(e => e.Department).Where(x => x.IsActive).ToListAsync();
                var getEmployeeSalaries = _mapper.Map<List<EmployeeSalaryResponse>>(employeeSalaries);
                var filteredEmployeeSalary = getEmployeeSalaries.Where(x => x.EmployeeId == _claimsUtility.GetEmployeeIdFromClaims()).ToList();
                return currentUserRole is nameof(Role.Admin) or nameof(Role.HR) ? getEmployeeSalaries : filteredEmployeeSalary; 
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }

        /// <summary>
        /// Get Employee Salary By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<EmployeeSalariesResponse> GetEmployeeSalaryById(Guid id)
        {
            try
            {
                var employeeSalary = await _context.EmployeeSalaries.AsNoTracking().Include(e => e.Employee)
                    .FirstOrDefaultAsync(x => x.SalaryId == id && x.IsActive == true);

                if (employeeSalary is null)
                {
                    throw new KeyNotFoundException($"Employee Salary is not exists!");
                }
                var employeeSalaryData = _mapper.Map<EmployeeSalary>(employeeSalary);
                return new EmployeeSalariesResponse { Success = true, EmployeeSalaries = employeeSalaryData };
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }

        #endregion
    }
}
