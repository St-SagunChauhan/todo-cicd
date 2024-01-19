using AutoMapper;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using ST.ERP.Helper;
using ST.ERP.Helper.Context;
using ST.ERP.Helper.Impoter_Utilites;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;
using System.Drawing;
using static ST.ERP.Helper.Enums;

namespace ST.ERP.Infrastructure.Services
{
    public class HRExpenseService : IHRExpenseService
    {
        #region Fields
        private readonly STERPContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMapper _mapper;
        #endregion

        #region Constructor
        public HRExpenseService(STERPContext context, IHttpContextAccessor httpContextAccessor, IMapper mapper)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
        }
        #endregion

        #region Public Method
        public async Task<List<HRExpense>> GetHRExpense(HRExpenseRequest request)
        {
            try
            {
                var hrExpenseList = new List<HRExpense>();
                var hrExpenseData = !string.IsNullOrEmpty(Convert.ToString(request.ExpenseYear)) ?
                    await _context.HRExpense.Where(x => x.ExpenseYear == request.ExpenseYear).ToListAsync()
                     : await _context.HRExpense.Where(x => x.ExpenseYear == DateTime.Now.Year.ToString()).ToListAsync();
                if (hrExpenseData.Count > 0)
                {
                    var dataList = hrExpenseData.Select(x => new HRExpense()
                    {
                        ExpenseId = x.ExpenseId,
                        ExpenseName = x.ExpenseName,
                        January = x.January,
                        February = x.February,
                        March = x.March,
                        April = x.April,
                        May = x.May,
                        June = x.June,
                        July = x.July,
                        August = x.August,
                        September = x.September,
                        October = x.October,
                        November = x.November,
                        December = x.December,
                        ExpenseYear = x.ExpenseYear,
                    });
                    hrExpenseList.AddRange(dataList);
                }
                return hrExpenseData;
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }

        }

        public async Task<HRExpenseResponse> ImportHRExpense(HRExpenseRequest model)
        {
            try
            {
                var extension = Path.GetExtension(model.File.FileName);
                if (!extension.Contains("xls", StringComparison.CurrentCulture))
                {
                    throw new AppException("Invalid file type. Please use a valid Excel file.");
                }

                using var stream = new MemoryStream();
                await model.File.CopyToAsync(stream);
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using (var package = new ExcelPackage(stream))
                {
                    int iSheetsCount = package.Workbook.Worksheets.Count;
                    if (iSheetsCount > 0)
                    {
                        // Get the sheet by index
                        ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                        if (worksheet.Cells.Value == null)
                        {
                            worksheet.Cells.Value = "";
                        }
                        var hrExpenses = UploadExcelFile.GetExcelData<ImporterHR_ExpenseRequest>(worksheet);
                        if (hrExpenses.Count is not 0)
                        {
                            await DeleteCurrentYearExpenses(hrExpenses);
                            _context.HRExpense.AddRange(_mapper.Map<List<HRExpense>>(hrExpenses));
                            await _context.SaveChangesAsync();
                        }
                        else
                        {
                            throw new AppException("File Doesn't contain Data!");
                        }
                    }
                }
                return new HRExpenseResponse { Success = true, Message = "HR Expense data sheet has imported successfully" };
            }
            catch (Exception ex)
            {

                throw new AppException(ex.Message);
            }
        }

        private async Task DeleteCurrentYearExpenses(List<ImporterHR_ExpenseRequest> data)
        {
            var expenseYear = data.FirstOrDefault().ExpenseYear;
            var hrExpenses = await _context.HRExpense.AsNoTracking().Where(x => x.ExpenseYear == expenseYear).ToListAsync();
            _context.HRExpense.RemoveRange(hrExpenses);
            await _context.SaveChangesAsync();

        }
        public async Task<HRExpenseResponse> DownloadHRExpense()
        {
            try
            {
                MemoryStream stream = new();
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using var excelFile = new ExcelPackage(stream);

                if (!excelFile.Workbook.Worksheets.Any(ar => ar.Name == "Posts"))
                {
                    excelFile.Workbook.Worksheets.Add("Posts");
                }
                var worksheet = excelFile.Workbook.Worksheets["Posts"];

                // headers
                worksheet.Cells[1, 1].Value = "ExpenseName";
                worksheet.Cells[1, 2].Value = "January";
                worksheet.Cells[1, 3].Value = "February";
                worksheet.Cells[1, 4].Value = "March";
                worksheet.Cells[1, 5].Value = "April";
                worksheet.Cells[1, 6].Value = "May";
                worksheet.Cells[1, 7].Value = "June";
                worksheet.Cells[1, 8].Value = "July";
                worksheet.Cells[1, 9].Value = "August";
                worksheet.Cells[1, 10].Value = "September";
                worksheet.Cells[1, 11].Value = "October";
                worksheet.Cells[1, 12].Value = "November";
                worksheet.Cells[1, 13].Value = "December";
                worksheet.Cells[1, 14].Value = "ExpenseYear";

                int row = 2;

                worksheet.Cells[row, 1].Value = "ExpenseName(TDS Rest)";
                worksheet.Cells[row, 2].Value = 0;
                worksheet.Cells[row, 3].Value = 0;
                worksheet.Cells[row, 4].Value = 0;
                worksheet.Cells[row, 5].Value = 0;
                worksheet.Cells[row, 6].Value = 0;
                worksheet.Cells[row, 7].Value = 0;
                worksheet.Cells[row, 8].Value = 0;
                worksheet.Cells[row, 9].Value = 0;
                worksheet.Cells[row, 10].Value = 0;
                worksheet.Cells[row, 11].Value = 0;
                worksheet.Cells[row, 12].Value = 0;
                worksheet.Cells[row, 13].Value = 0;
                worksheet.Cells[row, 14].Value = DateTime.Now.Year.ToString();

                row++;

                excelFile.Save();

                stream.Position = 0;
                return new HRExpenseResponse() { Streams = stream, Success = true };
            }


            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }

        }

        public async Task<HRExpenseResponse> DownloadHiringListTemplate()
        {
            try
            {
                MemoryStream stream = new();
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using var excelFile = new ExcelPackage(stream);

                if (!excelFile.Workbook.Worksheets.Any(ar => ar.Name == "Posts"))
                {
                    excelFile.Workbook.Worksheets.Add("Posts");
                }
                var worksheet = excelFile.Workbook.Worksheets["Posts"];

                // headers
                worksheet.Cells[1, 1].Value = "Name";
                worksheet.Cells[1, 2].Value = "SourceofCV";
                worksheet.Cells[1, 3].Value = "ContactDetails";
                worksheet.Cells[1, 4].Value = "Department";
                worksheet.Cells[1, 5].Value = "Designation";
                worksheet.Cells[1, 6].Value = "Email";
                worksheet.Cells[1, 7].Value = "InterviewScheduled";
                worksheet.Cells[1, 8].Value = "TotalExperience";
                worksheet.Cells[1, 9].Value = "CurrentSalary";
                worksheet.Cells[1, 10].Value = "ExpectedSalary";
                worksheet.Cells[1, 11].Value = "PFAccount";
                worksheet.Cells[1, 12].Value = "CurrentEmployer";
                worksheet.Cells[1, 13].Value = "NoticePeriod";
                worksheet.Cells[1, 14].Value = "Result";
                worksheet.Cells[1, 15].Value = "Remarks";
                worksheet.Cells[1, 16].Value = "Round";
                worksheet.Cells[1, 17].Value = "ConductedBy";
                excelFile.Save();
                stream.Position = 0;
                return new HRExpenseResponse() { Streams = stream, Success = true };
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<HRExpenseResponse> ImportHiringList(FormFileUpload model)
        {
            try
            {
                var extension = Path.GetExtension(model.File.FileName);
                if (!extension.Contains("xls", StringComparison.CurrentCulture))
                {
                    throw new AppException("Invalid file type. Please use a valid Excel file.");
                }

                using var stream = new MemoryStream();
                await model.File.CopyToAsync(stream);
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using (var package = new ExcelPackage(stream))
                {
                    int iSheetsCount = package.Workbook.Worksheets.Count;
                    if (iSheetsCount > 0)
                    {
                        // Get the sheet by index
                        ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                        if (worksheet.Cells.Value == null)
                        {
                            worksheet.Cells.Value = "";
                        }
                        var hrExpenses = UploadExcelFile.GetExcelData<ImporterHiringList>(worksheet);
                        if (hrExpenses.Count is not 0)
                        {
                            foreach (var hrExpense in hrExpenses)
                            {
                                var existingRecord = await _context.HiringList.FirstOrDefaultAsync(e => e.Email == hrExpense.Email);
                                if (existingRecord == null)
                                {
                                    _context.HiringList.Add(_mapper.Map<HiringList>(hrExpense));
                                }
                                else
                                {
                                    _mapper.Map(hrExpense, existingRecord); // Update the existing record's properties.
                                    _context.HiringList.Update(existingRecord);
                                }
                                await _context.SaveChangesAsync(); // Save changes after processing each hrExpense.
                            }
                        }
                        else
                        {
                            throw new AppException("File Doesn't contain Data!");
                        }
                    }
                }
                return new HRExpenseResponse { Success = true, Message = "HR Expense data sheet has imported successfully" };
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }

        public async Task<List<HiringList>> GetHiringList()
        {
            try
            {
                var hiringList = new List<HiringList>();
                var hiringDataList = await _context.HiringList.ToListAsync();
                if (hiringDataList.Count > 0)
                {
                    var dataList = hiringDataList.Select(x => new HiringList()
                    {
                        Name = x.Name,
                        SourceofCV = x.SourceofCV,
                        ContactDetails = x.ContactDetails,
                        Department = x.Department,
                        Designation = x.Designation,
                        Email = x.Email,
                        InterviewScheduled = x.InterviewScheduled,
                        TotalExperience = x.TotalExperience,
                        CurrentSalary = x.CurrentSalary,
                        ExpectedSalary = x.ExpectedSalary,
                        PFAccount = x.PFAccount,
                        CurrentEmployer = x.CurrentEmployer,
                        NoticePeriod = x.NoticePeriod,
                        Result = x.Result,
                        Remarks = x.Remarks,
                        Round = x.Round,
                        ConductedBy = x.ConductedBy,
                    });
                    hiringList.AddRange(dataList);
                }
                return hiringDataList;
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }
        public async Task<List<HiringListByDepartment>> GetDepartmentHiringList(string departmentId)
        {
            try
            {
                string str = departmentId;
                Guid deptguid = new Guid(str);
                var departmentName = await _context.Departments.Where(x => x.DepartmentId == deptguid).Select(x => x.DepartmentName).FirstOrDefaultAsync();

                var hiringList = await _context.HiringList
                    .Where(x => x.Department == departmentName)
                    .Select(x => new HiringListByDepartment
                    {
                        Name = x.Name,
                        InterviewScheduled = x.InterviewScheduled,
                        TotalExperience = x.TotalExperience,
                        Remarks = x.Remarks,
                        ConductedBy = x.ConductedBy,
                    })
                    .ToListAsync();
                return hiringList;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
    #endregion
}
