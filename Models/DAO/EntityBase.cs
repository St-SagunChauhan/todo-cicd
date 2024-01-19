namespace ST.ERP.Models.DAO
{
    public class EntityBase
    {
        public DateTime CreatedDate { get; set; }
        public DateTime? LastModified { get; set; }
        public Guid? CreatedBy { get; set; }
        public Guid? LastModifiedBy { get; set; }
    }
}
