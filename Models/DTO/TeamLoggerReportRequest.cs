using ST.ERP.Helper.Impoter_Utilites;

namespace ST.ERP.Models.DTO
{

    public class TeamLoggerReportRequest : FormFileUpload
    {
       
    }
    public class ImporterTeamLogsRequest
    {
        public string? Name { get; set; }
        public string? Department { get; set; }
        public string? Timer { get; set; }
        public string? Manual { get; set; }
        public string? Inactive { get; set; }
        public string? StartDay { get; set; }
        public string? NextDay { get; set; }
        public string? Total { get; set; }
        public string? Remarks { get; set; }
        public string? RecordDate { get; set; }

    }
    }
