namespace ST.ERP.Models.DAO
{
    public class HiringList :EntityBase
    {
        public Guid HiringListId { get; set; }
        public string? Name { get; set; }
        public string? SourceofCV { get; set; }
        public string? ContactDetails { get; set; }
        public string? Department { get; set; }
        public string? Designation { get; set; }
        public string? Email { get; set; }
        public string? InterviewScheduled { get; set; }
        public string? TotalExperience { get; set; }
        public string? CurrentSalary { get; set; }
        public string? ExpectedSalary { get; set; }
        public string? PFAccount { get; set; }
        public string? CurrentEmployer { get; set; }
        public string? NoticePeriod { get; set; }
        public string? Result { get; set; }
        public string? Remarks { get; set; }
        public string? Round { get; set; }
        public string? ConductedBy { get; set; }
    }
}
