namespace ST.ERP.Models.DTO
{
    public class ProjectDepartmentRequest
    {
        public Guid Id { get; set; }
        public Guid? DepartmentId { get; set; }
        public Guid? ProjectId { get; set; }
        public Guid? CreatedBy { get; set; }
        public Guid? LastModifiedBy { get; set; }
    }
}
