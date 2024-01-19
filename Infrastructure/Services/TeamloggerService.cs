using AutoMapper;
using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using OfficeOpenXml.Table;
using ST.ERP.Helper;
using ST.ERP.Helper.Context;
using ST.ERP.Helper.Impoter_Utilites;
using ST.ERP.Infrastructure.Interfaces;
using ST.ERP.Models.CustomModels;
using ST.ERP.Models.DAO;
using ST.ERP.Models.DTO;
using System.Drawing;
using System.Globalization;
using System.Text.RegularExpressions;
using static ST.ERP.Helper.Enums;

namespace ST.ERP.Infrastructure.Services
{
    public class TeamloggerService : ITeamloggerService
    {
        #region Fields
        private readonly STERPContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMapper _mapper;
        #endregion

        #region Constructor

        public TeamloggerService(STERPContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
        }

        #endregion
        public async Task<List<TeamLoggerReport>> GetTeamloggerRecords(CustomDepartmentFilterRequest request)
        {
            var teamLoggerList = new List<TeamLoggerReport>();
            var department = await _context.Departments.Where(x => x.DepartmentId == request.DepartmentId).FirstOrDefaultAsync();

            List<TeamLoggerReport> teamLoggerData;

            if (request.RecordDate is not null && request.DepartmentId is not null)
            {
                teamLoggerData = await _context.TeamLoggerReports
                    .Where(x => x.Department == department.DepartmentName &&
                                x.RecordDate == request.RecordDate.Value.Date).ToListAsync();
            }
            else if (request.RecordDate is not null)
            {
                teamLoggerData = await _context.TeamLoggerReports
                    .Where(x => x.RecordDate.Value.Date == request.RecordDate.Value.Date)
                    .ToListAsync();
            }
            else if (request.DepartmentId is not null)
            {
                teamLoggerData = await _context.TeamLoggerReports
                    .Where(x => x.Department == department.DepartmentName)
                    .ToListAsync();
            }
            else
            {
                teamLoggerData = await _context.TeamLoggerReports.ToListAsync();
            }
            if (request.DepartmentId is not null)
            {
                teamLoggerData = teamLoggerData.Where(x => x.Department == department.DepartmentName).ToList();
            }
            if (request.RecordDate.HasValue)
            {
                teamLoggerData = teamLoggerData.Where(x => x.RecordDate.Value.Date == request.RecordDate.Value.Date).ToList();
            }

            teamLoggerList.AddRange(teamLoggerData);

            return teamLoggerList;
        }

        public async Task<TeamLoggerReportResponse> ImportTeamloggerFile(TeamLoggerReportRequest model)
        {
            try
            {
                var extension = Path.GetExtension(model.File.FileName);
                if (extension.IndexOf("xls") == -1) { throw new Exception("Invalid file type. Please use a valid Excel file."); }
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
                            var teamLogger = UploadExcelFile.GetExcelData<ImporterTeamLogsRequest>(worksheet);
                            //var dbTeamLogger = await _context.TeamLoggerReports.ToListAsync();

                            if (teamLogger?.Count is not null)
                            {
                                foreach (var item in teamLogger)
                                {
                                    if (item?.Timer is not null)
                                    {
                                        DateTime dateTime = DateTime.ParseExact(item?.Timer, "MM/dd/yyyy h:mm:ss tt", CultureInfo.InvariantCulture);
                                        item.Timer = dateTime.ToString("HH\\:mm") ?? string.Empty;

                                    }

                                    if (item?.Manual is not null)
                                    {
                                        DateTime manual = DateTime.ParseExact(item?.Manual, "MM/dd/yyyy h:mm:ss tt", CultureInfo.InvariantCulture);
                                        item.Manual = manual.ToString("HH\\:mm") ?? string.Empty;
                                    }
                                    if (item?.Inactive is not null)
                                    {
                                        DateTime inactive = DateTime.ParseExact(item?.Inactive, "MM/dd/yyyy h:mm:ss tt", CultureInfo.InvariantCulture);
                                        item.Inactive = inactive.ToString("HH\\:mm") ?? string.Empty;
                                    }

                                    if (item?.Total is not null)
                                    {
                                        DateTime total = DateTime.ParseExact(item?.Total, "MM/dd/yyyy h:mm:ss tt", CultureInfo.InvariantCulture);
                                        item.Total = total.ToString("HH\\:mm") ?? string.Empty;
                                    }

                                    if (item?.StartDay is not null)
                                    {
                                        DateTime startDay = DateTime.ParseExact(item?.StartDay, "MM/dd/yyyy h:mm:ss tt", CultureInfo.InvariantCulture);
                                        item.StartDay = startDay.ToString("HH\\:mm") ?? string.Empty;
                                    }

                                    if (item?.NextDay is not null)
                                    {
                                        DateTime endDay = DateTime.ParseExact(item?.NextDay, "MM/dd/yyyy h:mm:ss tt", CultureInfo.InvariantCulture);
                                        item.NextDay = endDay.ToString("HH\\:mm") ?? string.Empty;
                                    }
                                }
                                if (teamLogger.Count is not 0)
                                {
                                    await DeleteOldTeamloggerReport(teamLogger); 
                                    var teamLoggerDAO = _mapper.Map<List<TeamLoggerReport>>(teamLogger);
                                    _context.TeamLoggerReports.AddRange(teamLoggerDAO);
                                    await _context.SaveChangesAsync();
                                }
                                else
                                {
                                    throw new AppException("File Doesn't contain Data!");
                                }
                            }
                            await _context.SaveChangesAsync();
                        }
                    }
                    return new TeamLoggerReportResponse { Success = true, Message = "teamLogger file data imported Successfully" };
                }
            }
            catch (Exception ex)
            {
                throw new AppException(ex.Message);
            }
        }
        private async Task DeleteOldTeamloggerReport(List<ImporterTeamLogsRequest> data)
        {
            var recordDate = data.FirstOrDefault().RecordDate;
            var teamLoggerReport = await _context.TeamLoggerReports.AsNoTracking().Where(x => x.RecordDate == DateTime.Parse(recordDate)).ToListAsync();
            _context.TeamLoggerReports.RemoveRange(teamLoggerReport);
            await _context.SaveChangesAsync();

        }
        public async Task<ExportReportResponse> DownloadTeamlogger()
        {
            try
            {
                var dbTeamlogger = await _context.TeamLoggerReports.AsNoTracking().ToListAsync();

                MemoryStream stream = new();
                ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;
                using var excelFile = new ExcelPackage(stream);

                ExcelWorksheet worksheet = excelFile.Workbook.Worksheets.Add("Sheet1");
                int row = 1;
                string timeValue = "00:00";
                worksheet.Cells[row, 1].Value = "Name";
                worksheet.Cells[row, 2].Value = "Department";
                worksheet.Cells[row, 3].Value = "Timer";
                worksheet.Cells[row, 4].Value = "Manual";
                worksheet.Cells[row, 5].Value = "Inactive";
                worksheet.Cells[row, 6].Value = "StartDay";
                worksheet.Cells[row, 7].Value = "NextDay";
                worksheet.Cells[row, 8].Value = "Total";
                worksheet.Cells[row, 9].Value = "Remarks";
                worksheet.Cells[row, 10].Value = "RecordDate";
                worksheet.Cells["C2"].Value = timeValue;
                worksheet.Cells["D2"].Value = timeValue;
                worksheet.Cells["E2"].Value = timeValue;
                worksheet.Cells["F2"].Value = timeValue;
                worksheet.Cells["G2"].Value = timeValue;
                worksheet.Cells["H2"].Value = timeValue;
                worksheet.Cells["J2"].Value = "yyyy/mm/dd";
                excelFile.Save();
                stream.Position = 0;
                return new ExportReportResponse() { Streams = stream, Success = true };
            }
            catch (Exception ex)
            {
                throw new AppException(ex.ToString());
            }

        }

        public byte[] TeamloggerExcel(string reportname)
        {
            var dbTeamlogger = _context.TeamLoggerReports.AsNoTracking().ToList();

            var list = dbTeamlogger.Select(x => new TeamloggerResponse()
            {
                Name = x.Name,
                Department = x.Department,
                Timer = x.Timer,
                Manual = x.Manual,
                Inactive = x.Inactive,
                StartDay = x.StartDay,
                NextDay = x.NextDay,
                Total = x.Total,
                Remarks = x.Remarks,
                RecordDate = x.RecordDate
            }).ToList();

            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;
            ExcelPackage pack = new();
            ExcelWorksheet ws = pack.Workbook.Worksheets.Add(reportname);

            var headerCells = ws.Cells[1, 1, 1, 10];
            headerCells.Style.Fill.PatternType = ExcelFillStyle.Solid;
            headerCells.Style.Fill.BackgroundColor.SetColor(Color.LightBlue);
            headerCells.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            headerCells.Style.Font.Size = 15;

            ws.Cells[1, 1, 1, 10].LoadFromCollection(list, c => c.PrintHeaders = true);
            ws.Cells["A2"].LoadFromCollection(list, false, TableStyles.Light1);
            ws.Cells["C2"].Style.Numberformat.Format = "hh\\:mm";
            return pack.GetAsByteArray();
        }
    }
}
