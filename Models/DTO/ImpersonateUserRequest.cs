namespace ST.ERP.Models.DTO
{
    public class ImpersonateUserRequest
    {
        public Guid ImpersonatedUserId { get; set; }
        public Guid? ImpersonatorId { get; set; }
    }
}
