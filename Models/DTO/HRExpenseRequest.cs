using ST.ERP.Helper.Impoter_Utilites;

namespace ST.ERP.Models.DTO
{
    public class HRExpenseRequest : FormFileUpload
    {
        public string? ExpenseYear { get; set; }
    }
    public class ImporterHR_ExpenseRequest
    {
        public string? ExpenseName { get; set; }
        public string? January { get; set; }
        public string? February { get; set; }
        public string? March { get; set; }
        public string? April { get; set; }
        public string? May { get; set; }
        public string? June { get; set; }
        public string? July { get; set; }
        public string? August { get; set; }
        public string? September { get; set; }
        public string? October { get; set; }
        public string? November { get; set; }
        public string? December { get; set; }
        public string? ExpenseYear { get; set; }

    }

    public class ImporterHiringList 
    {
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
