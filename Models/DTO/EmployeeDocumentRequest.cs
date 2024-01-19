namespace ST.ERP.Models.DTO
{
    public class EmployeeDocumentRequest
    {
        public Guid EmpDocId { get; set; }
        public string? Name { get; set; }
        public string? Number { get; set; }
        public byte[]? Image { get; set; }
        public Guid EmployeeId { get; set; }
    }   
}
