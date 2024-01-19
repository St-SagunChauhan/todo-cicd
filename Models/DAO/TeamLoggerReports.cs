using System.ComponentModel.DataAnnotations;

namespace ST.ERP.Models.DAO
{
    public class TeamLoggerReport : EntityBase
    {
        [Key]
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Department { get; set; }
        public string? Timer { get; set; }
        public string? Manual { get; set; }
        public string? Inactive { get; set; }
        public string? StartDay { get; set; }
        public string? NextDay { get; set; }
        public DateTime? RecordDate { get; set; }
        public string? Total { get; set; }
        public string? Remarks { get; set; }
    }
}
