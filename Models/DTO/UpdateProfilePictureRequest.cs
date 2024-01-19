namespace ST.ERP.Models.DTO
{
    public class UpdateProfilePictureRequest
    {
        public Guid? EmployeeId { get; set; }

        public string? ProfilePicture { get; set; }
    }
}
