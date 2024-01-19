using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ST.ERP.Helper;
using ST.ERP.Helper.Context;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;
using System.Text.RegularExpressions;

namespace ST.ERP.Infrastructure.Services
{
    public class DepartmentService : IDepartmentService
    {
        #region Fields
        private readonly STERPContext _context;
        private readonly IMapper _mapper;
        #endregion

        #region Constructor
        public DepartmentService(STERPContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        #endregion

        #region Public Methods

        /// <summary>
        /// Create Department
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<DepartmentResponse> CreateDepartment(DepartmentRequest request)
        {
            try
            {
                var trimmedString = request.DepartmentName.Trim();
                request.DepartmentName = Regex.Replace(trimmedString, @"\s+", " ");
                var department = await _context.Departments.AsNoTracking()
                    .FirstOrDefaultAsync(d => d.DepartmentId == request.DepartmentId);
                if (department is null)
                {
                    var departmentData = _mapper.Map<Department>(request);
                    await _context.Departments.AddAsync(departmentData);
                    await _context.SaveChangesAsync();
                    return new DepartmentResponse { Success = true, Message = "Department Added Successfully!" };
                }
                else
                {
                    var departmentData = _mapper.Map<Department>(request);

                    _context.Departments.Update(departmentData);
                    await _context.SaveChangesAsync();
                    return new DepartmentResponse { Success = true, Message = "Department Updated Successfully!" };
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Delete Department
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<DepartmentResponse> DeleteDepartment(Guid id)
        {
            try
            {
                bool existsDepartmentExistsInOtherTables = await _context.Employees.AsNoTracking().AnyAsync(x => x.DepartmentId == id)
                    || await _context.Connects.AsNoTracking().AnyAsync(x => x.DepartmentId == id)
                    || await _context.ProjectBillings.AsNoTracking().AnyAsync(x => x.DepartmentId == id)
                    || await _context.ProjectDepartments.AsNoTracking().AnyAsync(x => x.DepartmentId == id);

                if(existsDepartmentExistsInOtherTables)
                    throw new AppException($"You can't delete the Department as it's reference exists on other modules!");

                var department = await _context.Departments.AsNoTracking().FirstOrDefaultAsync(c => c.DepartmentId == id);
                if (department is not null)
                {
                    department.IsActive = false;
                    _context.Departments.Update(department);
                    await _context.SaveChangesAsync();
                    return new DepartmentResponse { Success = true, Message = "Department deleted successfully!" };
                }

                throw new KeyNotFoundException($"Department is not exists!");
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get Department By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<DepartmentResponse> GetDepartmentById(Guid id)
        {
            try
            {
                var department = await _context.Departments.AsNoTracking().Include(e => e.Employees).Where(x => x.IsActive)
                    .FirstOrDefaultAsync(d => d.DepartmentId == id);
                if (department is not null)
                {
                    var departmentData = _mapper.Map<Department>(department);
                    return new DepartmentResponse { Success = true, Department = departmentData, Message = "Department found successfully" };
                }

                throw new KeyNotFoundException($"Department is not exists!");
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        /// <summary>
        /// Get Department
        /// </summary>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<List<Department>> GetDepartments()
        {
            try
            {
                return await _context.Departments.AsNoTracking().Include(e => e.Employees).OrderBy(d => d.DepartmentName)
                    .Where(x => x.IsActive).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<List<Department>> GetDepartmentsWithProjects()
        {
            try
            {
                return await _context.Departments.AsNoTracking().Include(e => e.Employees).Include(e=>e.ProjectDepartments).ThenInclude(x => x.Project)
                    .OrderBy(d => d.DepartmentName)
                   .Where(x => x.IsActive).ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        #endregion
    }
}
