using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static ST.ERP.Helper.Enums;

namespace ST.ERP.Models.DAO
{
    public class ProjectHealth:EntityBase
    {
        [Key]
        public Guid Id { get; set; }
        public DateTime Date { get; set; }
        public int? ProjectHealthRate { get; set; }
        [ForeignKey("ProjectId")]
        public Guid? ProjectId { get; set; }
        [ForeignKey("Client")]
        public Guid? ClientId { get; set; }
        public string? Comments { get; set; }
        public Project? Projects { get; set; }
        public Client? Clients { get; set; }
        public bool IsActive { get; set; }
        public string? Issue {  get; set; }
        public string? Solution {  get; set; }
        public string? Remarks {  get; set; }
    }
}
