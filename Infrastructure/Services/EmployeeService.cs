using AutoMapper;
using Azure.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Client;
using OfficeOpenXml;
using ST.ERP.Helper;
using ST.ERP.Helper.Context;
using ST.ERP.Helper.Impoter_Utilites;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;
using System.Security;
using static ST.ERP.Helper.Enums;

namespace ST.ERP.Infrastructure.Services
{
    public class EmployeeService : IEmployeeService
    {
        #region Fields
        public List<EmployeeResponseData> filteredEmployees = new();
        private readonly STERPContext _context;
        private readonly IMapper _mapper;
        private readonly ILeavesService _leavesService;
        private readonly IDepartmentService _departmentService;
        private const string SupremeDomain = "supremetechnologiesindia.com";
        private readonly ClaimsUtility _claimsUtility;
        #endregion

        #region Constructor
        public EmployeeService(STERPContext context, IMapper mapper,
            ClaimsUtility claimsUtility, ILeavesService leavesService, IDepartmentService departmentService)
        {
            _context = context;
            _mapper = mapper;
            _claimsUtility = claimsUtility;
            _leavesService = leavesService;
            _departmentService = departmentService;
        }
        #endregion

        #region Public Methods

        /// <summary>
        /// Create Employee
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<EmployeeResponse> CreateEmployee(CreateEmployeeRequest request)
        {
            try
            {
                var employee = await _context.Employees.AsNoTracking().FirstOrDefaultAsync(c => c.EmployeeNumber == request.EmployeeNumber);
                var employees = await _context.Employees.AsNoTracking().ToListAsync();

                if (request.Email.Contains('@'))
                {
                    var domain = request.Email.Split("@")[1];
                    if (domain is not SupremeDomain)
                    {
                        throw new AppException("Organization Domain is incorrect!");
                    }
                }
                else
                {
                    throw new AppException("Email is Incorrect");
                }
                if (employee is null)
                {
                     CheckDuplicateData(request, employees);
                    /*request.SickLeaves = GetSickLeaveCount(request.JoiningDate.GetValueOrDefault());
                    request.CasualLeaves = GetCasualLeaveCount(request.JoiningDate.GetValueOrDefault());*/
                    if (!request.ResignationDate.HasValue || string.IsNullOrEmpty(Convert.ToString(request.ResignationDate)))
                    {
                        request.ResignationDate = null;
                    }

                    var userData = _mapper.Map<Employee>(request);
                    userData.IsActive = true;
                    await _context.Employees.AddAsync(userData);
                    await _context.SaveChangesAsync();
                    return new EmployeeResponse { Success = true, Message = "Employee created successfully!", User = employee };
                }
                else
                {
                    var filteredEmployees = employees.Where(e => e.EmployeeNumber != employee.EmployeeNumber).ToList();
                    CheckDuplicateData(request, filteredEmployees);
                    var data = _mapper.Map(request, new Employee()
                    {
                        CreatedBy = employee.CreatedBy,
                        CreatedDate = employee.CreatedDate,
                    });
                    _context.Employees.Update(data);
                    await _context.SaveChangesAsync();
                    return new EmployeeResponse { Success = true, Message = "Employee updated successfully!", User = data };
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        private static void CheckDuplicateData(CreateEmployeeRequest request, List<Employee> employees)
        {
            if (employees.Any(x => x.EmployeeNumber == request.EmployeeNumber) ||
                employees.Any(x => x.MobileNo == request.MobileNo) ||
                employees.Any(x => x.Email == request.Email))
            {
                throw new AppException("Employee data already exists");
            }
        }

        /// <summary>
        /// Get Employee By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<EmployeeResponse> GetEmployeeById(Guid? id)
        {
            try
            {
                var employees = await _context.Employees.AsNoTracking().Include(d => d.Department)
                      .FirstOrDefaultAsync(e => e.EmployeeId == id);
                if (employees is not null)
                {
                    var employeesData = _mapper.Map<EmployeeResponseData>(employees);
                    return new EmployeeResponse { Success = true, EmployeeModel = employeesData, Message = "Data Found Successfully" };
                }
                throw new AppException("Data not found!");
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }

        /// <summary>
        /// Get Employees/ GetEmployees by Department Id
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<List<EmployeeResponseData>?> GetEmployees(CustomDepartmentFilterRequest request)
        {
            try
            {
                var employees = request.DepartmentId is not null ?
                    await _context.Employees.Include(d => d.Department)
                    .Where(x => x.IsActive && x.DepartmentId == request.DepartmentId)
                    .OrderByDescending(e => e.EmployeeId).ToListAsync()
                    :
                    await _context.Employees.Include(d => d.Department).Where(x => x.IsActive).OrderByDescending(e => e.EmployeeId).ToListAsync();
                var allEmployees = _mapper.Map<List<EmployeeResponseData>>(employees);
                GetAssignedEmployees(allEmployees, _claimsUtility.GetEmployeeIdFromClaims());
                filteredEmployees.AddRange(allEmployees.Where(x => x.DepartmentId == _claimsUtility.GetDepartmentIdFromClaims()));
                // Remove employees with duplicate EmployeeId
                filteredEmployees = filteredEmployees
                    .GroupBy(x => x.EmployeeId)
                    .Select(group => group.First())
                    .ToList();
                return _claimsUtility.GetUserRoleFromClaims() is nameof(Role.Admin) or nameof(Role.HR) ? allEmployees : filteredEmployees;
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }

        /// <summary>
        /// Delete Employee
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<EmployeeResponse> DeleteEmployee(Guid id)
        {
            try
            {
                var employees = await _context.Employees.AsNoTracking().FirstOrDefaultAsync(c => c.EmployeeId == id);
                if (employees is not null)
                {
                    employees.IsActive = false;
                    _context.Employees.Update(employees);
                    await _context.SaveChangesAsync();
                    await DeleteMappedEmployeeId(employees);
                    return new EmployeeResponse { Success = true, Message = "Employee deleted successfully!" };
                }
                throw new AppException($"Employee not Found/Removed");
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }


        /// <summary>
        /// Update Profile Picture
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public async Task<EmployeeResponse> UpdateProfilePicture(CreateEmployeeRequest request)
        {
            var employee = await _context.Employees.AsNoTracking().FirstOrDefaultAsync(c => c.EmployeeId == request.EmployeeId);
            if (employee is not null)
            {
                employee.ProfilePicture = request.ProfilePicture;
                _context.Employees.Update(employee);
                await _context.SaveChangesAsync();
                var employeeDataDept = await _context.Employees.Include(x => x.Department).AsNoTracking().FirstOrDefaultAsync(x => x.EmployeeId == request.EmployeeId);
                return new EmployeeResponse { Success = true, Message = "Employee updated successfully!", User = employeeDataDept };
            }

            throw new AppException("Employee not found!");
        }

        /// <summary>
        /// Get Employees for Department
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<List<EmployeeResponseData>?> GetEmployeesForDepartment(CustomFilterByDepartmentIds request)
        {
            try
            {
                var employees = await _context.Employees.Include(d => d.Department)
                                .Where(x => x.IsActive && request.DepartmentIds.Contains(x.DepartmentId)).ToListAsync();
                return _mapper.Map<List<EmployeeResponseData>>(employees);
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }
        }

        /// <summary>
        ///Upload Bulk Employees
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="AppException"></exception>
        public async Task<EmployeeResponse> ImportEmployeeListFile(ImportEmployeeRequest model)
        {
            try
            {
                var extension = Path.GetExtension(model.File.FileName);
                if (extension.IndexOf("xls") == -1)
                {
                    throw new Exception("Invalid file type. Please use a valid Excel file.");
                }
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
                            var employee = UploadExcelFile.GetExcelData<ImporterEmployeeLogsRequest>(worksheet);
                            var dbEmployees = await _context.Employees.AsNoTracking().ToListAsync();
                            var empList = employee.GroupBy(x => new { x.EmployeeNumber, x.Email, x.MobileNo }).Select(group => group.First()).ToList();

                            foreach (var check in empList)
                            {
                                if (dbEmployees.Any(x => x.EmployeeNumber.Contains(check.EmployeeNumber) ||
                                                x.Email.Contains(check.Email) || x.MobileNo.Contains(check.MobileNo)))
                                {
                                    throw new AppException($"Data already exist in the database");
                                }
                            }

                            if (empList.Count is not 0)
                            {
                                foreach (var row in empList)
                                {
                                    var deptID = _context.Departments.Where(x => x.DepartmentName == row.DepartmentName).FirstOrDefault();
                                    var emp = new Employee
                                    {
                                        EmployeeNumber = row.EmployeeNumber,
                                        FirstName = row.FirstName,
                                        LastName = row.LastName,
                                        Email = row.Email,
                                        Role = row.Role,
                                        MobileNo = row.MobileNo,
                                        Address = row.Address,
                                        Gender = row.Gender,
                                        JoiningDate = Convert.ToDateTime(row.JoiningDate),
                                        EmployeeTargetedHours = Convert.ToInt32(row.EmployeeTargetedHours),
                                        CasualLeaves = Convert.ToInt32(row.CasualLeaves),
                                        SickLeaves = Convert.ToInt32(row.SickLeaves),
                                        DepartmentId = deptID.DepartmentId,
                                        IsActive = true,
                                    };

                                    if (emp.Email == null)
                                    {
                                        throw new AppException("Email Not Found");
                                    }

                                    if (emp.Email.Contains('@'))
                                    {
                                        var domain = emp.Email.Split("@")[1];
                                        if (domain is not SupremeDomain)
                                        {
                                            continue;
                                        }
                                    }
                                    await _context.Employees.AddAsync(emp);
                                }
                                await _context.SaveChangesAsync();
                            }
                        }
                    }
                    return new EmployeeResponse { Success = true, Message = "Employee data imported Successfully" };
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<List<EmployeeResponseData>> GetActiveTeamMembers(Guid id)
        {
            try
            {
                var loggedInUser = await _context.Employees.AsNoTracking().Include(d => d.Department).FirstOrDefaultAsync(e => e.EmployeeId == id);
                var teamMembers = await _context.Employees.AsNoTracking().Where(d => d.DepartmentId == loggedInUser.DepartmentId && d.EmployeeId != id && d.IsActive == true).ToListAsync();
                return _mapper.Map<List<EmployeeResponseData>>(teamMembers);
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }
        public async Task<ExportReportResponse> DownloadEmployee()
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
                    mainSheet.Cells[row, 1].Value = "Employee Number";
                    mainSheet.Cells[row, 2].Value = "First Name";
                    mainSheet.Cells[row, 3].Value = "Last Name";
                    mainSheet.Cells[row, 4].Value = "Address";
                    mainSheet.Cells[row, 5].Value = "Email";
                    mainSheet.Cells[row, 6].Value = "Role";
                    mainSheet.Cells[row, 7].Value = "Mobile No";
                    mainSheet.Cells[row, 8].Value = "Gender";
                    mainSheet.Cells[row, 9].Value = "Joining Date";
                    mainSheet.Cells[row, 10].Value = "Employee Targeted Hours";
                    mainSheet.Cells[row, 11].Value = "Casual Leaves";
                    mainSheet.Cells[row, 12].Value = "Sick Leaves";
                    mainSheet.Cells[row, 13].Value = "DepartmentName";
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
                    mainSheet.Cells["E2"].Value = "@supremetechnologiesindia.com";
                    mainSheet.Cells["M2"].Value = "Please Select Department(s) From DepartmentSheet";

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

        #endregion

        #region Private Methods

        /// <summary>
        /// Get Employee
        /// </summary>
        /// <param name="id"></param>
        /// <param name="employeeData"></param>
        /// <param name="data"></param>
        /// <returns></returns>
        private IEnumerable<Employee> GetEmployee(Guid id, List<Employee> employeeData, List<Employee> data)
        {
            var result = data.Where(x => x.AssignedTo == id).ToList();
            while (result.Count > 0)
            {
                foreach (var item in result)
                {
                    employeeData.Add(item);
                    GetEmployee(item.EmployeeId, employeeData, data);
                }

                return employeeData;
            }
            return employeeData;
        }

        /// <summary>
        /// Get Assigned Employees
        /// </summary>
        /// <param name="employees"></param>
        /// <param name="employeeId"></param>
        private void GetAssignedEmployees(List<EmployeeResponseData> employees, Guid? employeeId)
        {
            var employeeList = employees.Where(x => x.AssignedTo == employeeId).ToList();
            filteredEmployees.AddRange(employeeList);

            foreach (var list in employeeList)
            {
                GetAssignedEmployees(employees, list.EmployeeId);
            }
        }

        /// <summary>
        /// Delete assigned employee from the project after project delete
        /// </summary>
        /// <param name="employee"></param>
        private async Task DeleteMappedEmployeeId(Employee employee)
        {
            var employeeProject = await _context.EmployeeProjects?.AsNoTracking().FirstOrDefaultAsync(p => p.EmployeeId == employee.EmployeeId);
            if (employeeProject is not null)
            {
                employeeProject.IsActive = false;
                _context.EmployeeProjects.Update(employeeProject);
                await _context.SaveChangesAsync();
            }
            var employeeLeaves = await _context.Leaves?.AsNoTracking().FirstOrDefaultAsync(p => p.EmployeeId == employee.EmployeeId);
            if (employeeLeaves is not null)
            {
                await _leavesService.RemoveLeave(employeeLeaves.Id);
            }
        }

        /// <summary>
        /// Assigning sick leaves to the new joinee month wise
        /// </summary>
        /// <param name="joiningDate"></param>
        /*private int GetSickLeaveCount(DateTime joiningDate)
        {
            int count = 0;

            if(joiningDate.Year == DateTime.Now.Year)
            {
                switch(joiningDate.Month)
                {
                    case 1:
                    case 2:
                    case 3:
                        count = 9; 
                        break;
                    case 4: 
                        count = joiningDate.Day <= 15 ? 9 : 6; 
                        break;
                    case 5:
                    case 6:
                    case 7:
                        count = 6;
                        break;
                    case 8:
                        count = joiningDate.Day <= 15 ? 6 : 3;
                        break;
                    case 9:
                    case 10:
                    case 11:
                        count = 3;
                        break;
                    case 12:
                        count = joiningDate.Day <= 15 ? 3 : 0;
                        break;
                }
            }

            return count;
        }*/

        /// <summary>
        /// Assigning casual leaves to the new joinee month wise
        /// </summary>
        /// <param name="joiningDate"></param>
        /*private int GetCasualLeaveCount(DateTime joiningDate)
        {
            int count = 0;

            if (joiningDate.Year == DateTime.Now.Year)
            {
                switch (joiningDate.Month)
                { 
                    case 1:
                        count = joiningDate.Day <= 15 ? 12 : 11;
                        break; 
                    case 2:
                        count = joiningDate.Day <= 15 ? 11 : 10;
                        break;
                    case 3:
                        count = joiningDate.Day <= 15 ? 10 : 9;
                        break;
                    case 4:
                        count = joiningDate.Day <= 15 ? 9 : 8;
                        break;
                    case 5:
                        count = joiningDate.Day <= 15 ? 8 : 7;
                        break;
                    case 6:
                        count = joiningDate.Day <= 15 ? 7 : 6;
                        break;
                    case 7:
                        count = joiningDate.Day <= 15 ? 6 : 5;
                        break;
                    case 8:
                        count = joiningDate.Day <= 15 ? 5 : 4;
                        break;
                    case 9:
                        count = joiningDate.Day <= 15 ? 4 : 3;
                        break;
                    case 10:
                        count = joiningDate.Day <= 15 ? 3 : 2;
                        break;
                    case 11:
                        count = joiningDate.Day <= 15 ? 2 : 1;
                        break;
                    case 12:
                        count = joiningDate.Day <= 15 ? 1 : 0;
                        break;
                }
            }

            return count;
        }*/

        #endregion
    }
}
