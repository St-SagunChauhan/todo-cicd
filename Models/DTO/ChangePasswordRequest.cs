namespace ST.ERP.Models.DTO
{
    public class ChangePasswordRequest
    {
        public Guid Id { get; set; }
        public string? Password { get; set; }
        public  string? NewPassword { get; set; }
    }
}
